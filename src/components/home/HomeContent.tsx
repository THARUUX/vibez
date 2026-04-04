/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Box, ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useState, useEffect } from "react";

const m = motion as any;
export function Hero() {
    return (
        <div className="relative min-h-[90vh] flex flex-col justify-center pt-16 md:pt-32 md:pb-20 overflow-hidden bg-surface-50 font-outfit">
            {/* Simple Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-50 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-surface-100 rounded-full blur-[80px]" />
            </div>

            <div className="container md:mx-auto px-4 relative z-10 flex flex-col items-center text-center md:mt-8">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-surface-200 text-surface-600 font-bold text-[10px] mb-8 shadow-sm uppercase tracking-[0.2em]"
                >
                    <Target size={14} className="text-brand-600" />
                    <span>🇱🇰 SRI LANKA'S FAVOURITE PRINT SHOP</span>
                </m.div>

                <m.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl w-fit flex flex-col md:items-center md:text-9xl font-black tracking-tighter mb-6 leading-[0.85] text-surface-950 uppercase"
                >
                    ONLY GOOD<br />
                    <Image src="/logo.avif" alt="Logo" className="w-64 md:w-100" width={500} height={500} />
                    {/* <span className="text-brand-600 neon-text">
                        VIBEZ
                    </span> */}
                </m.h1>

                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-md md:text-2xl text-surface-500 max-w-2xl mb-12 font-light text-start md:text-center leading-relaxed"
                >
                    High-quality prints of your favorite Anime series and K-pop idols. Premium collectors' editions delivered right to your doorstep.
                </m.p>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link href="/catalog" className="vibez-button min-w-[240px]">
                        BROWSE BOOKS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/catalog" className="px-8 py-4 bg-white border-2 border-surface-200 hover:border-brand-600 text-surface-950 font-black rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider text-sm min-w-[240px]">
                        VIEW CATEGORIES
                    </Link>
                </m.div>

                {/* Stats / Features */}
                <m.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-32 w-full max-w-5xl text-left"
                >
                    {[
                        { icon: Truck, title: "Islandwide Delivery", desc: "Delivered to any corner of Sri Lanka" },
                        { icon: Box, title: "Premium Packing", desc: "Safe arrival for every collection" },
                        { icon: Zap, title: "Best Quality", desc: "Vibrant colors & high GSM paper" },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-surface-100 hover:border-brand-200 transition-all group hover:bg-white hover:shadow-2xl">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                <feature.icon size={24} className="text-brand-600 md:size-[32px] group-hover:text-white" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-surface-950 mb-2 md:mb-3 uppercase tracking-tight leading-none">{feature.title}</h3>
                            <p className="text-surface-500 text-xs md:text-base font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </m.div>
            </div>
        </div>
    );
}

export function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/products?limit=3');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return null; // Or a skeleton if you prefer

    return (
        <section className="py-32 relative z-10 bg-white font-outfit">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-surface-950 mb-4 uppercase">
                            MUST-HAVE <span className="text-brand-600">COLLECTIONS</span>
                        </h2>
                        <p className="text-surface-500 font-medium text-xl max-w-xl">Explore our hand-picked favorites for this season.</p>
                    </div>
                    <Link href="/catalog" className="vibez-button px-8 py-3 bg-surface-950 hover:bg-black border-none">
                        All Books <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, idx) => (
                        <m.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="vibez-card group shadow-brand-600/5 hover:shadow-brand-600/10"
                        >
                            <div className="relative h-96 overflow-hidden bg-surface-50">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
                                />
                                <div className="absolute top-6 right-6 z-20 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                                    {product.category?.name || "Exclusive Pick"}
                                </div>
                            </div>

                            <div className="p-10 relative bg-white">
                                <h3 className="text-3xl font-black text-surface-950 mb-3 leading-none group-hover:text-brand-600 transition-colors uppercase tracking-tighter">
                                    {product.name}
                                </h3>
                                <p className="text-surface-400 text-sm mb-10 line-clamp-2 font-medium leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-surface-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-300 uppercase tracking-widest mb-1">Price</span>
                                        <PriceDisplay amount={product.price} className="text-3xl font-black text-surface-950" />
                                    </div>
                                    <Link href={`/catalog/${product.slug}`} className="w-16 h-16 bg-surface-950 hover:bg-brand-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90">
                                        <ShoppingCart size={28} />
                                    </Link>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
