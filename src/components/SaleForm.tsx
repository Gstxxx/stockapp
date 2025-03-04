'use client';

import { useState, FormEvent } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface SaleFormProps {
    product: Product;
    onSubmit: (productId: number, quantity: number) => Promise<void>;
    onCancel: () => void;
}

export default function SaleForm({ product, onSubmit, onCancel }: SaleFormProps) {
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (quantity <= 0) {
            setError('Quantidade deve ser maior que zero');
            return;
        }

        if (quantity > product.quantity) {
            setError('Quantidade não pode ser maior que o estoque disponível');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit(product.id, quantity);
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar venda');
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">Registrar Venda</h2>

            {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <p>
                    <span className="font-medium">Produto:</span> {product.name}
                </p>
                <p>
                    <span className="font-medium">Preço unitário:</span> {formatCurrency(product.price)}
                </p>
                <p>
                    <span className="font-medium">Estoque disponível:</span> {product.quantity}
                </p>
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantidade Vendida
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    min="1"
                    max={product.quantity}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div className="pt-2">
                <p className="font-medium">
                    Valor Total: {formatCurrency(product.price * quantity)}
                </p>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={loading || quantity <= 0 || quantity > product.quantity}
                >
                    {loading ? 'Registrando...' : 'Registrar Venda'}
                </button>
            </div>
        </form>
    );
} 