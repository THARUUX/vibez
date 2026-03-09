"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Truck,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Package,
    Lock
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import Link from "next/link";
import Image from "next/image";

type Step = "shipping" | "payment" | "success";

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>("shipping");
    const { items, clearCart } = useCartStore();
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
    });

    if (items.length === 0 && step !== "success") {
        return (
            <div className="min-h-screen bg-surface-50 pt-32 pb-12 flex flex-col items-center justify-center container mx-auto px-4 text-center">
                <div className="w-24 h-24 bg-surface-100 rounded-3xl flex items-center justify-center text-surface-300 mb-8 border border-surface-200">
                    <Package size={48} />
                </div>
                <h1 className="text-4xl font-outfit font-black text-surface-950 uppercase mb-4 tracking-tight">Your cart is empty</h1>
                <p className="text-surface-500 font-medium mb-10 max-w-sm">Add some high-performance auto parts to your cart before checking out.</p>
                <Link href="/products" className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-brand-600/20 uppercase tracking-widest">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                {/* Checkout Header (Not needed if navigation is clear, but good for focus) */}
                <div className="max-w-6xl mx-auto">
                    {step !== "success" && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-outfit font-black text-surface-950 uppercase tracking-tighter mb-2">SECURE <span className="text-brand-600">CHECKOUT</span></h1>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest">
                                    <ShieldCheck size={18} />
                                    <span>Military-grade encryption active</span>
                                </div>
                            </div>

                            {/* Progress Stepper */}
                            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-surface-200 shadow-sm">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === "shipping" ? "bg-brand-600 text-white" : "text-surface-500"}`}>
                                    <Truck size={18} />
                                    <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline">Shipping</span>
                                </div>
                                <ChevronRight size={16} className="text-surface-300" />
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === "payment" ? "bg-brand-600 text-white" : "text-surface-400"}`}>
                                    <CreditCard size={18} />
                                    <span className="font-bold text-sm uppercase tracking-widest hidden sm:inline">Payment</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {step === "shipping" && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-surface-200 shadow-sm"
                                    >
                                        <h2 className="text-2xl font-black text-surface-950 mb-8 uppercase tracking-tight flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                                <Truck size={24} />
                                            </div>
                                            Shipping Details
                                        </h2>

                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-500 font-bold"
                                                    placeholder="John"
                                                    value={shippingData.firstName}
                                                    onChange={e => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-500 font-bold"
                                                    placeholder="Doe"
                                                    value={shippingData.lastName}
                                                    onChange={e => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-10">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Delivery Address</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-500 font-bold"
                                                    placeholder="123 Performance Way"
                                                    value={shippingData.address}
                                                    onChange={e => setShippingData({ ...shippingData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-500 font-bold"
                                                        placeholder="Detroit"
                                                        value={shippingData.city}
                                                        onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Zip Code</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-500 font-bold"
                                                        placeholder="48201"
                                                        value={shippingData.zip}
                                                        onChange={e => setShippingData({ ...shippingData, zip: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setStep("payment")}
                                            className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-brand-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                                        >
                                            Continue to Payment <ChevronRight size={20} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-surface-200 shadow-sm"
                                    >
                                        <button
                                            onClick={() => setStep("shipping")}
                                            className="flex items-center gap-2 text-surface-400 hover:text-brand-600 font-bold uppercase tracking-widest text-xs mb-8 transition-colors group"
                                        >
                                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shipping
                                        </button>

                                        <h2 className="text-2xl font-black text-surface-950 mb-8 uppercase tracking-tight flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                                <CreditCard size={24} />
                                            </div>
                                            Payment Method
                                        </h2>

                                        <div className="space-y-6 mb-10">
                                            <div className="p-6 bg-surface-950 rounded-3xl text-white relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
                                                    <CreditCard size={120} />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-12">
                                                        <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center">
                                                            <div className="w-8 h-8 rounded-full bg-brand-600" />
                                                        </div>
                                                        <span className="font-outfit font-black text-xl italic opacity-50">APEX</span>
                                                    </div>
                                                    <p className="text-2xl font-mono tracking-[0.3em] mb-4">•••• •••• •••• 4012</p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Card Holder</p>
                                                            <p className="font-bold tracking-widest">{shippingData.firstName || "YOUR"} {shippingData.lastName || "NAME"}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Expires</p>
                                                            <p className="font-bold tracking-widest">12/28</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Card Number</label>
                                                <input readOnly type="text" className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 font-bold" value="•••• •••• •••• 4012" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Expiry</label>
                                                    <input readOnly type="text" className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 font-bold" value="12/28" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">CVV / Security</label>
                                                    <input readOnly type="password" className="w-full bg-surface-50 border border-surface-200 rounded-2xl px-6 py-4 font-bold" value="•••" />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                clearCart();
                                                setStep("success");
                                            }}
                                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                                        >
                                            Complete Transaction <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                        <p className="text-center mt-6 text-surface-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Lock size={12} /> Encrypted via Apex Secure Gateway
                                        </p>
                                    </motion.div>
                                )}

                                {step === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-4xl p-12 md:p-24 border border-surface-200 shadow-2xl text-center"
                                    >
                                        <div className="w-24 h-24 bg-emerald-50 rounded-4xl flex items-center justify-center text-emerald-600 mx-auto mb-10 border border-emerald-100">
                                            <CheckCircle2 size={56} className="animate-bounce" />
                                        </div>
                                        <h2 className="text-4xl font-outfit font-black text-surface-950 uppercase tracking-tight mb-4">ORDER <span className="text-emerald-600">CONFIRMED</span></h2>
                                        <p className="text-surface-500 font-medium mb-12 max-w-sm mx-auto">Thank you for choosing Apex Auto Parts. Your order #AX-90210 has been processed and is awaiting dispatch.</p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link href="/products" className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-brand-600/20 uppercase tracking-widest">
                                                Back to Shop
                                            </Link>
                                            <Link href="/profile" className="px-10 py-4 bg-surface-100 hover:bg-surface-200 text-surface-900 font-black rounded-2xl transition-all uppercase tracking-widest">
                                                Track Order
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        {step !== "success" && (
                            <div className="lg:col-span-1" />
                        )}
                        {step !== "success" && (
                            <aside className="lg:col-span-4 sticky top-32">
                                <div className="bg-white rounded-4xl p-8 border border-surface-200 shadow-sm">
                                    <h3 className="text-xl font-black text-surface-950 mb-8 uppercase tracking-tight">Order Summary</h3>

                                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="w-16 h-16 bg-surface-50 rounded-xl overflow-hidden border border-surface-100 shrink-0">
                                                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-surface-950 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-surface-500 font-medium">Qty: {item.quantity}</p>
                                                    <PriceDisplay amount={item.price * item.quantity} className="text-sm font-black text-brand-600" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-surface-100">
                                        <div className="flex justify-between text-sm font-bold text-surface-500 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <PriceDisplay amount={total} />
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-surface-500 uppercase tracking-widest">
                                            <span>Shipping</span>
                                            <span className="text-emerald-600">FREE</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-surface-200">
                                            <span className="text-lg font-black text-surface-950 uppercase tracking-tight">Total</span>
                                            <PriceDisplay amount={total} className="text-2xl font-black text-surface-950" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2 text-surface-400 font-bold text-xs uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-brand-600" />
                                    Buyer Protection Enabled
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
