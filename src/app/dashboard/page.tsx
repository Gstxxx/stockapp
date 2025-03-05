'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import { SaleSummary } from '@/types/sale';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, DollarSign, BarChart2, Plus, ShoppingCart, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [todaySales, setTodaySales] = useState<SaleSummary>({
        totalSales: 0,
        totalRevenue: 0,
        totalQuantity: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Buscar dados do usuário, produtos e vendas
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Verificar autenticação
                const authResponse = await fetch('/api/auth/check');
                if (!authResponse.ok) {
                    window.location.href = '/login';
                    return;
                }

                const authData = await authResponse.json();

                // Buscar produtos (usando a API de teste)
                const productsResponse = await fetch('/api/products');

                if (!productsResponse.ok) {
                    if (productsResponse.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error('Erro ao buscar produtos');
                }

                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Filtrar produtos com estoque baixo (menos de 5 unidades)
                setLowStockProducts(productsData.filter((product: Product) => product.saleQuantity < 5));

                // Buscar vendas do dia (usando a API de teste)
                const today = new Date().toISOString().split('T')[0];
                const statsResponse = await fetch(`/api/stats?period=daily&startDate=${today}`);

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setTodaySales(statsData.summary);
                }
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar dados');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

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
                        Dashboard
                    </motion.h1>

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
                        ) : (
                            <div className="space-y-8">
                                {/* Cards de resumo */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Total de produtos */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-orange-500/20 rounded-lg p-3">
                                                    <Package className="h-6 w-6 text-orange-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Total de Produtos
                                                        </dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-white">
                                                                {products.length}
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/50 px-6 py-4 border-t border-white/10">
                                            <Link
                                                href="/products"
                                                className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                                            >
                                                Ver todos os produtos →
                                            </Link>
                                        </div>
                                    </motion.div>

                                    {/* Valor total em estoque */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-green-500/20 rounded-lg p-3">
                                                    <DollarSign className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Valor Total em Estoque
                                                        </dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-white">
                                                                {formatCurrency(
                                                                    products.reduce((sum, product) => sum + product.price * (product.stockQuantity + product.saleQuantity), 0)
                                                                )}
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/50 px-6 py-4 border-t border-white/10">
                                            <Link
                                                href="/products"
                                                className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Gerenciar estoque →
                                            </Link>
                                        </div>
                                    </motion.div>

                                    {/* Vendas do dia */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-500/20 rounded-lg p-3">
                                                    <BarChart2 className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-400 truncate">
                                                            Vendas do Dia
                                                        </dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-white">
                                                                {formatCurrency(todaySales.totalRevenue)}
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-800/50 px-6 py-4 border-t border-white/10">
                                            <Link
                                                href="/stats"
                                                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Ver estatísticas →
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Produtos com estoque baixo */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                >
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-white mb-4">Produtos com Estoque Baixo</h2>

                                        {lowStockProducts.length === 0 ? (
                                            <p className="text-gray-400">Não há produtos com estoque baixo.</p>
                                        ) : (
                                            <div className="overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-700">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Produto
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Preço
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                                Estoque
                                                            </th>
                                                            <th scope="col" className="relative px-6 py-3">
                                                                <span className="sr-only">Ações</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-700">
                                                        {lowStockProducts.map((product) => (
                                                            <tr key={product.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                                    {product.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                    {formatCurrency(product.price)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                        ${product.saleQuantity === 0
                                                                            ? 'bg-red-500/20 text-red-400'
                                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                                        }`}>
                                                                        {product.saleQuantity}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <Link
                                                                        href={`/products?edit=${product.id}`}
                                                                        className="text-orange-400 hover:text-orange-300 transition-colors"
                                                                    >
                                                                        Editar
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Links rápidos */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium text-white">Adicionar Produto</h3>
                                            <div className="mt-2 max-w-xl text-sm text-gray-400">
                                                <p>Adicione um novo produto ao estoque.</p>
                                            </div>
                                            <div className="mt-5">
                                                <Link
                                                    href="/products?new=true"
                                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 
                                                    text-white font-medium shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    Adicionar Produto
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium text-white">Registrar Venda</h3>
                                            <div className="mt-2 max-w-xl text-sm text-gray-400">
                                                <p>Registre uma nova venda de produto.</p>
                                            </div>
                                            <div className="mt-5">
                                                <Link
                                                    href="/products"
                                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-400 
                                                    text-white font-medium shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                                                >
                                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                                    Registrar Venda
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
} 