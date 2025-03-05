'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductTable from '@/components/ProductTable';
import ProductForm from '@/components/ProductForm';
import SaleForm from '@/components/SaleForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { toast } from 'sonner';
interface ProductFormData extends Omit<Product, 'id'> {
    id?: number;
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

    const handleRegisterSale = async (productId: number, quantity: number, paymentMethod: string) => {
        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity, paymentMethod }),
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

    const handleRestock = async (product: Product, amount: number) => {
        try {
            // Validações locais
            if (amount <= 0) {
                toast.error('Quantidade deve ser maior que zero');
                return;
            }

            if (amount > product.stockQuantity) {
                toast.error('Quantidade insuficiente em estoque');
                return;
            }

            // Chamada à API
            const response = await fetch(`/api/products/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao reabastecer produto');
            }

            const updatedProduct = await response.json();

            // Atualizar a lista de produtos
            setProducts(products.map(p =>
                p.id === updatedProduct.id ? updatedProduct : p
            ));

            toast.success('Estoque reabastecido com sucesso!');
        } catch (error) {
            console.error('Erro ao reabastecer:', error);
            toast.error(error instanceof Error ? error.message : 'Erro ao reabastecer produto');
        }
    };

    const handleMainRestock = async (product: Product, amount: number) => {
        try {
            // Validações locais
            if (amount <= 0) {
                toast.error('Quantidade deve ser maior que zero');
                return;
            }

            // Chamada à API
            const response = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao reabastecer estoque');
            }

            const updatedProduct = await response.json();

            // Atualizar a lista de produtos
            setProducts(products.map(p =>
                p.id === updatedProduct.id ? updatedProduct : p
            ));

            toast.success('Estoque reabastecido com sucesso!');
        } catch (error) {
            console.error('Erro ao reabastecer estoque:', error);
            toast.error(error instanceof Error ? error.message : 'Erro ao reabastecer estoque');
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
                    <div className="flex justify-between items-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
                        >
                            Produtos
                        </motion.h1>

                        {!showNewForm && !editingProduct && !sellingProduct && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNewForm(true)}
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 
                                text-white font-medium shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Adicionar Produto
                            </motion.button>
                        )}
                    </div>

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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="rounded-xl overflow-hidden shadow-2xl"
                            >
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
                                        onRestock={handleRestock}
                                        onRestockMain={handleMainRestock}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
} 