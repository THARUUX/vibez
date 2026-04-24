/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { RiLoginBoxLine, RiUserAddLine, RiArrowRightSLine, RiLoader4Line } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { alerts } from "@/lib/alerts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";

export default function CustomerLogin() {
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
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                alerts.error("Invalid credentials. Please try again.");
            } else {
                alerts.success(`Welcome back to ${storeName}!`);
                router.push("/");
                router.refresh();
            }
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
                            <RiLoginBoxLine size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-surface-950 uppercase tracking-tighter mb-4">Welcome <span className="text-brand-600">Back</span></h1>
                        <p className="text-surface-500 font-medium text-lg leading-relaxed">Access your orders and member-only pricing.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="vibez-input bg-surface-50"
                                placeholder="name@email.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-2 mr-1">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">Password</label>
                                <button type="button" className="text-[10px] font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest">Forgot?</button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="vibez-input bg-surface-50"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="apex-button w-full mt-4"
                        >
                            {loading ? (
                                <>Signing In <RiLoader4Line className="animate-spin" size={20} /></>
                            ) : (
                                "Log In"
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-surface-200 text-center">
                        <p className="text-surface-500 font-medium mb-6">Don't have an account yet?</p>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.2em] hover:text-brand-700 transition-colors group text-sm"
                        >
                            Create Account <RiUserAddLine size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
