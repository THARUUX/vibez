"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Disc,
    Droplets,
    Settings,
    Maximize,
    Lightbulb,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

const categories = [
    {
        id: "brakes",
        name: "Braking Systems",
        icon: Disc,
        description: "High-performance ceramic and metallic brake pads, rotors, and calipers.",
        count: 124,
        color: "bg-red-50 text-red-600"
    },
    {
        id: "engine",
        name: "Engine Parts",
        icon: Settings,
        description: "Pistons, gaskets, valves, and full engine rebuild components.",
        count: 450,
        color: "bg-blue-50 text-blue-600"
    },
    {
        id: "fluids",
        name: "Fluids & Filters",
        icon: Droplets,
        description: "Synthetic oils, coolants, fuel treatments, and high-flow filters.",
        count: 89,
        color: "bg-amber-50 text-amber-600"
    },
    {
        id: "suspension",
        name: "Suspension",
        icon: Maximize,
        description: "Shock absorbers, struts, control arms, and lowering kits.",
        count: 210,
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        id: "ignition",
        name: "Ignition",
        icon: Zap,
        description: "Spark plugs, ignition coils, and performance wiring.",
        count: 65,
        color: "bg-purple-50 text-purple-600"
    },
    {
        id: "lighting",
        name: "Lighting",
        icon: Lightbulb,
        description: "LED conversion kits, headlight assemblies, and interior lighting.",
        count: 132,
        color: "bg-orange-50 text-orange-600"
    }
];

export default function CategoriesPage() {
    return (
        <div className="bg-surface-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="mb-16 border-b border-surface-200 pb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-outfit font-black tracking-tighter mb-4 text-surface-950 uppercase"
                    >
                        PART <span className="text-brand-600">CATEGORIES</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-surface-600 max-w-2xl text-lg font-medium"
                    >
                        Explore our comprehensive catalog organized by vehicle system to find exactly what you need.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/products?category=${cat.id}`}
                                className="group block bg-white border border-surface-200 p-8 rounded-4xl hover:border-brand-600 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-300 h-full relative overflow-hidden"
                            >
                                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <cat.icon size={32} />
                                </div>

                                <h2 className="text-3xl font-black font-outfit text-surface-950 mb-3 uppercase tracking-tight group-hover:text-brand-600 transition-colors">
                                    {cat.name}
                                </h2>

                                <p className="text-surface-600 font-medium mb-8">
                                    {cat.description}
                                </p>

                                <div className="flex items-center justify-between text-sm font-black tracking-widest uppercase">
                                    <span className="text-surface-400 group-hover:text-brand-600 transition-colors">
                                        {cat.count} Products
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                {/* Abstract background element */}
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <cat.icon size={120} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
