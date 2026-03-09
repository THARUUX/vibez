"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, status, error } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(name, email, password);
    };

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 font-outfit pt-24">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 border border-surface-200 shadow-2xl relative overflow-hidden"
                >
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                            <UserPlus size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-surface-950 uppercase tracking-tighter mb-2">Join <span className="text-brand-600">Apex Auto</span></h1>
                        <p className="text-surface-500 font-medium">Create an account for faster checkout and tracking.</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2 justify-center"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-surface-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-2x pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-surface-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-2x pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                    placeholder="name@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-surface-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-2x pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="bg-surface-50 p-4 rounded-2xl border border-surface-100 flex items-start gap-3">
                            <ShieldCheck className="text-emerald-600 mt-1 shrink-0" size={18} />
                            <p className="text-[10px] text-surface-400 font-medium leading-relaxed">
                                By creating an account, you agree to our <span className="text-surface-950 font-bold">Terms of Service</span> and <span className="text-surface-950 font-bold">Privacy Policy</span>. We use your data strictly for order fulfillment and internal security.
                            </p>
                        </div>

                        <button
                            disabled={status === "loading"}
                            className="w-full py-5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand-600/20 uppercase tracking-widest flex items-center justify-center gap-3 text-lg group"
                        >
                            {status === "loading" ? "Initializing..." : (
                                <>
                                    Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-surface-100 text-center">
                        <p className="text-surface-500 font-medium mb-6">Already have an account?</p>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-brand-600 font-black uppercase tracking-widest hover:text-brand-700 transition-colors group"
                        >
                            Log In Instead <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
