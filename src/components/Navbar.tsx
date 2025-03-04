'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
    username?: string;
    onLogout?: () => void;
}

export default function Navbar({ username, onLogout }: NavbarProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/products', label: 'Produtos' },
        { href: '/stats', label: 'Estatísticas' },
    ];

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/dashboard" className="text-white font-bold text-xl">
                                Controle de Estoque
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(link.href)
                                                ? 'bg-indigo-700 text-white'
                                                : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {username ? (
                                <div className="flex items-center">
                                    <span className="text-indigo-200 mr-4">Olá, {username}</span>
                                    <button
                                        onClick={onLogout}
                                        className="px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-500 hover:text-white"
                                    >
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-500 hover:text-white"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {username ? (
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLogout?.();
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:bg-indigo-500 hover:text-white"
                            >
                                Sair
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:bg-indigo-500 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
} 