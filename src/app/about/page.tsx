"use client";

import { motion } from "framer-motion";
import { Zap, Heart, Sparkles, Mail, MapPin, Phone, Instagram, Send, Star } from "lucide-react";
import Image from "next/image";

const m = motion as any;

export default function AboutPage() {
    return (
        <div className="bg-surface-50 min-h-screen pt-32 pb-20 font-outfit">
            {/* Mission Section */}
            <section className="container mx-auto px-4 mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <m.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-black text-[10px] mb-8 uppercase tracking-[0.2em]">
                            <Sparkles size={14} />
                            <span>ONLY GOOD VIBEZ</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-surface-950 uppercase leading-[0.85]">
                            WE PRINT <span className="text-brand-600">PASSION.</span>
                        </h1>
                        <p className="text-xl text-surface-600 font-medium mb-8 leading-relaxed">
                            VibeZ started with a simple idea: that your favorite stories deserve more than just a screen. They deserve to be held, felt, and carried with you every day.
                        </p>
                        <p className="text-surface-500 font-medium leading-relaxed mb-10 text-lg">
                            We are a Sri Lankan-based print shop dedicated to bringing Anime, K-pop, and Gaming culture to life through premium stationery. Every notebook we craft is a tribute to the characters and moments that inspire us.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-4 bg-white border border-surface-200 rounded-2xl shadow-sm">
                                <span className="block text-3xl font-black text-surface-950">100+</span>
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Designs</span>
                            </div>
                            <div className="px-6 py-4 bg-white border border-surface-200 rounded-2xl shadow-sm">
                                <span className="block text-3xl font-black text-brand-600">Islandwide</span>
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Delivery</span>
                            </div>
                        </div>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group"
                    >
                        <Image
                            src="/about-us.png"
                            alt="VibeZ Craftsmanship"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <p className="text-sm font-black uppercase tracking-widest mb-1 italic text-brand-400">Craftsmanship</p>
                            <h3 className="text-3xl font-black tracking-tight uppercase">Premium Matte Finish</h3>
                        </div>
                    </m.div>
                </div>
            </section>

            {/* The Craft Section */}
            <section className="bg-white py-32 mb-32 border-y border-surface-200 relative overflow-hidden">
                {/* Decorative background text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-surface-50 pointer-events-none select-none uppercase tracking-tighter opacity-50">
                    CRAFT
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mb-20">
                        <h2 className="text-5xl md:text-7xl font-black text-surface-950 mb-6 uppercase tracking-tighter leading-none">
                            WHY OUR <span className="text-brand-600">BOOKS</span> HIT DIFFERENT?
                        </h2>
                        <div className="w-24 h-2 bg-brand-600 rounded-full mb-8" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Star,
                                title: "80gsm Ivory Paper",
                                desc: "The perfect off-white shade that's easy on the eyes and smooth for any pen. No bleed, just flow."
                            },
                            {
                                icon: Zap,
                                title: "Matte Lamination",
                                desc: "Our premium hardcovers are finished with a silky-smooth matte laminate that's scratch-resistant and ultra-durable."
                            },
                            {
                                icon: Heart,
                                title: "Fan-Curated Art",
                                desc: "We don't just print pictures; we curate and optimize every artwork to ensure vibrant, true-to-source colors."
                            }
                        ].map((value, i) => (
                            <m.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface-50 p-12 rounded-[2.5rem] border border-surface-100 transition-all duration-500 hover:bg-white hover:border-brand-600 hover:shadow-2xl hover:shadow-brand-600/5 group"
                            >
                                <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                    <value.icon className="text-brand-600 group-hover:text-white" size={36} />
                                </div>
                                <h3 className="text-3xl font-black text-surface-950 mb-4 uppercase tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-surface-500 font-medium leading-relaxed group-hover:text-surface-600 transition-colors">
                                    {value.desc}
                                </p>
                            </m.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact & Social Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="bg-surface-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10 flex-1">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-[0.85]">
                                LET'S <span className="text-brand-500">VIBE</span> TOGETHER.
                            </h2>
                            <p className="text-surface-400 text-xl mb-12 max-w-xl font-medium leading-relaxed">
                                Whether you're looking for a custom notebook design or a bulk order for your community, we're here to help.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <a href="mailto:hello@vibez.lk" className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center group-hover:bg-brand-600 transition-all shadow-xl">
                                        <Mail className="text-brand-500 group-hover:text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Email Us</span>
                                        <span className="text-lg font-black group-hover:text-brand-500 transition-colors tracking-tight">hello@vibez.lk</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center transition-all shadow-xl">
                                        <MapPin className="text-brand-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Base</span>
                                        <span className="text-lg font-black tracking-tight">Sri Lanka (Islandwide)</span>
                                    </div>
                                </div>
                                <a href="#" className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center group-hover:bg-brand-600 transition-all shadow-xl text-brand-500 group-hover:text-white">
                                        <Instagram size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Instagram</span>
                                        <span className="text-lg font-black group-hover:text-brand-500 transition-colors tracking-tight">@vibez.lk</span>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center group-hover:bg-brand-600 transition-all shadow-xl text-brand-500 group-hover:text-white">
                                        <Send size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Telegram</span>
                                        <span className="text-lg font-black group-hover:text-brand-500 transition-colors tracking-tight">VibeZ Community</span>
                                    </div>
                                </a>
                            </div>
                        </m.div>
                    </div>

                    <m.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-12 rounded-[3.5rem] shadow-2xl relative w-full lg:w-[450px]"
                    >
                        <h3 className="text-3xl font-black text-surface-950 mb-8 uppercase tracking-tighter leading-none">Drop a message</h3>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Your Name</label>
                                <input type="text" className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-600 transition-all text-surface-950 font-medium" placeholder="Ex: Tanjiro" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Email Address</label>
                                <input type="email" className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-600 transition-all text-surface-950 font-medium" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Tell us your Vibe</label>
                                <textarea rows={4} className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-600 transition-all text-surface-950 font-medium resize-none" placeholder="Interested in a custom book?"></textarea>
                            </div>
                            <button className="vibez-button w-full justify-center text-sm py-5 shadow-xl shadow-brand-600/20">
                                SEND MESSAGE
                            </button>
                        </form>
                    </m.div>
                </div>
            </section>
        </div>
    );
}
