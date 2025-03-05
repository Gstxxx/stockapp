'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface SaleSummary {
    totalSales: number;
    totalRevenue: number;
    totalQuantity: number;
}

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
    const [username, setUsername] = useState<string | null>(null);
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
                setUsername(authData.username);

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
                setLowStockProducts(productsData.filter((product: Product) => product.quantity < 5));

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
        <div className="min-h-screen bg-gray-100">
            <Navbar username={username || undefined} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

                    {loading ? (
                        <div className="text-center py-10">
                            <p>Carregando...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 p-4 rounded-md mt-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    ) : (
                        <div className="mt-6">
                            {/* Cards de resumo */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Total de produtos */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Total de Produtos
                                                    </dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">
                                                            {products.length}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Ver todos os produtos
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Valor total em estoque */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Valor Total em Estoque
                                                    </dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                products.reduce((sum, product) => sum + product.price * product.quantity, 0)
                                                            )}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Gerenciar estoque
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Vendas do dia */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        Vendas do Dia
                                                    </dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">
                                                            {formatCurrency(todaySales.totalRevenue)}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/stats" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                Ver estatísticas
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Produtos com estoque baixo */}
                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-900">Produtos com Estoque Baixo</h2>

                                {lowStockProducts.length === 0 ? (
                                    <p className="mt-2 text-gray-500">Não há produtos com estoque baixo.</p>
                                ) : (
                                    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                        Produto
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Preço
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Estoque
                                                    </th>
                                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                        <span className="sr-only">Ações</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {lowStockProducts.map((product) => (
                                                    <tr key={product.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {product.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {formatCurrency(product.price)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.quantity === 0
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {product.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <Link href={`/products?edit=${product.id}`} className="text-indigo-600 hover:text-indigo-900">
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

                            {/* Links rápidos */}
                            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900">Adicionar Produto</h3>
                                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                                            <p>Adicione um novo produto ao estoque.</p>
                                        </div>
                                        <div className="mt-5">
                                            <Link
                                                href="/products?new=true"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Adicionar Produto
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900">Registrar Venda</h3>
                                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                                            <p>Registre uma nova venda de produto.</p>
                                        </div>
                                        <div className="mt-5">
                                            <Link
                                                href="/products"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Registrar Venda
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 