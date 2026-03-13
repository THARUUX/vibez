/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, CheckCircle2, Loader2, Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PriceDisplay } from "@/components/common/PriceDisplay";
export default function ProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                toast.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
                    <span className="font-black uppercase tracking-[0.3em] text-surface-400">Loading Specifications</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-8">
                <Box className="w-24 h-24 text-surface-200" />
                <h1 className="text-5xl font-black text-surface-950 uppercase tracking-tighter">Part Not Found</h1>
                <Link href="/products" className="apex-button">Return to Inventory</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-surface-400 hover:text-brand-600 font-black mb-16 group transition-all uppercase tracking-[0.2em] text-[10px]"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Parts Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-[4rem] overflow-hidden bg-white border border-surface-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </motion.div>

                {/* Product Details */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="bg-surface-950 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                {product.category?.name?.toUpperCase() || 'GENERAL'}
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                <CheckCircle2 size={12} />
                                Certified In Stock
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-outfit text-surface-950 uppercase tracking-tighter leading-[0.9] mb-4">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest bg-surface-100 px-3 py-1 rounded-md">Serial: {product.id.substring(0, 12).toUpperCase()}</div>
                            <div className="h-4 w-px bg-surface-200" />
                            <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Apex Genuine Component</div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-baseline gap-2">
                            <PriceDisplay amount={product.price} className="text-6xl font-black text-surface-950 font-outfit tracking-tighter" />
                            <span className="text-surface-400 font-bold text-sm uppercase">Inc. VAT</span>
                        </div>
                        <p className="text-surface-500 font-medium text-xl leading-relaxed max-w-xl italic">
                            "{product.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            onClick={() => {
                                addItem(product);
                                toast.success(`${product.name} added to cart!`, {
                                    icon: <ShoppingCart size={16} />
                                });
                            }}
                            className="apex-button py-6 text-base"
                        >
                            <ShoppingCart size={24} />
                            ADD TO APEX CART
                        </button>
                        <button className="bg-white border-2 border-surface-200 hover:border-surface-950 text-surface-950 px-8 py-6 rounded-2xl font-black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-surface-50 shadow-sm active:scale-95">
                            Technical Data Sheet
                        </button>
                    </div>

                    {/* Features/Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-surface-200">
                        {[
                            { icon: ShieldCheck, title: "2-YEAR", sub: "FULL WARRANTY" },
                            { icon: Truck, title: "EXPRESS", sub: "LOGISTICS" },
                            { icon: RotateCcw, title: "30-DAY", sub: "EASY RETURNS" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-4">
                                <div className="w-12 h-12 bg-surface-950 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-surface-950 uppercase tracking-widest">{item.title}</div>
                                    <div className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mt-0.5">{item.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
