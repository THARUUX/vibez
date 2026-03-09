"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50">
            <div className="mb-16 border-b border-surface-200 pb-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-outfit font-black tracking-tighter mb-4 text-surface-950 uppercase"
                >
                    AUTO <span className="text-brand-600">PARTS CATALOG</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-surface-600 max-w-2xl text-lg font-medium"
                >
                    Browse our complete collection of high-quality replacement parts, OEM components, and performance upgrades.
                </motion.p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-surface-400 font-bold text-xl uppercase tracking-widest">No products found in the database.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden group flex flex-col h-full border border-surface-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <Link href={`/products/${product.id}`} className="block relative h-80 overflow-hidden shrink-0 bg-surface-50">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-surface-950 shadow-sm border border-surface-200 uppercase tracking-[0.2em]">
                                    {product.category?.name || 'General'}
                                </div>
                            </Link>

                            <div className="p-8 flex flex-col flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h2 className="text-2xl font-black font-outfit text-surface-950 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                                        {product.name}
                                    </h2>
                                </Link>
                                <p className="text-surface-500 font-medium text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-surface-100">
                                    <PriceDisplay amount={product.price} className="font-outfit text-3xl font-black text-surface-950" />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addItem(product);
                                        }}
                                        className="p-4 bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white rounded-2xl transition-all duration-300 group/btn flex items-center justify-center gap-2 font-black shadow-sm"
                                    >
                                        <ShoppingCart size={22} />
                                        <span className="hidden sm:inline text-[10px] tracking-[0.2em] uppercase">Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
