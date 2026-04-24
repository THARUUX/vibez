/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import {
    RiFacebookCircleFill,
    RiTwitterXFill,
    RiInstagramFill,
    RiMailFill,
    RiPhoneFill,
    RiMapPinFill,
    RiArrowRightLine,
} from "react-icons/ri";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";
import Image from "next/image";

const m = motion as any;

export function Footer() {
    const storeName = useSettingsStore(state => state.storeName);

    return (
        <footer className="relative overflow-hidden pt-24 pb-12 bg-white border-t border-surface-200">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-10"
                style={{
                    background: "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 60%)",
                    transform: "translate(30%, -30%)",
                    filter: "blur(60px)"
                }}
            />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-[0.05]"
                style={{
                    background: "radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 60%)",
                    transform: "translate(-30%, 30%)",
                    filter: "blur(50px)"
                }}
            />
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Image
                                    src="/logo.svg"
                                    alt="VibeZ"
                                    width={140}
                                    height={40}
                                    className="w-32"
                                />
                            </m.div>
                        </Link>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-[280px]">
                            High-quality prints, official merchandise, and premium collectibles.
                            <br />
                            <span className="text-brand-600 font-bold mt-2 block italic">GOOD VIBEZ ONLY.</span>
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: RiFacebookCircleFill, href: "#" },
                                { icon: RiTwitterXFill, href: "#" },
                                { icon: RiInstagramFill, href: "#" }
                            ].map((social, i) => (
                                <m.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                                    style={{
                                        background: "rgba(0,0,0,0.03)",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        color: "rgba(15,23,42,0.5)"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--brand-red)";
                                        e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
                                        e.currentTarget.style.background = "rgba(220,38,38,0.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "rgba(15,23,42,0.5)";
                                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                                        e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                                    }}
                                >
                                    <social.icon size={20} />
                                </m.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-brand-600">Shop</h4>
                        <ul className="space-y-3">
                            {['K-Pop Collection', 'Anime Series', 'Premium NoteBooks', 'Key Tags', 'Custom Mugs'].map((link) => (
                                <li key={link}>
                                    <Link href="/products" className="text-surface-500 hover:text-surface-950 text-sm transition-all flex items-center gap-2 group font-medium">
                                        <RiArrowRightLine size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-600" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-brand-600">Company</h4>
                        <ul className="space-y-3">
                            {['About VibeZ', 'Quality Standards', 'Store Locations', 'Shipping Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <Link href="/about" className="text-surface-500 hover:text-surface-950 text-sm transition-all flex items-center gap-2 group font-medium">
                                        <RiArrowRightLine size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-600" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-brand-600">Contact</h4>
                        <div className="space-y-4 text-sm text-surface-600 font-medium">
                            <m.div
                                whileHover={{ x: 4 }}
                                className="flex items-start gap-3 group cursor-pointer transition-colors hover:text-surface-950"
                            >
                                <div className="w-8 h-8 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center shrink-0 group-hover:border-brand-200 group-hover:text-brand-600 transition-colors">
                                    <RiMapPinFill size={16} />
                                </div>
                                <span className="pt-1.5 leading-tight">44, Udahamulla Station Road, Nugegoda.</span>
                            </m.div>
                            <m.div
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-3 group cursor-pointer transition-colors hover:text-surface-950"
                            >
                                <div className="w-8 h-8 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center shrink-0 group-hover:border-brand-200 group-hover:text-brand-600 transition-colors">
                                    <RiPhoneFill size={16} />
                                </div>
                                <span>+94 (76) 826 1160</span>
                            </m.div>
                            <m.div
                                whileHover={{ x: 4 }}
                                className="flex items-center gap-3 group cursor-pointer transition-colors hover:text-surface-950"
                            >
                                <div className="w-8 h-8 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center shrink-0 group-hover:border-brand-200 group-hover:text-brand-600 transition-colors">
                                    <RiMailFill size={16} />
                                </div>
                                <span>support@vibez.lk</span>
                            </m.div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-surface-100">
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} {storeName}. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="text-[9px] text-surface-300 font-bold tracking-widest uppercase">
                            Designed & Developed By <a href="https://tharuux.click" className="text-brand-600">THARUUX</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
