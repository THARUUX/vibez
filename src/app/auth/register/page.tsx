/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { RiMailLine, RiLockPasswordLine, RiUserLine, RiUserAddLine, RiArrowRightSLine, RiShieldCheckLine, RiLoader4Line } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { alerts } from "@/lib/alerts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";

export default function CustomerRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    /* eslint-disable */
    const storeName = useSettingsStore(state => state.storeName);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alerts.error(data.error || "Registration failed.");
                return;
            }

            alerts.success("Account created successfully! Signing in...");
            
            // Auto login after registration
            await signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
            });
        } catch (err) {
            alerts.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 font-outfit pt-32 pb-20">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-surface-200 shadow-xl relative overflow-hidden"
                >
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-8 border border-brand-100 shadow-sm">
                            <RiUserAddLine size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-surface-950 uppercase tracking-tighter mb-4">Join <span className="text-brand-600">{storeName}</span></h1>
                        <p className="text-surface-500 font-medium text-lg leading-relaxed">Create an account for faster checkout and tracking.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                            <div className="relative">
                                <RiUserLine className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="vibez-input bg-surface-50 pl-14"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <div className="relative">
                                <RiMailLine className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="vibez-input bg-surface-50 pl-14"
                                    placeholder="name@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Password</label>
                            <div className="relative">
                                <RiLockPasswordLine className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="vibez-input bg-surface-50 pl-14"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="bg-surface-50 p-5 rounded-2xl border border-surface-200 flex items-start gap-4">
                            <RiShieldCheckLine className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-[10px] text-surface-500 font-medium leading-relaxed">
                                By creating an account, you agree to our <span className="text-surface-950 font-black tracking-tight">Terms of Service</span> and <span className="text-surface-950 font-black tracking-tight">Privacy Policy</span>. We use your data strictly for order fulfillment and internal security.
                            </p>
                        </div>

                        <button
                            disabled={loading}
                            className="apex-button w-full mt-4 group"
                        >
                            {loading ? (
                                <>Initializing <RiLoader4Line className="animate-spin" size={20} /></>
                            ) : (
                                <>Create Account <RiArrowRightSLine size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-surface-200 text-center">
                        <p className="text-surface-500 font-medium mb-6">Already have an account?</p>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.2em] hover:text-brand-700 transition-colors group text-sm"
                        >
                            Log In Instead <RiArrowRightSLine size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
