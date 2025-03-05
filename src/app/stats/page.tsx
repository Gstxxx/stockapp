'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SalesChart from '@/components/SalesChart';

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

interface StatsSummary {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
}

interface StatsData {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    summary: StatsSummary;
    productSales: ProductSale[];
    timeGroupedSales: TimeGroupedSale[];
}

export default function StatsPage() {
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState<string | null>(null);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const router = useRouter();

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Buscar estatísticas
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Construir URL com parâmetros
                let url = `/api/stats?period=${period}`;
                if (startDate) url += `&startDate=${startDate}`;
                if (endDate) url += `&endDate=${endDate}`;

                const response = await fetch(url);

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Erro ao buscar estatísticas');
                }

                const data = await response.json();
                setStatsData(data);

                // Simular busca do nome do usuário
                setUsername('Usuário');
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar estatísticas');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router, period, startDate, endDate]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Definir datas iniciais
    useEffect(() => {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        // Definir data de fim como hoje
        setEndDate(formattedToday);

        // Definir data de início com base no período
        const startDateObj = new Date(today);

        switch (period) {
            case 'daily':
                // Hoje
                setStartDate(formattedToday);
                break;
            case 'weekly':
                // 7 dias atrás
                startDateObj.setDate(startDateObj.getDate() - 7);
                setStartDate(startDateObj.toISOString().split('T')[0]);
                break;
            case 'monthly':
                // 30 dias atrás
                startDateObj.setDate(startDateObj.getDate() - 30);
                setStartDate(startDateObj.toISOString().split('T')[0]);
                break;
            case 'yearly':
                // 365 dias atrás
                startDateObj.setDate(startDateObj.getDate() - 365);
                setStartDate(startDateObj.toISOString().split('T')[0]);
                break;
        }
    }, [period]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar username={username || undefined} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-semibold text-gray-900">Estatísticas de Vendas</h1>

                    {/* Filtros */}
                    <div className="mt-4 bg-white p-4 rounded-lg shadow">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                                    Período
                                </label>
                                <select
                                    id="period"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value as any)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="yearly">Anual</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                    Data Inicial
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                    Data Final
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-100 p-4 rounded-md">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-10">
                            <p>Carregando...</p>
                        </div>
                    ) : statsData ? (
                        <div className="mt-6">
                            {/* Cards de resumo */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                {/* Total de vendas */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total de Vendas
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {statsData.summary.totalSales}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>

                                {/* Quantidade vendida */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Quantidade Vendida
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {statsData.summary.totalQuantity}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>

                                {/* Valor total */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Valor Total
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {formatCurrency(statsData.summary.totalRevenue)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Gráficos */}
                            <div className="mt-8">
                                {statsData.timeGroupedSales.length === 0 ? (
                                    <div className="bg-white p-4 rounded-lg shadow text-center">
                                        <p className="text-gray-500">Não há dados de vendas para o período selecionado.</p>
                                    </div>
                                ) : (
                                    <SalesChart
                                        timeGroupedSales={statsData.timeGroupedSales}
                                        productSales={statsData.productSales}
                                        period={statsData.period}
                                    />
                                )}
                            </div>

                            {/* Tabela de vendas por produto */}
                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-900">Vendas por Produto</h2>

                                {statsData.productSales.length === 0 ? (
                                    <p className="mt-2 text-gray-500">Não há dados de vendas para o período selecionado.</p>
                                ) : (
                                    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Produto
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Quantidade
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Valor Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {statsData.productSales.map((productSale) => (
                                                    <tr key={productSale.productId}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {productSale.productName}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {productSale.totalQuantity}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatCurrency(productSale.totalRevenue)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 bg-white p-4 rounded-lg shadow text-center">
                            <p className="text-gray-500">Não há dados disponíveis.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 