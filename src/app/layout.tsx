import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Auto Parts | Premium Spares",
  description: "High-performance motor spare parts, OEM replacements, and racing components.",
  keywords: ["auto parts", "motor spares", "car parts", "racing parts", "OEM", "nextjs"],
};

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body
          className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-surface-100 text-surface-950 min-h-screen selection:bg-brand-500 selection:text-white`}
        >
          <div className="fixed inset-0 z-[-1] bg-surface-100"></div>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    );
}
