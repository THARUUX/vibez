"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Box, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

const products = [
    {
        id: "1",
        name: "Premium Ceramic Brake Pads",
        price: 89.99,
        description: "High-performance ceramic compound engineered for stopping power and low dust.",
        image: "https://images.unsplash.com/photo-1598083842605-7af83fb18ebd?auto=format&fit=crop&q=80&w=800",
        category: "Brakes"
    },
    {
        id: "2",
        name: "Synthetic Motor Oil 5W-30",
        price: 34.99,
        description: "Full synthetic motor oil designed for optimal engine protection and performance.",
        image: "https://images.unsplash.com/photo-1610493864198-4eabd27df61a?auto=format&fit=crop&q=80&w=800",
        category: "Fluids"
    },
    {
        id: "3",
        name: "Performance Air Filter",
        price: 45.99,
        description: "High-flow cotton gauze air filter for increased horsepower and acceleration.",
        image: "https://images.unsplash.com/photo-1610493863481-9b7e779a543f?auto=format&fit=crop&q=80&w=800",
        category: "Engine"
    }
];

export function Hero() {
    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface-50">
            {/* Clean Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50 rounded-full blur-[100px] opacity-70" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-surface-100 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-200 text-surface-600 font-bold text-sm mb-8 shadow-sm"
                >
                    <Target size={16} className="text-brand-600" />
                    <span className="tracking-wide">PREMIUM AUTO SPARES</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-outfit font-black tracking-tighter mb-6 leading-tight text-surface-950"
                >
                    POWER YOUR<br />
                    <span className="text-brand-600">
                        PERFORMANCE
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-surface-600 max-w-2xl mb-12 font-medium"
                >
                    Discover high-quality motor spare parts, OEM replacements, and performance components engineered for durability and reliability.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link href="/products" className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-95 flex items-center justify-center gap-2 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            SHOP CATALOG <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link href="/about" className="group px-8 py-4 bg-white border border-surface-200 hover:border-brand-600 text-surface-900 font-bold rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-brand-600 focus:outline-none">
                        VIEW CATEGORIES
                    </Link>
                </motion.div>

                {/* Stats / Features */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-4xl"
                >
                    {[
                        { icon: Zap, title: "Fast Shipping", desc: "Same-day dispatch" },
                        { icon: Target, title: "Exact Fitment", desc: "Guaranteed compatibility" },
                        { icon: Box, title: "Quality Assured", desc: "OEM standards" },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:border-brand-300 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon size={24} className="text-brand-600" />
                            </div>
                            <h3 className="text-xl font-bold font-outfit text-surface-900 mb-2">{feature.title}</h3>
                            <p className="text-surface-600 font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export function FeaturedProducts() {
    return (
        <section className="py-24 relative z-10 bg-surface-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12 border-b border-surface-200 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-outfit font-black tracking-tight text-surface-900 mb-2">
                            NEW <span className="text-brand-600">ARRIVALS</span>
                        </h2>
                        <p className="text-surface-600 font-medium text-lg">The latest additions to our extensive catalog.</p>
                    </div>
                    <Link href="/products" className="hidden md:flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest text-sm font-bold group">
                        View All Parts <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden group border border-surface-200 hover:border-brand-300 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <div className="relative h-64 overflow-hidden bg-surface-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-surface-900 shadow-sm border border-surface-200 uppercase">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-6 relative">
                                <h3 className="text-xl font-black font-outfit text-surface-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-surface-600 text-sm mb-6 line-clamp-2 font-medium">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <PriceDisplay amount={product.price} className="font-outfit text-3xl font-black text-surface-900" />
                                    <Link href={`/products/${product.id}`} className="px-5 py-2.5 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white font-bold rounded-lg transition-colors text-sm flex items-center gap-2">
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
