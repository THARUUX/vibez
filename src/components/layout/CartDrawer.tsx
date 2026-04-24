/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    RiShoppingBag3Line, RiCloseLine, RiArrowRightLine,
    RiDeleteBinLine, RiAddLine, RiSubtractLine, RiShieldCheckLine
} from "react-icons/ri";
import { useCartStore } from "@/store/cartStore";
import { alerts } from "@/lib/alerts";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import gsap from "gsap";

const m = motion as any;

export function CartDrawer() {
    const { items, isCartOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();
    const drawerRef = useRef<HTMLDivElement>(null);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleRemove = (id: string, name: string) => {
        gsap.to(`[data-cart-id="${id}"]`, {
            x: 40, opacity: 0, duration: 0.25, ease: "power2.in",
            onComplete: () => {
                removeItem(id);
                alerts.toast(`${name} removed.`);
            }
        });
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-50 bg-surface-950/20 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <m.div
                        key="cart-drawer"
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col overflow-hidden safe-bottom bg-white border-l border-surface-200 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-surface-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50 border border-brand-100">
                                    <RiShoppingBag3Line size={20} className="text-brand-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-surface-950 uppercase tracking-tight leading-none">
                                        Your Cart
                                    </h2>
                                    <span className="text-[9px] text-surface-400 uppercase tracking-widest font-bold">
                                        {items.length} item{items.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>
                            <m.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCartOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-surface-400 hover:text-surface-950 hover:bg-surface-50 transition-all"
                            >
                                <RiCloseLine size={22} />
                            </m.button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
                            {items.length === 0 ? (
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center py-16 px-6"
                                >
                                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-surface-50 border border-dashed border-surface-200">
                                        <RiShoppingBag3Line size={40} className="text-surface-300" />
                                    </div>
                                    <p className="text-xl font-black text-surface-950 uppercase tracking-tight mb-2">Cart is Empty</p>
                                    <p className="text-sm text-surface-500 mb-8 leading-relaxed font-medium">
                                        Start adding some vibes to your collection.
                                    </p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-black text-xs uppercase tracking-[0.2em] transition-colors group"
                                    >
                                        Browse Catalog
                                        <RiArrowRightLine size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </m.div>
                            ) : (
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <m.div
                                            key={item.id}
                                            data-cart-id={item.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 40 }}
                                            className="flex gap-4 p-4 rounded-2xl group transition-all duration-300 bg-white border border-surface-100 shadow-sm hover:shadow-md hover:border-brand-200"
                                        >
                                            {/* Image */}
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-50 border border-surface-100">
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="min-w-0">
                                                        <h3 className="font-black text-surface-950 text-sm uppercase tracking-tight leading-tight line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                        <PriceDisplay
                                                            amount={item.price}
                                                            className="text-brand-600 font-black text-base mt-1"
                                                        />
                                                    </div>
                                                    <m.button
                                                        whileTap={{ scale: 0.85 }}
                                                        onClick={() => handleRemove(item.id, item.name)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-300 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                                                    >
                                                        <RiDeleteBinLine size={16} />
                                                    </m.button>
                                                </div>

                                                {/* Quantity */}
                                                <div className="flex items-center gap-2 mt-2 w-fit bg-surface-50 border border-surface-100 rounded-lg p-1">
                                                    <m.button
                                                        whileTap={{ scale: 0.85 }}
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-7 h-7 flex items-center justify-center rounded-md text-surface-500 hover:text-surface-950 hover:bg-white hover:shadow-sm transition-all"
                                                    >
                                                        <RiSubtractLine size={14} />
                                                    </m.button>
                                                    <span className="text-sm font-black text-surface-950 w-5 text-center tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <m.button
                                                        whileTap={{ scale: 0.85 }}
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-md text-surface-500 hover:text-surface-950 hover:bg-white hover:shadow-sm transition-all"
                                                    >
                                                        <RiAddLine size={14} />
                                                    </m.button>
                                                </div>
                                            </div>
                                        </m.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="shrink-0 px-5 py-5 border-t border-surface-100 bg-surface-50"
                            >
                                {/* Total */}
                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <span className="text-[9px] font-black text-surface-400 uppercase tracking-[0.3em] block mb-1">
                                            Estimated Total
                                        </span>
                                        <span className="text-[9px] text-surface-400 font-medium italic">
                                            Shipping at checkout
                                        </span>
                                    </div>
                                    <PriceDisplay amount={total} className="text-4xl font-black text-surface-950 tracking-tighter" />
                                </div>

                                {/* CTA */}
                                <Link
                                    href="/checkout"
                                    onClick={() => setCartOpen(false)}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-sm text-white transition-all duration-300 group bg-gradient-to-r from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 active:scale-95"
                                >
                                    <span>Checkout</span>
                                    <RiArrowRightLine size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {/* Trust Badge */}
                                <div className="flex items-center justify-center gap-2 mt-4 text-surface-400">
                                    <RiShieldCheckLine size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">
                                        Secure Transaction
                                    </span>
                                </div>
                            </m.div>
                        )}
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}
