/* eslint-disable */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { RiArrowRightLine, RiTruckLine, RiBox3Line, RiStarLine, RiShoppingCartLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { alerts } from "@/lib/alerts";

const m = motion as any;

export function Hero() {
    const [isMobile, setIsMobile] = useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden bg-surface-50 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-dark-gradient" />
                
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-15"
                >
                    <source src="/bg-video.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 noise-overlay opacity-[0.02]" />

                {/* Animated Glow Orbs */}
                <m.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px]"
                    style={{ background: "radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)" }}
                />
            </div>

            <m.div style={{ y: y1, opacity: opacity1 }} className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-brand-200 bg-white shadow-sm"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-surface-500">
                        Official Importers
                    </span>
                </m.div>

                <h1 className="flex flex-col items-center mb-6">
                    <m.span
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="text-5xl md:text-[8rem] font-black tracking-tighter leading-[0.8] text-surface-950 uppercase text-shadow-sm"
                    >
                        ONLY GOOD
                    </m.span>
                    <m.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                        className="relative mt-6 md:mt-10"
                    >
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            className="w-48 md:w-96 drop-shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                            width={500}
                            height={150}
                            priority
                        />
                    </m.div>
                </h1>

                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-sm md:text-lg text-surface-500 max-w-xl mb-10 font-medium leading-relaxed"
                >
                    Premium quality prints, anime merchandise, and K-pop collectibles.
                    <br className="hidden md:block" /> Delivered right to your doorstep.
                </m.p>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4"
                >
                    <Link href="/catalog" className="vibez-button group w-full sm:w-auto px-10 py-5">
                        <span>Browse Collections</span>
                        <RiArrowRightLine size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </m.div>

                {/* Features Scroll Hint */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute -bottom-24 md:-bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-surface-300" style={{ writingMode: "vertical-rl" }}>
                        Scroll
                    </span>
                    <div className="w-px h-12 bg-gradient-to-b from-surface-300 to-transparent" />
                </m.div>
            </m.div>
        </div>
    );
}

export function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem, setCartOpen } = useCartStore();

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

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        alerts.success("Added to Cart", `${product.name} is ready for checkout.`);
        setCartOpen(true);
    };

    return (
        <section className="py-32 relative z-10 bg-white overflow-hidden border-t border-surface-200">
            <div className="container mx-auto px-4 sm:px-6 relative">

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-32 -mt-16 md:-mt-24 relative z-20">
                    {[
                        { icon: RiTruckLine, title: "Islandwide Delivery", desc: "Safe delivery anywhere in Sri Lanka" },
                        { icon: RiBox3Line, title: "Premium Packing", desc: "Secure packaging for collectibles" },
                        { icon: RiStarLine, title: "Highest Quality", desc: "Vibrant colors & premium materials" },
                    ].map((feature, idx) => (
                        <m.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="glass-card p-6 md:p-8 rounded-3xl group shadow-sm hover:shadow-lg border border-surface-200"
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 bg-brand-50 border border-brand-100">
                                <feature.icon size={24} className="text-brand-600" />
                            </div>
                            <h3 className="text-lg font-black text-surface-950 mb-2 uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-surface-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                        </m.div>
                    ))}
                </div>

                {/* Products Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
                    <div>
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-8 h-px bg-brand-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600">Curated Selection</span>
                        </m.div>
                        <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-surface-950 uppercase"
                        >
                            MUST-HAVE <br/><span className="text-brand-600">COLLECTIONS</span>
                        </m.h2>
                    </div>
                    <Link href="/catalog" className="vibez-button-outline shrink-0">
                        <span>View All</span>
                        <RiArrowRightLine size={16} />
                    </Link>
                </div>

                {/* Products Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {products.map((product, idx) => (
                            <m.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group relative rounded-3xl overflow-hidden bg-white border border-surface-200 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image Box */}
                                <Link href={`/products/${product.slug}`} className="relative h-[340px] block overflow-hidden bg-surface-50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-100 to-transparent z-10 opacity-60" />
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-lg"
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                                        <span className="bg-brand-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">
                                            {product.category?.name || "Exclusive"}
                                        </span>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="p-6 md:p-8 relative z-20 bg-white">
                                    <Link href={`/products/${product.slug}`}>
                                        <h3 className="text-xl font-black text-surface-950 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-surface-500 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-surface-400 uppercase tracking-[0.2em] mb-0.5">Price</span>
                                            <PriceDisplay amount={product.price} className="text-xl font-black text-surface-950" />
                                        </div>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white border border-brand-100"
                                        >
                                            <RiShoppingCartLine size={20} />
                                        </button>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
