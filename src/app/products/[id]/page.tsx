"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";
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
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-6">
                <h1 className="text-4xl font-black text-surface-950 uppercase">Product Not Found</h1>
                <Link href="/products" className="text-brand-600 font-bold hover:underline">Back to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-surface-500 hover:text-brand-600 font-bold mb-12 group transition-colors uppercase tracking-widest text-xs"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Inventory
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-surface-200 shadow-2xl shadow-surface-200/50"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* Product Details */}
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-brand-50 text-brand-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-100">
                                {product.category?.name?.toUpperCase() || 'GENERAL'}
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <CheckCircle2 size={14} />
                                In Stock
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black font-outfit text-surface-950 uppercase tracking-tighter leading-tight mb-4">
                            {product.name}
                        </h1>
                        <div className="text-xs font-black text-surface-400 uppercase tracking-widest">Part Reference: AX-{product.id.substring(0, 8)}</div>
                    </div>

                    <div className="space-y-4">
                        <PriceDisplay amount={product.price} className="text-5xl font-black text-brand-600 font-outfit" />
                        <p className="text-surface-600 font-medium text-lg leading-relaxed max-w-xl">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => addItem(product)}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-600/20 uppercase tracking-widest text-sm"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                        <button className="bg-white border border-surface-200 hover:bg-surface-50 text-surface-950 px-8 py-5 rounded-2xl font-black transition-all uppercase tracking-widest text-sm shadow-sm">
                            Compare
                        </button>
                    </div>

                    {/* Features/Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-surface-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white border border-surface-200 rounded-xl text-brand-600">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none">
                                2-Year <br /> Warranty
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white border border-surface-200 rounded-xl text-brand-600">
                                <Truck size={20} />
                            </div>
                            <div className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none">
                                Fast <br /> Logistics
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white border border-surface-200 rounded-xl text-brand-600">
                                <RotateCcw size={20} />
                            </div>
                            <div className="text-[10px] font-black text-surface-900 uppercase tracking-widest leading-none">
                                30-Day <br /> Returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
