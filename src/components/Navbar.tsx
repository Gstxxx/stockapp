'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Package, BarChart2, LogOut, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavbarProps {
    username?: string;
}

export default function Navbar({ username }: NavbarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/products', label: 'Produtos', icon: Package },
        { href: '/stats', label: 'Estatísticas', icon: BarChart2 },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-lg bg-gray-800/90 text-white/70 hover:text-white
                             backdrop-blur-lg border border-white/10 shadow-lg"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.nav
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className={`fixed left-0 top-0 h-screen z-40
                          bg-gradient-to-b from-gray-900 to-gray-800 border-r border-white/10 
                          backdrop-blur-xl shadow-xl
                          transition-all duration-300 ease-in-out
                          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                          md:translate-x-0
                          ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 flex items-center justify-between">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-bold bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
                            >
                                Estoque
                            </motion.div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white
                                     transition-colors duration-200 hidden md:block"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-5 h-5" />
                            ) : (
                                <ChevronLeft className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 py-6 flex flex-col gap-2 px-3">
                        {navLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium 
                                                 transition-all duration-200 group
                                                 ${isActive(link.href)
                                                ? 'bg-orange-500/20 text-orange-300'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <Icon className={`w-5 h-5 ${!isCollapsed && 'mr-3'} transition-colors duration-200 
                                                      ${isActive(link.href) ? 'text-orange-300' : 'text-white/50 group-hover:text-white/70'}`}
                                        />
                                        {!isCollapsed && <span>{link.label}</span>}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* User Section */}
                    <div className="p-4 border-t border-white/10">
                        {username ? (
                            <div className="space-y-2">
                                {!isCollapsed && (
                                    <p className="text-sm text-white/70 px-3 truncate">
                                        Olá, {username}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center px-3 py-3 rounded-lg text-sm font-medium
                                         text-white/70 hover:bg-white/10 hover:text-white
                                         transition-all duration-200"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <LogIn className={`w-5 h-5 ${!isCollapsed && 'mr-3'}`} />
                                {!isCollapsed && <span>Login</span>}
                            </Link>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Main Content Wrapper - Adicione isso ao layout principal */}
            <div className={`transition-all duration-300 
                         ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}
                         ml-0`}>
                {/* Seu conteúdo principal vai aqui */}
            </div>
        </>
    );
} 