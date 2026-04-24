/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { RiArrowLeftLine, RiShoppingCartLine, RiShieldCheckLine, RiTruckLine, RiRestartLine, RiCheckboxCircleFill, RiFlashlightFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSettingsStore } from "@/store/settingsStore";
import { PriceDisplay } from "@/components/common/PriceDisplay";

interface ProductClientContentProps {
    product: any;
}

export default function ProductClientContent({ product }: ProductClientContentProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { deliveryTerms, syncSettings } = useSettingsStore();

    useEffect(() => {
        syncSettings();
    }, [syncSettings]);

    return (
        <div className="container mx-auto px-4 py-32 min-h-screen bg-surface-50 font-outfit">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-surface-400 hover:text-brand-600 font-black mb-12 md:mb-16 group transition-all uppercase tracking-[0.2em] text-[10px]"
            >
                <RiArrowLeftLine size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-surface-200 shadow-xl group"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-100/50 to-transparent pointer-events-none" />
                </motion.div>

                {/* Product Details */}
                <div className="space-y-10 lg:space-y-12 pt-4">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <span className="bg-brand-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-brand-600/30">
                                {product.category?.name?.toUpperCase() || 'GENERAL'}
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                                <RiCheckboxCircleFill size={14} />
                                Certified In Stock
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-surface-950 uppercase tracking-tighter leading-[0.9] mb-4">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest bg-white border border-surface-200 px-3 py-1 rounded-md shadow-sm">Serial: {product.id.substring(0, 12).toUpperCase()}</div>
                            <div className="h-4 w-px bg-surface-200" />
                            <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Genuine Product</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-baseline gap-3">
                            <PriceDisplay amount={product.price} className="text-4xl md:text-5xl font-black text-surface-950 tracking-tighter" />
                            <span className="text-surface-400 font-bold text-sm md:text-base uppercase">Inc. VAT</span>
                        </div>
                        <p className="text-surface-600 font-medium text-lg leading-relaxed max-w-xl">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {product.tags && product.tags.split(',').map((tag: string) => (
                            <span key={tag} className="bg-white text-surface-500 hover:text-brand-600 hover:border-brand-300 transition-colors cursor-pointer px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-surface-200 flex items-center gap-2 shadow-sm">
                                #
                                {tag.trim()}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                addItem(product);
                                alerts.toast(`${product.name} ADDED TO CART`);
                            }}
                            className="apex-button py-5 text-sm"
                        >
                            <RiShoppingCartLine size={20} />
                            ADD TO CART
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="vibez-button-outline py-5 text-sm w-full"
                        >
                            <RiFlashlightFill size={20} className="text-brand-600" />
                            Buy Now
                        </motion.button>
                    </div>

                    {/* Features/Info */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 pt-10 border-t border-surface-200">
                        {[
                            product.hasWarranty !== false ? {
                                icon: RiShieldCheckLine,
                                title: product.warranty?.split(' ')[0] || "2-YEAR",
                                sub: product.warranty?.split(' ').slice(1).join(' ') || "FULL WARRANTY"
                            } : null,
                            product.hasDelivery !== false ? {
                                icon: RiTruckLine,
                                title: product.delivery?.split(' ')[0] || "EXPRESS",
                                sub: product.delivery?.split(' ').slice(1).join(' ') || "LOGISTICS",
                                onClick: () => {
                                    alerts.info(
                                        "Delivery Logistics",
                                        deliveryTerms || "Standard delivery terms apply. Please expect logistics contact upon dispatch."
                                    );
                                }
                            } : null,
                            product.hasReturns !== false ? {
                                icon: RiRestartLine,
                                title: product.returns?.split(' ')[0] || "30-DAY",
                                sub: product.returns?.split(' ').slice(1).join(' ') || "EASY RETURNS"
                            } : null,
                        ].filter(Boolean).map((item: any, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col gap-3 ${item.onClick ? 'cursor-pointer group/feature' : ''}`}
                                onClick={item.onClick}
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 bg-white border border-surface-200 text-brand-600 rounded-xl flex items-center justify-center shadow-sm ${item.onClick ? 'group-hover/feature:bg-brand-50 group-hover/feature:border-brand-200 transition-colors' : ''}`}>
                                    <item.icon size={22} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs font-black text-surface-950 uppercase tracking-widest leading-tight">{item.title}</div>
                                    <div className="text-[8px] md:text-[9px] font-bold text-surface-400 uppercase tracking-[0.2em] mt-1 line-clamp-1">{item.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Terms & Conditions Section */}
                    {product.terms && (
                        <div className="pt-10 mt-10 border-t border-surface-200">
                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <RiShieldCheckLine size={16} />
                                Terms & Conditions
                            </h3>
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-surface-200 shadow-sm">
                                <p className="text-surface-600 font-medium text-sm md:text-base leading-loose whitespace-pre-wrap italic">
                                    {product.terms}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
