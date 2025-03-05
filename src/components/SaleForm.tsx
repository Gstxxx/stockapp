'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Clock, CreditCard, Wallet, QrCode } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    priceCard?: number;
    saleQuantity: number;
}

interface SaleFormProps {
    product: Product;
    onSubmit: (productId: number, quantity: number, paymentMethod: string) => Promise<void>;
    onCancel: () => void;
}

export default function SaleForm({ product, onSubmit, onCancel }: SaleFormProps) {
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CASH' | 'CARD'>('PIX');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (quantity <= 0) {
            setError('Quantidade deve ser maior que zero');
            return;
        }

        if (quantity > product.saleQuantity) {
            setError('Quantidade não pode ser maior que o estoque disponível');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit(product.id, quantity, paymentMethod);
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar venda');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getPrice = () => {
        if (paymentMethod === 'CARD' && product.priceCard) {
            return product.priceCard;
        }
        return product.price;
    };

    const paymentMethods = [
        { value: 'PIX', label: 'PIX', icon: QrCode },
        { value: 'CASH', label: 'Dinheiro', icon: Wallet },
        { value: 'CARD', label: 'Cartão', icon: CreditCard }
    ];

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
                    Registrar Venda
                </h2>
                <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date().toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                    <p className="text-red-300">{error}</p>
                </motion.div>
            )}

            <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-white">
                        <span className="text-gray-400">Produto:</span> {product.name}
                    </p>
                    <p className="text-white">
                        <span className="text-gray-400">Preço unitário:</span> {formatCurrency(getPrice())}
                    </p>
                    <p className="text-white">
                        <span className="text-gray-400">Estoque disponível:</span> {product.saleQuantity}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Método de Pagamento
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <button
                                    key={method.value}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.value as 'PIX' | 'CASH' | 'CARD')}
                                    className={`flex flex-col items-center p-3 rounded-lg border transition-all
                                        ${paymentMethod === method.value
                                            ? 'bg-orange-500/20 border-orange-500/50'
                                            : 'bg-gray-700/30 border-white/10 hover:bg-gray-700/50'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mb-1 ${paymentMethod === method.value ? 'text-orange-400' : 'text-gray-400'
                                        }`} />
                                    <span className={`text-sm ${paymentMethod === method.value ? 'text-orange-400' : 'text-gray-300'
                                        }`}>
                                        {method.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                        Quantidade Vendida
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        min="1"
                        max={product.saleQuantity}
                        className="w-full px-3 py-2 bg-gray-700/30 border border-white/10 rounded-lg text-white
                                 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                        required
                    />
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-lg font-medium text-white">
                        Valor Total: {formatCurrency(getPrice() * quantity)}
                    </p>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium text-gray-300 
                             hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white 
                             bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 
                             focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || quantity <= 0 || quantity > product.saleQuantity}
                >
                    {loading ? 'Registrando...' : 'Registrar Venda'}
                </button>
            </div>
        </motion.form>
    );
} 