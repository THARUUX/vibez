"use client";

import { Navigation } from "./Navigation";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { ReactLenis } from 'lenis/react';
import { LoadingScreen } from "./LoadingScreen";
import { AuthProvider } from "./AuthProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const { syncSettings } = useSettingsStore();

    useEffect(() => {
        syncSettings();
    }, [syncSettings]);

    return (
        <AuthProvider>
            {isAdmin ? (
                <>{children}</>
            ) : (
                <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
                    {!isAdmin && <LoadingScreen />}
                    <Navigation />
                    <CartDrawer />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </ReactLenis>
            )}
        </AuthProvider>
    );
}
