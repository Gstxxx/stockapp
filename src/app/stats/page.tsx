'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SalesChart from '@/components/SalesChart';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, DollarSign, Package, Loader2 } from 'lucide-react';

interface TimeGroupedSale {
    period: string;
    totalQuantity: number;
    totalRevenue: number;
    sales: number;
    paymentMethods: {
        [key: string]: {
            total: number;
            count: number;
        }
    };
}

interface ProductSale {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
    lastSaleTime: string;
    paymentMethods: {
        [key: string]: {
            total: number;
            count: number;
        }
    };
}

interface StatsSummary {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
    paymentMethods: {
        [key: string]: {
            total: number;
            count: number;
        }
    };
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
        <div className="min-h-screen bg-transparent">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
                {/* Efeito de luz de fundo */}
                <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full transform -translate-y-1/2"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent mb-8"
                    >
                        Estatísticas de Vendas
                    </motion.h1>

                    {/* Filtros */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl p-6 mb-6"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label htmlFor="period" className="block text-sm font-medium text-gray-300 mb-1">
                                    Período
                                </label>
                                <select
                                    id="period"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value as any)}
                                    className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white 
                                             focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="yearly">Anual</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                                    Data Inicial
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white 
                                             focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                                    Data Final
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-white 
                                             focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
                            >
                                <p className="text-red-300">{error}</p>
                            </motion.div>
                        )}

                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-20"
                            >
                                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                            </motion.div>
                        ) : statsData ? (
                            <div className="space-y-8">
                                {/* Cards de resumo */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                    {/* Total de vendas */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-orange-500/20 rounded-lg p-3">
                                                    <BarChart2 className="h-6 w-6 text-orange-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Total de Vendas
                                                        </dt>
                                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                                            {statsData.summary.totalSales || 0}
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Quantidade vendida */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-green-500/20 rounded-lg p-3">
                                                    <Package className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Quantidade Vendida
                                                        </dt>
                                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                                            {statsData.summary.totalQuantity || 0}
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Valor total */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-500/20 rounded-lg p-3">
                                                    <DollarSign className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Valor Total
                                                        </dt>
                                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                                            {formatCurrency(statsData.summary.totalRevenue || 0)}
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Resumo dos métodos de pagamento */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl p-6"
                                >
                                    <h2 className="text-lg font-medium text-white mb-4">Formas de Pagamento</h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {Object.keys(statsData.summary.paymentMethods || {}).length > 0 ? (
                                            Object.entries(statsData.summary.paymentMethods).map(([method, data]) => (
                                                <div key={method} className="bg-gray-700/30 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-300 capitalize">{method}</span>
                                                        <span className="text-sm text-gray-400">{data.count} vendas</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="text-2xl font-semibold text-white">
                                                            {formatCurrency(data.total)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-4">
                                                <p className="text-gray-400">Nenhuma venda registrada no período.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Gráficos */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl p-6"
                                >
                                    {statsData.timeGroupedSales.length > 0 ? (
                                        <SalesChart
                                            timeGroupedSales={statsData.timeGroupedSales}
                                            productSales={statsData.productSales}
                                            period={statsData.period}
                                        />
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-400">Não há dados de vendas para o período selecionado.</p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Tabela de vendas por produto */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                >
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-white mb-4">Vendas por Produto</h2>

                                        {statsData.productSales.length > 0 ? (
                                            <div className="overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-700">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Produto
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Quantidade
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Valor Total
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Última Venda
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Métodos de Pagamento
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-700">
                                                        {statsData.productSales.map((productSale) => (
                                                            <tr key={productSale.productId}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                                    {productSale.productName}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                    {productSale.totalQuantity}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                                    <div className="space-y-2">
                                                                        {Object.entries(productSale.paymentMethods || {}).map(([method, data]) => (
                                                                            <div key={method} className="flex items-center justify-between border-b border-gray-700/50 pb-1 last:border-0">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="capitalize">
                                                                                        {method === 'CARD' ? 'Cartão' :
                                                                                            method === 'CASH' ? 'Dinheiro' :
                                                                                                method === 'PIX' ? 'Pix' : method}
                                                                                    </span>
                                                                                    <span className="text-gray-400">({data.count} vendas)</span>
                                                                                </div>
                                                                                <span className="ml-4 text-orange-300">{formatCurrency(data.total)}</span>
                                                                            </div>
                                                                        ))}
                                                                        <div className="flex items-center justify-between pt-1 font-medium">
                                                                            <span className="text-white">Total</span>
                                                                            <span className="ml-4 text-white">{formatCurrency(productSale.totalRevenue)}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                    {new Date(productSale.lastSaleTime).toLocaleString('pt-BR')}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                                    <div className="space-y-1">
                                                                        {Object.entries(productSale.paymentMethods || {}).map(([method, data]) => (
                                                                            <div key={method} className="flex items-center justify-between">
                                                                                <span className="capitalize">
                                                                                    {method === 'CARD' ? 'Cartão' :
                                                                                        method === 'CASH' ? 'Dinheiro' :
                                                                                            method === 'PIX' ? 'Pix' : method}
                                                                                </span>
                                                                                <span className="ml-4">{data.count} vendas</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-center py-4">Nenhuma venda registrada no período.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center"
                            >
                                <p className="text-gray-400">Não há dados disponíveis.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
} 