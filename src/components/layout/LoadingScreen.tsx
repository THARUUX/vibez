/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const m = motion as any;

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState<"init" | "loading" | "done">("init");
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        let interval: NodeJS.Timeout;

        const timeout = setTimeout(() => {
            setPhase("loading");
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + Math.random() * 10 + 3;
                    if (next >= 100) {
                        clearInterval(interval);
                        setPhase("done");
                        setTimeout(() => setIsVisible(false), 800);
                        return 100;
                    }
                    return next;
                });
            }, 100);
        }, 200);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    // GSAP logo pulse
    useEffect(() => {
        if (!mounted || !logoRef.current) return;
        const ctx = gsap.context(() => {
            gsap.to(logoRef.current, {
                filter: "drop-shadow(0 0 20px rgba(220,38,38,0.2)) drop-shadow(0 0 40px rgba(220,38,38,0.1))",
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        });
        return () => ctx.revert();
    }, [mounted]);

    if (!mounted) return null;

    const statusMsg = progress < 30 ? "Initializing" :
                      progress < 60 ? "Loading Collection" :
                      progress < 90 ? "Syncing Vibes" :
                      "Connection Live";

    return (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden bg-white"
                >
                    {/* Animated bg grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px"
                    }} />

                    {/* Radial glow */}
                    <m.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, rgba(220,38,38,0.8) 0%, transparent 70%)",
                            filter: "blur(40px)"
                        }}
                    />

                    {/* Corner Decorators */}
                    {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-12 h-12 border-brand-200 opacity-50 hidden md:block`}
                            style={{
                                borderTop: i < 2 ? "2px solid" : undefined,
                                borderBottom: i >= 2 ? "2px solid" : undefined,
                                borderLeft: i % 2 === 0 ? "2px solid" : undefined,
                                borderRight: i % 2 === 1 ? "2px solid" : undefined,
                            }}
                        />
                    ))}

                    {/* Main Content */}
                    <div className="relative flex flex-col items-center gap-8 z-10 px-4">
                        {/* Logo */}
                        <m.div
                            ref={logoRef}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            <Image
                                src="/logo.svg"
                                alt="VibeZ"
                                width={160}
                                height={60}
                                className="w-32 md:w-44"
                                priority
                            />
                        </m.div>

                        {/* Progress Area */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-center gap-4 w-full max-w-[280px]"
                        >
                            {/* Progress Track */}
                            <div className="w-full h-[2px] relative overflow-visible rounded-full bg-surface-200">
                                <m.div
                                    className="absolute top-0 left-0 h-[2px] rounded-full"
                                    style={{
                                        background: "linear-gradient(90deg, #ef4444, #dc2626)",
                                        boxShadow: "0 0 8px rgba(220,38,38,0.4)"
                                    }}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                                {/* Glow dot at tip */}
                                <m.div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full -translate-x-1/2 bg-white border-2 border-brand-600 shadow-sm"
                                    style={{
                                        left: `${progress}%`
                                    }}
                                />
                            </div>

                            {/* Status */}
                            <div ref={textRef} className="flex items-center gap-3 w-full justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-surface-400">
                                    {statusMsg}
                                </span>
                                <span className="text-[10px] font-black text-brand-600 font-mono tabular-nums">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </m.div>

                        {/* Tagline */}
                        <m.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-[8px] font-bold uppercase tracking-[0.5em] text-surface-300 text-center"
                        >
                            GOOD VIBEZ ONLY — EST. 2024
                        </m.p>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
