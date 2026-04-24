import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

export const viewport: Viewport = {
  themeColor: '#ef4444',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const googleSans = Outfit({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeZ | Premium Anime & K-pop Prints Sri Lanka",
  description: "High-quality anime notebooks, K-pop collectibles, and custom prints. Islandwide delivery in Sri Lanka. Good Vibez Only.",
  keywords: ["anime", "k-pop", "notebooks", "stickers", "prints", "collectibles", "fan art", "sri lanka", "vibez"],
  authors: [{ name: "VibeZ Team" }],
  icons: {
    icon: "/about-us.png",
    shortcut: "/about-us.png",
    apple: "/about-us.png",
  },
  openGraph: {
    title: "VibeZ | Premium Anime & K-pop Prints Sri Lanka",
    description: "High-quality anime notebooks, K-pop collectibles, and custom prints. Islandwide delivery in Sri Lanka. Good Vibez Only.",
    url: "https://vibez.lk",
    siteName: "VibeZ Sri Lanka",
    images: [
      {
        url: "/about-us.png",
        width: 1200,
        height: 630,
        alt: "VibeZ Premium Prints",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeZ | Premium Anime & K-pop Prints Sri Lanka",
    description: "High-quality anime notebooks, K-pop collectibles, and custom prints. Islandwide delivery in Sri Lanka.",
    images: ["/about-us.png"],
  },
};

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body
          className={`${inter.variable} ${googleSans.variable} font-sans antialiased bg-surface-100 text-surface-950 min-h-[100dvh] selection:bg-brand-500 selection:text-white`}
          suppressHydrationWarning
        >
          <ClientLayout>

            {children}
          </ClientLayout>
        </body>
      </html>
    );
}
