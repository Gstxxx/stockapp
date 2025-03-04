'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface TimeGroupedSale {
    period: string;
    totalQuantity: number;
    totalRevenue: number;
    sales: number;
}

interface ProductSale {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface SalesChartProps {
    timeGroupedSales: TimeGroupedSale[];
    productSales: ProductSale[];
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function SalesChart({
    timeGroupedSales,
    productSales,
    period
}: SalesChartProps) {
    const [timeChartData, setTimeChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: []
    });

    const [productChartData, setProductChartData] = useState<ChartData<'bar'>>({
        labels: [],
        datasets: []
    });

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Configurações do gráfico de linha (vendas por período)
    const timeChartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Vendas por Período',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${label.includes('Valor') ? formatCurrency(value) : value}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value;
                    }
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value as number);
                    }
                }
            }
        }
    };

    // Configurações do gráfico de barras (vendas por produto)
    const productChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Vendas por Produto',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${label.includes('Valor') ? formatCurrency(value) : value}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value;
                    }
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value as number);
                    }
                }
            }
        }
    };

    // Preparar dados para o gráfico de linha (vendas por período)
    useEffect(() => {
        if (timeGroupedSales.length === 0) return;

        // Ordenar vendas por período
        const sortedSales = [...timeGroupedSales].sort((a, b) => {
            return new Date(a.period).getTime() - new Date(b.period).getTime();
        });

        // Formatar rótulos de acordo com o período
        const labels = sortedSales.map(sale => {
            const date = new Date(sale.period);

            switch (period) {
                case 'daily':
                    return `${date.getHours()}:00`;
                case 'weekly':
                case 'monthly':
                    return date.toLocaleDateString('pt-BR');
                case 'yearly':
                    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                default:
                    return sale.period;
            }
        });

        setTimeChartData({
            labels,
            datasets: [
                {
                    label: 'Quantidade Vendida',
                    data: sortedSales.map(sale => sale.totalQuantity),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Valor Total (R$)',
                    data: sortedSales.map(sale => sale.totalRevenue),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                }
            ]
        });
    }, [timeGroupedSales, period]);

    // Preparar dados para o gráfico de barras (vendas por produto)
    useEffect(() => {
        if (productSales.length === 0) return;

        // Ordenar vendas por valor total (decrescente)
        const sortedSales = [...productSales].sort((a, b) => b.totalRevenue - a.totalRevenue);

        setProductChartData({
            labels: sortedSales.map(sale => sale.productName),
            datasets: [
                {
                    label: 'Quantidade Vendida',
                    data: sortedSales.map(sale => sale.totalQuantity),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Valor Total (R$)',
                    data: sortedSales.map(sale => sale.totalRevenue),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                }
            ]
        });
    }, [productSales]);

    return (
        <div className="space-y-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <Line options={timeChartOptions} data={timeChartData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <Bar options={productChartOptions} data={productChartData} />
            </div>
        </div>
    );
} 