"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Menu, X, Hexagon, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { items: cartItems, setCartOpen } = useCartStore();
    const { user, status, logout } = useAuthStore();
    const storeName = useSettingsStore(state => state.storeName);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 glass border-b border-surface-200 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-brand-600"
                        >
                            <Hexagon size={32} />
                        </motion.div>
                        <span className="font-outfit font-black text-2xl tracking-tighter text-surface-900 group-hover:text-brand-600 transition-all duration-300 uppercase">
                            {storeName}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/products" className="text-surface-600 hover:text-brand-600 font-bold transition-colors">
                            Parts Catalog
                        </Link>
                        <Link href="/categories" className="text-surface-600 hover:text-brand-600 font-bold transition-colors">
                            Categories
                        </Link>
                        <Link href="/about" className="text-surface-600 hover:text-brand-600 font-bold transition-colors">
                            About Us
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Auth Status */}
                        <div className="hidden md:flex items-center gap-4">
                            {status === "authenticated" ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={user?.role === "admin" ? "/admin" : "/profile"}
                                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-50 rounded-full transition-all border border-surface-200 group shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-surface-950 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{user?.name}</span>
                                        {user?.role === "admin" && <LayoutDashboard size={14} className="text-brand-600" />}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-surface-400 hover:text-red-600 transition-colors"
                                        title="Log Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/auth/register"
                                        className="px-6 py-2.5 bg-white border border-surface-200 hover:border-brand-600 text-surface-900 font-bold rounded-xl transition-all text-sm uppercase tracking-widest"
                                    >
                                        Register
                                    </Link>
                                    <Link
                                        href="/auth/login"
                                        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 active:scale-95 text-sm uppercase tracking-widest"
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 text-surface-900 hover:text-brand-600 transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                                >
                                    {totalItems}
                                </motion.div>
                            )}
                        </motion.button>
                        <button className="md:hidden text-surface-900" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 z-40 bg-surface-50/98 backdrop-blur-xl pt-24 px-4 md:hidden pointer-events-none data-[open=true]:pointer-events-auto"
                data-open={isOpen}
            >
                <nav className="flex flex-col gap-6 text-2xl font-outfit font-bold">
                    <Link href="/products" onClick={() => setIsOpen(false)} className="text-surface-900 hover:text-brand-600 hover:translate-x-4 transition-all duration-300">
                        Parts Catalog
                    </Link>
                    <Link href="/categories" onClick={() => setIsOpen(false)} className="text-surface-900 hover:text-brand-600 hover:translate-x-4 transition-all duration-300">
                        Categories
                    </Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-surface-900 hover:text-brand-600 hover:translate-x-4 transition-all duration-300">
                        About Us
                    </Link>
                </nav>
            </motion.div>
        </>
    );
}
