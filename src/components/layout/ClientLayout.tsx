"use client";

import { Navigation } from "./Navigation";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

import { LoadingScreen } from "./LoadingScreen";
import { AuthProvider } from "./AuthProvider";


export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const { syncSettings, storeName } = useSettingsStore();

    useEffect(() => {
        // Only sync if we haven't successfully synced yet (indicated by storeName being default or specific condition)
        // This prevents potential re-render loops if syncSettings identity were to change
        syncSettings();
    }, [syncSettings]);

    return (
        <AuthProvider>
            {isAdmin ? (
                <>{children}</>
            ) : (
                <>
                    {!isAdmin && <LoadingScreen />}
                    {/* <Navigation /> */}

                    {/* <CartDrawer />
                    <main className="pt-20 min-h-screen">
                        {children}
                    </main> */}
                    {/* <Footer /> */}
                </>
            )}
        </AuthProvider>
    );
}
