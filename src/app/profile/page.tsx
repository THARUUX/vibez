"use client";

import { motion } from "framer-motion";
import { User, Package, MapPin, Clock, ArrowRight, LogOut, Loader2, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PriceDisplay } from "@/components/common/PriceDisplay";

export default function ProfilePage() {
    const { user, logout, status } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`/api/orders?userId=${user.id}`);
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch user orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchUserOrders();
    }, [user?.id]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface-50 pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Sidebar / Info */}
                        <aside className="lg:col-span-4 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-4xl p-8 border border-surface-200 shadow-sm"
                            >
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="w-24 h-24 bg-brand-600 rounded-full flex items-center justify-center text-white font-black text-4xl mb-4 relative ring-8 ring-brand-50">
                                        {user.name[0]}
                                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                                    </div>
                                    <h1 className="text-2xl font-black text-surface-950 uppercase tracking-tight">{user.name}</h1>
                                    <p className="text-surface-500 font-medium lowercase italic">{user.email}</p>
                                </div>

                                <div className="space-y-2 pt-6 border-t border-surface-100">
                                    <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-2xl text-surface-600">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-surface-100 shadow-sm">
                                            <Package size={16} />
                                        </div>
                                        <div className="text-xs font-black uppercase tracking-widest flex-1">Total Orders</div>
                                        <div className="font-black text-surface-950">{orders.length}</div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 text-surface-400">
                                        <div className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center border border-transparent">
                                            <Clock size={16} />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest flex-1">Member Since</div>
                                        <div className="text-[10px] font-black">MAR 2024</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        logout();
                                        router.push("/");
                                    }}
                                    className="w-full mt-8 py-4 bg-surface-100 hover:bg-red-50 text-surface-600 hover:text-red-600 font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-transparent hover:border-red-100"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </motion.div>

                            <div className="bg-brand-600 rounded-4xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
                                    <Package size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2">Apex Loyalty</h3>
                                    <p className="text-brand-100 text-sm font-medium mb-6 leading-relaxed">You're 2 orders away from unlocking Performance Tier shipping rates.</p>
                                    <button className="px-6 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">Details</button>
                                </div>
                            </div>
                        </aside>

                        {/* Order History */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-surface-950 uppercase tracking-tighter flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                                        <Package size={24} />
                                    </div>
                                    Order history
                                </h2>
                                <div className="hidden sm:flex items-center gap-2 text-surface-400 font-bold text-xs uppercase tracking-widest">
                                    <Clock size={14} /> Chronological Order
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-4xl p-24 border border-surface-200 shadow-sm text-center flex flex-col items-center"
                                >
                                    <div className="w-20 h-20 bg-surface-50 rounded-3xl flex items-center justify-center text-surface-200 mb-6 border border-surface-100">
                                        <Package size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-surface-950 uppercase mb-2 tracking-tight">No Transactions Yet</h3>
                                    <p className="text-surface-500 font-medium mb-8 max-w-xs">You haven't placed any orders yet. Browse our high-performance catalog to get started.</p>
                                    <button
                                        onClick={() => router.push("/products")}
                                        className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs"
                                    >
                                        Go To Catalog
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order, idx) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white rounded-4xl p-8 border border-surface-200 shadow-sm hover:border-brand-300 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-black text-surface-400 uppercase tracking-widest">Transaction # {order.id.substring(0, 8).toUpperCase()}</span>
                                                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                    'bg-brand-50 text-brand-600 border border-brand-100'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-bold text-surface-950 flex items-center gap-2">
                                                        <Clock size={14} className="text-surface-300" />
                                                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">Total Revenue</div>
                                                    <PriceDisplay amount={order.total} className="text-2xl font-black text-surface-950 font-outfit" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-surface-100">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-4">Units Dispatched</h4>
                                                    <div className="flex -space-x-3 overflow-hidden">
                                                        {order.orderItems.map((item: any, i: number) => (
                                                            <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-50 shadow-sm" title={item.product.name}>
                                                                <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                                                            </div>
                                                        ))}
                                                        {order.orderItems.length > 5 && (
                                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-100 flex items-center justify-center text-[10px] font-bold text-surface-600 shadow-sm">
                                                                +{order.orderItems.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <button className="px-6 py-3 bg-surface-50 hover:bg-brand-600 hover:text-white rounded-xl text-surface-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group/btn">
                                                        View Full Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
