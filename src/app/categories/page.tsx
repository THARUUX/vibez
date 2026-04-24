/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import {
    RiFlashlightFill,
    RiDiscFill,
    RiDropFill,
    RiSettings3Fill,
    RiExpandDiagonalFill,
    RiLightbulbFlashFill,
    RiArrowRightLine,
    RiLoader4Line,
    RiPriceTag3Fill,
    RiToolsFill
} from "react-icons/ri";
import Link from "next/link";
import { useState, useEffect } from "react";

const m = motion as any;

// Icon mapping for categories
const iconMap: Record<string, any> = {
    "performance": RiFlashlightFill,
    "maintenance": RiToolsFill,
    "brakes": RiDiscFill,
    "suspension": RiExpandDiagonalFill,
    "lighting": RiLightbulbFlashFill,
    "engine": RiSettings3Fill,
    "fluids": RiDropFill
};

// Color mapping for categories
const colorMap: Record<string, string> = {
    "performance": "bg-purple-50 text-purple-600 border border-purple-100",
    "maintenance": "bg-amber-50 text-amber-600 border border-amber-100",
    "brakes": "bg-red-50 text-red-600 border border-red-100",
    "suspension": "bg-emerald-50 text-emerald-600 border border-emerald-100",
    "lighting": "bg-orange-50 text-orange-600 border border-orange-100",
    "engine": "bg-blue-50 text-blue-600 border border-blue-100",
    "fluids": "bg-cyan-50 text-cyan-600 border border-cyan-100"
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-surface-50 min-h-screen pt-32 pb-20 font-outfit">
            <div className="container mx-auto px-4">
                <div className="mb-16 border-b border-surface-200 pb-8 relative">
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-0 hidden md:block text-surface-100"
                    >
                        <RiPriceTag3Fill size={120} />
                    </m.div>

                    <m.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-surface-950 uppercase relative z-10"
                    >
                        CATEGORY <span className="text-brand-600 drop-shadow-[0_4px_20px_rgba(220,38,38,0.1)]">VIBEZ</span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-surface-500 max-w-2xl text-lg font-light relative z-10"
                    >
                        Explore our comprehensive catalog organized by collections to find exactly what you need.
                    </m.p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <RiLoader4Line className="w-12 h-12 text-brand-600 animate-spin" />
                        <p className="text-surface-400 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Catalog</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, i) => {
                            const IconComponent = iconMap[cat.slug] || RiPriceTag3Fill;
                            const colorClass = colorMap[cat.slug] || "bg-surface-50 text-surface-600 border border-surface-100";

                            return (
                                <m.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className="group block bg-white border border-surface-200 p-8 rounded-[2.5rem] hover:border-brand-300 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-300 h-full relative overflow-hidden"
                                    >
                                        <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                            <IconComponent size={32} />
                                        </div>

                                        <h2 className="text-2xl font-black text-surface-950 mb-3 uppercase tracking-tight group-hover:text-brand-600 transition-colors line-clamp-1">
                                            {cat.name}
                                        </h2>

                                        <p className="text-surface-500 font-medium mb-8 line-clamp-2 leading-relaxed">
                                            {cat.description || "Explore high-quality items for this collection."}
                                        </p>

                                        <div className="flex items-center justify-between text-sm font-black tracking-widest uppercase mt-auto pt-4 border-t border-surface-50">
                                            <span className="text-surface-400 group-hover:text-brand-600 transition-colors italic text-xs">
                                                {cat._count?.products || 0} Products
                                            </span>
                                            <div className="w-10 h-10 rounded-xl bg-surface-50 border border-surface-100 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-600 group-hover:text-white transition-all">
                                                <RiArrowRightLine size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Abstract background element */}
                                        <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12">
                                            <IconComponent size={180} />
                                        </div>
                                    </Link>
                                </m.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
