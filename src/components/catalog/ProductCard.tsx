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
            {/* Image Container */}
            <Link 
                href={`/products/${product.slug}`} 
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
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-brand-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                        {product.category?.name || "Official VibeZ"}
                    </span>
                    {product.tags && product.tags.split(',').map((tag: string) => (
                        <span key={tag} className="bg-surface-100 text-surface-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-surface-200">
                            {tag.trim()}
                        </span>
                    ))}
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                            Last {product.stock} Left!
                        </span>
                    )}
                </div>

                <div className="mb-4">
                    <span className="text-[8px] font-black text-surface-300 uppercase tracking-[0.3em] mb-1 block leading-none">
                        VIBE-ID-{product.sku || "UNKN"}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                        <h2 className="text-3xl font-black text-surface-950 uppercase tracking-tighter group-hover:text-brand-600 transition-colors line-clamp-2 leading-none">
                            {product.name}
                        </h2>
                    </Link>
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
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                addItem(product);
                                alerts.toast(`${product.name} ADDED TO CART`);
                            }}
                            className="vibez-button w-full sm:w-auto"
                        >
                            <ShoppingCart size={18} />
                            <span>Add to Cart</span>
                        </m.button>
                    </div>

                    {/* <Link 
                        href={`/products/${product.slug}`}
                        className="flex items-center justify-center gap-3 w-full py-5 border-2 border-surface-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-surface-400 hover:text-brand-600 hover:border-brand-600/20 hover:bg-surface-50 transition-all duration-300"
                    >
                        View Details
                        <ArrowRight size={14} />
                    </Link> */}
                </div>
            </div>
            
            {/* Decoration line */}
            {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-100 group-hover:bg-brand-600 transition-colors duration-700" /> */}
        </m.div>
    );
}
