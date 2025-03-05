'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoxIcon, Edit2, Trash2, ShoppingCart, AlertCircle, MoreVertical, RefreshCw, PackagePlus } from 'lucide-react';
import { Product } from '@/types/product';
interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
    onRegisterSale: (product: Product) => void;
    onRestock: (product: Product, amount: number) => void;
    onRestockMain: (product: Product, amount: number) => void;
}

const ActionMenu = ({
    product,
    onEdit,
    onDelete,
    onRegisterSale,
    onRestock,
    onRestockMain,
    confirmDelete,
    setConfirmDelete
}: {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onRegisterSale: (product: Product) => void;
    onRestock: (product: Product, amount: number) => void;
    onRestockMain: (product: Product, amount: number) => void;
    confirmDelete: number | null;
    setConfirmDelete: (id: number | null) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showRestockInput, setShowRestockInput] = useState(false);
    const [showMainRestockInput, setShowMainRestockInput] = useState(false);
    const [restockAmount, setRestockAmount] = useState(0);
    const [mainRestockAmount, setMainRestockAmount] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fechar menu quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRestock = () => {
        if (restockAmount <= 0) {
            return; // Poderíamos adicionar um feedback de erro aqui
        }
        if (restockAmount > product.stockQuantity) {
            return; // Poderíamos adicionar um feedback de erro aqui
        }
        onRestock(product, restockAmount);
        setRestockAmount(0);
        setShowRestockInput(false);
        setIsOpen(false);
    };

    const handleMainRestock = () => {
        if (mainRestockAmount <= 0) return;
        onRestockMain(product, mainRestockAmount);
        setMainRestockAmount(0);
        setShowMainRestockInput(false);
        setIsOpen(false);
    };

    return (
        <div className="relative " ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
                <MoreVertical className="w-4 h-4 text-white/70" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800/90 backdrop-blur-sm 
                                 shadow-xl border border-white/10 z-50"
                        style={{ transformOrigin: 'top right' }}
                    >
                        {showMainRestockInput ? (
                            <div className="p-2 space-y-1">
                                <p className="text-white/70 text-sm px-3 py-2">
                                    Quantidade para estoque
                                </p>
                                <input
                                    type="number"
                                    value={mainRestockAmount}
                                    onChange={(e) => setMainRestockAmount(parseInt(e.target.value) || 0)}
                                    min="1"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md 
                                             text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500/50 
                                             focus:border-transparent text-sm"
                                    placeholder="Digite a quantidade"
                                />
                                <button
                                    onClick={handleMainRestock}
                                    disabled={mainRestockAmount <= 0}
                                    className="w-full text-left px-3 py-2 text-sm text-blue-300 
                                             hover:bg-blue-500/20 rounded-md transition-colors duration-200 
                                             flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PackagePlus className="w-4 h-4 mr-2" />
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMainRestockInput(false);
                                        setMainRestockAmount(0);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-300 
                                             hover:bg-gray-500/20 rounded-md transition-colors duration-200 
                                             flex items-center"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : showRestockInput ? (
                            <div className="p-2 space-y-1">
                                <p className="text-white/70 text-sm px-3 py-2">
                                    Quantidade para reabastecimento
                                </p>
                                <input
                                    type="number"
                                    value={restockAmount}
                                    onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                                    min="1"
                                    max={product.stockQuantity}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md 
                                             text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 
                                             focus:border-transparent text-sm"
                                    placeholder="Digite a quantidade"
                                />
                                <button
                                    onClick={handleRestock}
                                    disabled={restockAmount <= 0 || restockAmount > product.stockQuantity}
                                    className="w-full text-left px-3 py-2 text-sm text-emerald-300 
                                             hover:bg-emerald-500/20 rounded-md transition-colors duration-200 
                                             flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRestockInput(false);
                                        setRestockAmount(0);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-300 
                                             hover:bg-gray-500/20 rounded-md transition-colors duration-200 
                                             flex items-center"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : confirmDelete === product.id ? (
                            <div className="p-2 space-y-1">
                                <p className="text-white/70 text-sm px-3 py-2">
                                    Confirmar exclusão?
                                </p>
                                <button
                                    onClick={() => {
                                        onDelete(product.id);
                                        setConfirmDelete(null);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 
                                             rounded-md transition-colors duration-200 flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-500/20 
                                             rounded-md transition-colors duration-200 flex items-center"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => {
                                        onRegisterSale(product);
                                        setIsOpen(false);
                                    }}
                                    disabled={product.saleQuantity <= 0}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 
                                              flex items-center ${product.saleQuantity <= 0
                                            ? 'text-gray-500 cursor-not-allowed'
                                            : 'text-green-300 hover:bg-green-500/20'
                                        }`}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Registrar Venda
                                </button>
                                <button
                                    onClick={() => setShowRestockInput(true)}
                                    disabled={product.stockQuantity <= 0}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 
                                              flex items-center ${product.stockQuantity <= 0
                                            ? 'text-gray-500 cursor-not-allowed'
                                            : 'text-emerald-300 hover:bg-emerald-500/20'
                                        }`}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reabastecer Vendas
                                </button>
                                <button
                                    onClick={() => setShowMainRestockInput(true)}
                                    className="w-full text-left px-3 py-2 text-sm text-blue-300 
                                             hover:bg-blue-500/20 rounded-md transition-colors duration-200 
                                             flex items-center"
                                >
                                    <PackagePlus className="w-4 h-4 mr-2" />
                                    Reabastecer Estoque
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit(product);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/20 
                                             rounded-md transition-colors duration-200 flex items-center"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(product.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 
                                             rounded-md transition-colors duration-200 flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ProductTable({
    products,
    onEdit,
    onDelete,
    onRegisterSale,
    onRestock,
    onRestockMain
}: ProductTableProps) {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    // Função para formatar o preço como moeda
    const formatCurrency = (value: number) => {
        return (value / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    return (
        <div className="mt-10 w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/20">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                            {['Nome', 'Preço', 'Estoque', 'A venda', 'Valor Total', 'Ações'].map((header, index) => (
                                <motion.th
                                    key={index}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="px-6 py-4 text-left text-xs font-medium text-orange-300 uppercase tracking-wider"
                                >
                                    {header}
                                </motion.th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/20">
                        <AnimatePresence>
                            {products.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <AlertCircle className="w-12 h-12 mb-2" />
                                            <span className="text-sm">Nenhum produto cadastrado</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : (
                                products.map((product) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onHoverStart={() => setHoveredRow(product.id)}
                                        onHoverEnd={() => setHoveredRow(null)}
                                        className={`
                                            transition-colors duration-200
                                            ${hoveredRow === product.id ? 'bg-white/5' : 'bg-transparent'}
                                        `}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-white/90 font-medium">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white/90">{formatCurrency(product.price)}</span>
                                                {product.priceCard && (
                                                    <span className="text-xs text-orange-300/60">
                                                        Cartão: {formatCurrency(product.priceCard)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${product.stockQuantity > 10
                                                ? 'bg-green-500/20 text-green-300'
                                                : product.stockQuantity > 0
                                                    ? 'bg-yellow-500/20 text-yellow-300'
                                                    : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                <BoxIcon className="w-4 h-4 text-orange-300/60 mr-2" />
                                                <span >
                                                    {product.stockQuantity} unidades
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${product.saleQuantity > 10
                                                ? 'bg-green-500/20 text-green-300'
                                                : product.saleQuantity > 0
                                                    ? 'bg-yellow-500/20 text-yellow-300'
                                                    : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                <BoxIcon className="w-4 h-4 text-orange-300/60 mr-2" />
                                                <span className="text-white/90">{product.saleQuantity} unidades</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white/90 font-medium">
                                                {formatCurrency(product.price * product.saleQuantity)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <ActionMenu
                                                    product={product}
                                                    onEdit={onEdit}
                                                    onDelete={onDelete}
                                                    onRegisterSale={onRegisterSale}
                                                    onRestock={onRestock}
                                                    onRestockMain={onRestockMain}
                                                    confirmDelete={confirmDelete}
                                                    setConfirmDelete={setConfirmDelete}
                                                />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
} 