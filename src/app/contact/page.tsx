/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { RiMailSendLine, RiPhoneFill, RiMapPinFill, RiSendPlaneFill, RiCustomerService2Fill, RiTimeFill, RiGlobalLine } from "react-icons/ri";
import { useState } from "react";
import { alerts } from "@/lib/alerts";
import { CustomSelect } from "@/components/common/CustomSelect";

const m = motion as any;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inquiryType, setInquiryType] = useState("Technical Product Specification");

    const INQUIRY_OPTIONS = [
        { value: "Custom Print Order", label: "Custom Print Order" },
        { value: "Bulk / Wholesale Inquiry", label: "Bulk / Wholesale Inquiry" },
        { value: "Shipping & Delivery Status", label: "Shipping & Delivery Status" },
        { value: "Quality & Damage Claim", label: "Quality & Damage Claim" },
        { value: "Collaborations", label: "Collaborations" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alerts.success("Vibe Received", "Our team will review your message and get back to you within 24 hours.");
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen pb-24 bg-surface-50 text-surface-950">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-10"
                    >
                        <source src="/bg-video.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-surface-50" />
                    <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 border border-brand-200 bg-white shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-500">
                                Direct Uplink
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-shadow-sm">
                            CONTACT <br className="md:hidden" /><span className="text-brand-600">VIBEZ</span>
                        </h1>
                        <p className="text-surface-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Need help with an order or have a custom request? <br className="hidden md:block" />
                            Our support team is always here to assist you.
                        </p>
                    </m.div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 -mt-32 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            {
                                icon: RiCustomerService2Fill,
                                title: "Order Support",
                                detail: "support@vibez.lk",
                                sub: "24/7 Response Time Assistance"
                            },
                            {
                                icon: RiPhoneFill,
                                title: "Direct Contact",
                                detail: "+94 (76) 826 1160",
                                sub: "Mon-Sat: 09:00 - 18:00 IST"
                            },
                            {
                                icon: RiMailSendLine,
                                title: "Custom Orders",
                                detail: "orders@vibez.lk",
                                sub: "Typical response time: 2 hours"
                            }
                        ].map((item, idx) => (
                            <m.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white border border-surface-200 shadow-sm hover:shadow-xl hover:border-brand-300 p-8 rounded-3xl group transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-brand-50 border border-brand-100">
                                    <item.icon size={24} className="text-brand-600" />
                                </div>
                                <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2">{item.title}</h3>
                                <div className="text-xl font-black text-surface-950 mb-2 truncate">{item.detail}</div>
                                <p className="text-xs font-bold text-surface-500 tracking-wide">{item.sub}</p>
                            </m.div>
                        ))}

                        {/* Global Presence */}
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-brand-600 p-8 md:p-10 rounded-3xl relative overflow-hidden group border border-brand-500 shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full transition-opacity group-hover:opacity-100 opacity-50 bg-white/30" />

                            <h3 className="text-xl font-black tracking-tighter uppercase mb-8 flex items-center gap-3 text-white">
                                <RiGlobalLine className="text-white" size={24} />
                                VibeZ HQ
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <RiMapPinFill className="text-white shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Store Address</p>
                                        <p className="font-bold text-sm text-white leading-relaxed">44, Udahamulla Station Road, Nugegoda, Sri Lanka</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <RiTimeFill className="text-white shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Operating Hours</p>
                                        <p className="font-bold text-sm text-white">Mon - Sat: 09:00 AM - 06:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl overflow-hidden h-full flex flex-col border border-surface-200 shadow-sm"
                        >
                            <div className="p-8 md:p-12 border-b border-surface-100 bg-surface-50/50 flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-surface-950 mb-2">
                                        HOW CAN <span className="text-brand-600">VIBEZ</span> HELP?
                                    </h2>
                                    <p className="text-surface-500 font-medium text-sm md:text-base leading-relaxed max-w-md">
                                        Fill out the form below and our customer support team will get back to you shortly.
                                    </p>
                                </div>
                                <RiMailSendLine size={48} className="text-surface-200 hidden sm:block" />
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="vibez-input"
                                            placeholder="Kasun Perera"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="vibez-input"
                                            placeholder="hello@vibez.lk"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Inquiry Type</label>
                                    <CustomSelect
                                        options={INQUIRY_OPTIONS}
                                        value={inquiryType}
                                        onChange={setInquiryType}
                                        triggerClassName="vibez-input !text-surface-950"
                                        listClassName="top-full mt-2"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Message Detail</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="vibez-input resize-none py-5"
                                        placeholder="Describe your design requirement or order inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="apex-button mt-4"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-3">
                                            <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                                            SENDING...
                                        </span>
                                    ) : (
                                        <>
                                            SEND MESSAGE <RiSendPlaneFill size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
