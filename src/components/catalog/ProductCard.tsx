"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Activity, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useCartStore } from "@/store/cartStore";
import { alerts } from "@/lib/alerts";

const m = motion as any;

interface ProductCardProps {
    product: any;
    index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="vibez-card group"
        >
            {/* Header / Badges */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2">
                    <span className="bg-brand-600 text-white px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 flex items-center gap-2">
                        {product.category?.name || "Premium Collection"}
                    </span>
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">
                            Last {product.stock} Left!
                        </span>
                    )}
                </div>
            </div>

            {/* Image Container */}
            <Link 
                href={`/catalog/${product.slug}`} 
                className="relative h-96 overflow-hidden bg-surface-50 flex items-center justify-center p-8"
            >
                <m.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-2xl transition-all duration-500"
                    />
                </m.div>
                
                {/* Overlay with Quick View hint */}
                <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/5 transition-all duration-700 pointer-events-none" />
            </Link>

            {/* Content */}
            <div className="p-10 flex flex-col flex-1 relative bg-white">
                <div className="mb-4">
                    <span className="text-[8px] font-black text-surface-300 uppercase tracking-[0.3em] mb-1 block leading-none">
                        VIBE-ID-{product.sku || "UNKN"}
                    </span>
                    <h2 className="text-3xl font-black text-surface-950 uppercase tracking-tighter group-hover:text-brand-600 transition-colors line-clamp-2 leading-none">
                        {product.name}
                    </h2>
                </div>

                <p className="text-surface-400 font-medium text-xs mb-10 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-auto space-y-6">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-surface-300 uppercase tracking-widest mb-1">Store Price</span>
                            <PriceDisplay amount={product.price} className="text-4xl font-black text-surface-950 tracking-tighter" />
                        </div>
                        
                        <m.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                addItem(product);
                                alerts.toast(`${product.name} ADDED TO CART`);
                            }}
                            className="w-16 h-16 bg-surface-950 hover:bg-brand-600 text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl active:bg-brand-700 group/btn"
                        >
                            <ShoppingCart size={28} className="group-hover/btn:rotate-12 transition-transform" />
                        </m.button>
                    </div>

                    <Link 
                        href={`/catalog/${product.slug}`}
                        className="flex items-center justify-center gap-3 w-full py-5 border-2 border-surface-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-brand-600 hover:border-brand-600/20 hover:bg-surface-50 transition-all duration-300"
                    >
                        View Details
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
            
            {/* Decoration line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-100 group-hover:bg-brand-600 transition-colors duration-700" />
        </m.div>
    );
}
