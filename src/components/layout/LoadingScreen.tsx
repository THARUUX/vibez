"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const m = motion as any;

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;


    return (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-brand-600 font-outfit select-none pointer-events-none"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Logo Animation */}
                        <m.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                                scale: [0.8, 1.1, 1],
                                opacity: 1 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <Image 
                                src="/logo.svg" 
                                alt="VibeZ Logo" 
                                width={200} 
                                height={200} 
                                className="brightness-0 invert drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                            />
                        </m.div>

                        {/* Progress Bar Container */}
                        <div className="w-64 h-1 bg-white/50 rounded-full overflow-hidden relative mb-4">
                            <m.div 
                                className="absolute inset-0 bg-white"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>

                        {/* Status Text */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                {progress < 100 ? "Syncing Collection Data" : "Connection Established"}
                            </span>
                            <span className="text-[8px] font-bold text-white uppercase tracking-widest italic">
                                GOOD VIBEZ ONLY v1.0
                            </span>
                        </m.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 text-[8px] font-mono text-white/10 uppercase tracking-widest hidden md:block">
                        SYS_INIT_SEQUENCE_2026
                    </div>
                    <div className="absolute bottom-10 right-10 text-[8px] font-mono text-white/10 uppercase tracking-widest hidden md:block">
                        SL_REG_COLLECTION
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
