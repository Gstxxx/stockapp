'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductTable from '@/components/ProductTable';
import ProductForm from '@/components/ProductForm';
import SaleForm from '@/components/SaleForm';

// Definir a interface Product para corresponder à interface usada nos componentes
interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// Interface para o formulário de produto que pode ter ID opcional
interface ProductFormData {
    id?: number;
    name: string;
    price: number;
    quantity: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [sellingProduct, setSellingProduct] = useState<Product | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Buscar produtos e verificar parâmetros de URL
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/products');

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Erro ao buscar produtos');
                }

                const data = await response.json();
                setProducts(data);

                // Verificar parâmetros de URL
                const editId = searchParams.get('edit');
                const newProduct = searchParams.get('new');

                if (editId) {
                    const productToEdit = data.find((p: Product) => p.id === parseInt(editId));
                    if (productToEdit) {
                        setEditingProduct(productToEdit);
                    }
                } else if (newProduct === 'true') {
                    setShowNewForm(true);
                }

                // Simular busca do nome do usuário
                setUsername('Usuário');
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar produtos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [router, searchParams]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleAddProduct = async (productData: ProductFormData) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao adicionar produto');
            }

            const newProduct = await response.json();
            setProducts([...products, newProduct]);
            setShowNewForm(false);

            // Limpar parâmetros de URL
            router.push('/products');
        } catch (err: any) {
            throw new Error(err.message || 'Erro ao adicionar produto');
        }
    };

    const handleUpdateProduct = async (productData: ProductFormData) => {
        try {
            if (!productData.id) return;

            const response = await fetch(`/api/products/${productData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao atualizar produto');
            }

            const updatedProduct = await response.json();
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            setEditingProduct(null);

            // Limpar parâmetros de URL
            router.push('/products');
        } catch (err: any) {
            throw new Error(err.message || 'Erro ao atualizar produto');
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao excluir produto');
            }

            setProducts(products.filter(p => p.id !== productId));
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir produto');
            console.error(err);
        }
    };

    const handleRegisterSale = async (productId: number, quantity: number) => {
        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao registrar venda');
            }

            // Atualizar a lista de produtos após a venda
            const productsResponse = await fetch('/api/products');
            const updatedProducts = await productsResponse.json();
            setProducts(updatedProducts);

            setSellingProduct(null);
        } catch (err: any) {
            throw new Error(err.message || 'Erro ao registrar venda');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar username={username || undefined} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>

                        {!showNewForm && !editingProduct && !sellingProduct && (
                            <button
                                onClick={() => setShowNewForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Adicionar Produto
                            </button>
                        )}
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
                    ) : (
                        <div className="mt-6">
                            {showNewForm ? (
                                <ProductForm
                                    onSubmit={handleAddProduct}
                                    onCancel={() => {
                                        setShowNewForm(false);
                                        router.push('/products');
                                    }}
                                />
                            ) : editingProduct ? (
                                <ProductForm
                                    product={editingProduct}
                                    onSubmit={handleUpdateProduct}
                                    onCancel={() => {
                                        setEditingProduct(null);
                                        router.push('/products');
                                    }}
                                />
                            ) : sellingProduct ? (
                                <SaleForm
                                    product={sellingProduct}
                                    onSubmit={handleRegisterSale}
                                    onCancel={() => setSellingProduct(null)}
                                />
                            ) : (
                                <ProductTable
                                    products={products}
                                    onEdit={setEditingProduct}
                                    onDelete={handleDeleteProduct}
                                    onRegisterSale={setSellingProduct}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 