/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { RiShoppingBag3Line, RiMenuLine, RiCloseLine, RiLogoutCircleLine, RiUserLine } from "react-icons/ri";

const m = motion as any;

const navItems = [
    { name: 'Catalog', href: '/catalog' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const { data: session, status: sessionStatus } = useSession();
    const user = session?.user as any;
    const pathname = usePathname();

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <m.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 safe-top ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-xl border-b border-surface-200 shadow-sm"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 h-[70px] md:h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="relative flex items-center gap-3 group z-10">
                        <m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Image
                                src="/logo.svg"
                                alt="VibeZ"
                                width={120}
                                height={40}
                                className="w-24 md:w-32"
                                priority
                            />
                        </m.div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative px-4 py-2 group"
                            >
                                <m.span
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
                                    className={`text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
                                        isActive(item.href)
                                            ? "text-brand-600"
                                            : "text-surface-400 group-hover:text-surface-950"
                                    }`}
                                >
                                    {item.name}
                                </m.span>
                                {isActive(item.href) && (
                                    <m.span
                                        layoutId="nav-indicator"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-3">

                        {/* Auth - Desktop only */}
                        <div className="hidden md:flex items-center gap-2">
                            {sessionStatus === "authenticated" ? (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <Link
                                        href={user?.role === "ADMIN" ? "/admin" : "/profile"}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-surface-50 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-surface-950 flex items-center justify-center text-white font-black text-xs shadow-md shadow-black/10 group-hover:bg-brand-600 transition-colors">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-surface-950 uppercase tracking-tight group-hover:text-brand-600 transition-colors leading-none">{user?.name}</span>
                                            <span className="text-[8px] text-surface-400 uppercase tracking-widest leading-none mt-0.5">Client</span>
                                        </div>
                                    </Link>
                                    <m.button
                                        whileTap={{ scale: 0.93 }}
                                        onClick={() => signOut()}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl text-surface-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                        title="Logout"
                                    >
                                        <RiLogoutCircleLine size={18} />
                                    </m.button>
                                </m.div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 hover:text-surface-950 rounded-xl hover:bg-surface-100 transition-all"
                                >
                                    <RiUserLine size={16} />
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-6 bg-surface-200" />

                        {/* Cart Button */}
                        <m.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCartOpen(true)}
                            className="relative flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl transition-all duration-300 group border border-surface-200 bg-white shadow-sm hover:border-brand-500 hover:shadow-md"
                        >
                            <RiShoppingBag3Line
                                size={20}
                                className={`transition-colors ${totalItems > 0 ? "text-brand-600" : "text-surface-500 group-hover:text-brand-600"}`}
                            />
                            <div className="hidden sm:flex flex-col items-start leading-none">
                                <span className="text-[8px] font-black uppercase tracking-widest text-surface-400">Cart</span>
                                <span className={`text-[10px] font-black ${totalItems > 0 ? "text-surface-950" : "text-surface-500"}`}>
                                    {totalItems} ITEM{totalItems !== 1 ? "S" : ""}
                                </span>
                            </div>
                            {totalItems > 0 && (
                                <m.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-md shadow-brand-600/30"
                                >
                                    {totalItems}
                                </m.div>
                            )}
                        </m.button>

                        {/* Hamburger - Mobile */}
                        <m.button
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-surface-600 hover:text-surface-950 hover:bg-surface-100 transition-all"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <m.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <RiCloseLine size={24} />
                                    </m.div>
                                ) : (
                                    <m.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <RiMenuLine size={24} />
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </m.button>
                    </div>
                </div>
            </m.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <m.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-surface-950/20 backdrop-blur-sm lg:hidden"
                        />

                        {/* Drawer */}
                        <m.div
                            key="drawer"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 280 }}
                            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-50 lg:hidden flex flex-col safe-bottom bg-white border-l border-surface-200 shadow-2xl"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
                                <Image src="/logo.svg" alt="VibeZ" width={90} height={30} />
                                <m.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-50 text-surface-500 hover:text-surface-950 transition-all"
                                >
                                    <RiCloseLine size={20} />
                                </m.button>
                            </div>

                            {/* Nav Items */}
                            <nav className="flex-1 px-6 py-8 flex flex-col gap-2 overflow-y-auto">
                                {navItems.map((item, idx) => (
                                    <m.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.07 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center justify-between px-4 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all ${
                                                isActive(item.href)
                                                    ? "bg-brand-50 text-brand-600 border border-brand-200"
                                                    : "text-surface-500 hover:text-surface-950 hover:bg-surface-50"
                                            }`}
                                        >
                                            {item.name}
                                            {isActive(item.href) && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50" />
                                            )}
                                        </Link>
                                    </m.div>
                                ))}
                            </nav>

                            {/* Bottom Auth Section */}
                            <div className="px-6 pb-8 pt-4 border-t border-surface-100">
                                {sessionStatus === "authenticated" ? (
                                    <div className="space-y-3">
                                        <Link
                                            href={user?.role === "ADMIN" ? "/admin" : "/profile"}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-4 rounded-2xl bg-surface-50 hover:bg-surface-100 transition-all border border-surface-200"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-surface-950 flex items-center justify-center text-white font-black text-sm">
                                                {user?.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-surface-950 uppercase tracking-tight">{user?.name}</div>
                                                <div className="text-[9px] text-surface-400 uppercase tracking-widest">Authorized Client</div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setIsOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-black uppercase text-xs tracking-widest transition-all border border-red-100"
                                        >
                                            <RiLogoutCircleLine size={18} />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm text-white transition-all bg-gradient-to-r from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30 active:scale-95"
                                    >
                                        <RiUserLine size={18} />
                                        Login to Account
                                    </Link>
                                )}
                            </div>
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
