'use client';

import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
    onRegisterSale: (product: Product) => void;
}

export default function ProductTable({
    products,
    onEdit,
    onDelete,
    onRegisterSale
}: ProductTableProps) {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Preço
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estoque
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                Nenhum produto cadastrado
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(product.price * product.quantity)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {confirmDelete === product.id ? (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setConfirmDelete(null)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDelete(product.id);
                                                    setConfirmDelete(null);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => onRegisterSale(product)}
                                                className="text-green-600 hover:text-green-900"
                                                disabled={product.quantity <= 0}
                                            >
                                                Vender
                                            </button>
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(product.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
} 