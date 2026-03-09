"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import Link from "next/link";

export function CartDrawer() {
    const { items, isCartOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-50 border-l border-surface-200 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-surface-200">
                            <h2 className="font-outfit text-2xl font-black tracking-tight text-surface-900 flex items-center gap-2">
                                <span className="text-brand-600">APEX</span> CART
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 hover:bg-surface-100 rounded-full transition-colors text-surface-500 hover:text-surface-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-surface-300 hover:scrollbar-thumb-brand-500 scrollbar-track-transparent">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-surface-500 space-y-4">
                                    <div className="w-24 h-24 rounded-full border border-surface-200 flex items-center justify-center mb-4 bg-surface-100">
                                        <ShoppingCart className="text-4xl text-surface-400 opacity-50" size={40} />
                                    </div>
                                    <p className="font-outfit text-xl font-medium text-surface-600">Your cart is empty.</p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="text-brand-600 hover:text-brand-700 font-bold text-sm tracking-widest uppercase transition-colors"
                                    >
                                        Return to shop
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        key={item.id}
                                        className="flex gap-4 bg-surface-100 p-3 rounded-2xl border border-surface-200 group hover:border-brand-300 transition-colors"
                                    >
                                        <div className="relative w-20 h-20 bg-surface-200 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-surface-900 text-sm line-clamp-1">{item.name}</h3>
                                                    <PriceDisplay amount={item.price} className="text-xs text-brand-600 font-bold mt-1" />
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-surface-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 bg-white rounded-lg w-fit p-1 border border-surface-200 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 text-surface-500 hover:text-brand-600 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-surface-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 text-surface-500 hover:text-brand-600 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-surface-200 bg-surface-50">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-surface-500 uppercase tracking-widest text-xs font-bold">Estimated Total</span>
                                    <PriceDisplay amount={total} className="font-outfit text-3xl font-black text-surface-900" />
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setCartOpen(false)}
                                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/30 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span>SECURE CHECKOUT</span>
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >→</motion.span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
