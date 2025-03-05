'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, DollarSign, Package, CreditCard } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductFormProps {
    product?: Product;
    onSubmit: (product: Product) => Promise<void>;
    onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [priceCard, setPriceCard] = useState(product?.priceCard || 0);
    const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 0);
    const [saleQuantity, setSaleQuantity] = useState(product?.saleQuantity || 0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEditing = !!product?.id;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (!name.trim()) {
            setError('Nome do produto é obrigatório');
            return;
        }

        if (price <= 0) {
            setError('Preço deve ser maior que zero');
            return;
        }

        if (stockQuantity < 0) {
            setError('Quantidade em estoque não pode ser negativa');
            return;
        }

        if (saleQuantity < 0) {
            setError('Quantidade para venda não pode ser negativa');
            return;
        }

        if (saleQuantity > stockQuantity) {
            setError('Quantidade para venda não pode ser maior que o estoque');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit({
                id: product?.id || 0,
                name: name.trim(),
                price,
                priceCard: priceCard > 0 ? priceCard : undefined,
                stockQuantity,
                saleQuantity,
                createdAt: product?.createdAt || new Date(),
                updatedAt: new Date()
            });
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Função para converter valor monetário em centavos
    const handlePriceChange = (value: string, setter: (value: number) => void) => {
        // Remover caracteres não numéricos
        const numericValue = value.replace(/\D/g, '');
        setter(numericValue ? parseInt(numericValue) : 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
                    >
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </motion.h2>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2"
                        >
                            <AlertCircle className="w-5 h-5 text-red-300" />
                            <p className="text-red-300">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <label htmlFor="name" className="block text-sm font-medium text-orange-200">
                            Nome do Produto
                        </label>
                        <div className="mt-1 relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="h-5 w-5 text-orange-300/50" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg 
                                         text-white placeholder-white/30 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                                         transition-all duration-200"
                                placeholder="Digite o nome do produto"
                                required
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label htmlFor="price" className="block text-sm font-medium text-orange-200">
                                Preço (R$)
                            </label>
                            <div className="mt-1 relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-orange-300/50" />
                                </div>
                                <input
                                    type="text"
                                    id="price"
                                    value={formatCurrency(price)}
                                    onChange={(e) => handlePriceChange(e.target.value, setPrice)}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg 
                                         text-white placeholder-white/30 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                                         transition-all duration-200"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label htmlFor="priceCard" className="block text-sm font-medium text-orange-200">
                                Preço Cartão (R$)
                            </label>
                            <div className="mt-1 relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-orange-300/50" />
                                </div>
                                <input
                                    type="text"
                                    id="priceCard"
                                    value={formatCurrency(priceCard)}
                                    onChange={(e) => handlePriceChange(e.target.value, setPriceCard)}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg 
                                         text-white placeholder-white/30 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                                         transition-all duration-200"
                                    placeholder="Opcional"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label htmlFor="stockQuantity" className="block text-sm font-medium text-orange-200">
                                Quantidade em Estoque
                            </label>
                            <input
                                type="number"
                                id="stockQuantity"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                                min="0"
                                className="mt-1 block w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg 
                                         text-white placeholder-white/30 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                                         transition-all duration-200"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label htmlFor="saleQuantity" className="block text-sm font-medium text-orange-200">
                                Quantidade para Venda
                            </label>
                            <input
                                type="number"
                                id="saleQuantity"
                                value={saleQuantity}
                                onChange={(e) => setSaleQuantity(parseInt(e.target.value) || 0)}
                                min="0"
                                max={stockQuantity}
                                className="mt-1 block w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg 
                                         text-white placeholder-white/30 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                                         transition-all duration-200"
                                required
                            />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end space-x-3 mt-8"
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white
                                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 
                                 text-white font-medium shadow-lg hover:shadow-orange-500/20 
                                 transform hover:-translate-y-0.5 transition-all duration-200
                                 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Salvando...
                            </div>
                        ) : (
                            isEditing ? 'Atualizar' : 'Adicionar'
                        )}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
} 