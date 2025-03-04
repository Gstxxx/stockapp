'use client';

import { useState, FormEvent } from 'react';

interface Product {
    id?: number;
    name: string;
    price: number;
    quantity: number;
}

interface ProductFormProps {
    product?: Product;
    onSubmit: (product: Product) => Promise<void>;
    onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [quantity, setQuantity] = useState(product?.quantity || 0);
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

        if (quantity < 0) {
            setError('Quantidade não pode ser negativa');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit({
                id: product?.id,
                name: name.trim(),
                price,
                quantity
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
    const handlePriceChange = (value: string) => {
        // Remover caracteres não numéricos
        const numericValue = value.replace(/\D/g, '');
        setPrice(numericValue ? parseInt(numericValue) : 0);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold">
                {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do Produto
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço (R$)
                </label>
                <input
                    type="text"
                    id="price"
                    value={formatCurrency(price)}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantidade em Estoque
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
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
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
                </button>
            </div>
        </form>
    );
} 