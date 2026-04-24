/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { RiFlashlightFill, RiHeart3Fill, RiSparklingFill, RiMailSendLine, RiMapPinFill, RiInstagramFill, RiWhatsappFill, RiStarFill } from "react-icons/ri";
import Image from "next/image";

const m = motion as any;

export default function AboutPage() {
    return (
        <div className="bg-surface-50 min-h-screen pt-32 pb-20 overflow-hidden">
            {/* Mission Section */}
            <section className="container mx-auto px-4 mb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    <m.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-black text-[10px] mb-8 uppercase tracking-[0.2em] shadow-sm">
                            <RiSparklingFill size={14} />
                            <span>ONLY GOOD VIBEZ</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-surface-950 uppercase leading-[0.85] text-shadow-sm">
                            DRIVEN BY <span className="text-brand-600">AMBITION.</span><br/> DELIVERED BY <span className="text-brand-600">VIBEZ.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-surface-600 font-medium mb-8 leading-relaxed max-w-2xl">
                            At vibez.lk, we believe that high-quality, innovative products shouldn't come with a massive price tag or a long wait. Based in the heart of Sri Lanka, we specialize in sourcing the latest trends directly from global manufacturers and bringing them straight to your doorstep.
                        </p>
                        <p className="text-surface-500 font-medium leading-relaxed mb-10 text-base md:text-lg max-w-2xl">
                            We don't just "import" we curate. Our team handpicks every item in our inventory, ensuring it meets our standards for quality, durability, and that "wow" factor. By managing the logistics and quality control ourselves, we ensure that you get the best of massive marketplaces without the hassle of customs, long shipping delays, or hidden fees.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-4 bg-white border border-surface-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="block text-3xl font-black text-surface-950">100+</span>
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Designs</span>
                            </div>
                            <div className="px-6 py-4 bg-white border border-surface-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="block text-3xl font-black text-brand-600">Islandwide</span>
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Delivery</span>
                            </div>
                            <div className="px-6 py-4 bg-white border border-surface-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="block text-3xl font-black text-surface-950">24/7</span>
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Customer Service</span>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute bottom-10 left-10 text-white transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            <p className="text-sm font-black uppercase tracking-widest mb-1 italic text-brand-400">Craftsmanship</p>
                            <h3 className="text-3xl font-black tracking-tight uppercase text-shadow">Premium Matte Finish</h3>
                        </div>
                    </m.div>
                </div>
            </section>

            {/* The Craft Section */}
            <section className="bg-white py-24 md:py-32 mb-32 border-y border-surface-200 relative overflow-hidden">
                {/* Decorative background text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[20rem] font-black text-surface-50 pointer-events-none select-none uppercase tracking-tighter opacity-80">
                    CRAFT
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mb-16 md:mb-20">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-surface-950 mb-6 uppercase tracking-tighter leading-none">
                            WHY OUR <span className="text-brand-600">PRODUCTS</span> HIT DIFFERENT?
                        </h2>
                        <div className="w-24 h-2 bg-brand-600 rounded-full mb-8" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            {
                                icon: RiStarFill,
                                title: "Unique Products",
                                desc: "Discover the 'where did you get that?' collection. From viral gadgets to one-of-a-kind finds, we bring you the latest global trends that you won't find anywhere else in Sri Lanka."
                            },
                            {
                                icon: RiFlashlightFill,
                                title: "Premium Quality",
                                desc: "The best of the best. We’ve done the heavy lifting to source high-grade materials and top-tier craftsmanship, ensuring you get world-class durability and performance without the luxury price tag."
                            },
                            {
                                icon: RiHeart3Fill,
                                title: "Unbeatable Value",
                                desc: "By importing directly from the source and cutting out the middlemen, we bring you the same high-end products at a fraction of the market price. Premium items, Sri Lanka's best prices."
                            }
                        ].map((value, i) => (
                            <m.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface-50 p-8 md:p-12 rounded-[2.5rem] border border-surface-200 transition-all duration-500 hover:bg-white hover:border-brand-300 hover:shadow-xl group"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-md border border-surface-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-500 group-hover:rotate-6">
                                    <value.icon className="text-brand-600 group-hover:text-white transition-colors" size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-surface-950 mb-4 uppercase tracking-tight leading-none group-hover:text-brand-600 transition-colors">
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
            <section className="container mx-auto px-4 mb-10">
                <div className="bg-surface-950 rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-600 rounded-full blur-[100px] md:blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/4" />

                    <div className="relative z-10 flex-1 w-full">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 md:mb-8 uppercase leading-[0.9]">
                                LET'S <span className="text-brand-500">VIBE</span> TOGETHER.
                            </h2>
                            <p className="text-surface-300 text-lg md:text-xl mb-10 md:mb-12 max-w-xl font-medium leading-relaxed">
                                Whether you're looking for a custom notebook design or a bulk order for your community, we're here to help.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                                <a href="mailto:hello@vibez.lk" className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-500 transition-all shadow-lg">
                                        <RiMailSendLine size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Email Us</span>
                                        <span className="text-base md:text-lg font-black group-hover:text-brand-400 transition-colors tracking-tight text-white">hello@vibez.lk</span>
                                    </div>
                                </a>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center transition-all shadow-lg">
                                        <RiMapPinFill size={24} className="text-brand-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Base</span>
                                        <span className="text-base md:text-lg font-black tracking-tight text-white">Sri Lanka (Islandwide)</span>
                                    </div>
                                </div>
                                <a href="#" className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-500 transition-all shadow-lg">
                                        <RiInstagramFill size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Instagram</span>
                                        <span className="text-base md:text-lg font-black group-hover:text-brand-400 transition-colors tracking-tight text-white">@vibezsrilanka</span>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-500 transition-all shadow-lg">
                                        <RiWhatsappFill size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">WhatsApp</span>
                                        <span className="text-base md:text-lg font-black group-hover:text-brand-400 transition-colors tracking-tight text-white">VibeZ Club</span>
                                    </div>
                                </a>
                            </div>
                        </m.div>
                    </div>

                    <m.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[3.5rem] shadow-2xl relative w-full lg:w-[450px]"
                    >
                        <h3 className="text-2xl md:text-3xl font-black text-surface-950 mb-6 md:mb-8 uppercase tracking-tighter leading-none">Drop a message</h3>
                        <form className="space-y-5 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Your Name</label>
                                <input type="text" className="vibez-input bg-surface-50" placeholder="Ex: Tanjiro" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" className="vibez-input bg-surface-50" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Tell us your Vibe</label>
                                <textarea rows={4} className="vibez-input bg-surface-50 resize-none py-4" placeholder="Interested in a custom book?"></textarea>
                            </div>
                            <button className="apex-button w-full mt-2">
                                SEND MESSAGE
                            </button>
                        </form>
                    </m.div>
                </div>
            </section>
        </div>
    );
}
