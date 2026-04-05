/* eslint-disable */
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClientContent from './ProductClientContent';
import { Box } from 'lucide-react';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    // Fetch settings to get actual store name
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    const storeName = settings?.storeName || 'VibeZ';

    const product = await prisma.product.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        }
    });

    if (!product) return { title: 'Product Not Found' };

    const title = product.metaTitle || `${product.name} | ZYNEX STORE`;
    const description = product.metaDescription || product.description.substring(0, 160);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [product.image],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [product.image],
        }
    };
}

// Enable Static Site Generation for all existing products
export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        select: { slug: true }
    });
    return products.map((p) => ({
        slug: p.slug,
    }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    
    // Fetch settings to get actual store name
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    const storeName = settings?.storeName || 'VibeZ';
    
    const product = await prisma.product.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        },
        include: {
            category: true
        }
    });

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-8">
                <Box className="w-24 h-24 text-surface-200" />
                <h1 className="text-5xl font-black text-surface-950 uppercase tracking-tighter">Part Not Found</h1>
                <Link href="/products" className="apex-button">Return to Inventory</Link>
            </div>
        );
    }

    // JSON-LD Structured Data for Google Rich Results
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        sku: product.sku || product.id,
        brand: {
            '@type': 'Brand',
            name: storeName,
        },
        offers: {
            '@type': 'Offer',
            url: `https://apex-auto-parts.com/products/${product.slug}`,
            priceCurrency: 'LKR',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductClientContent product={JSON.parse(JSON.stringify(product))} />
        </>
    );
}
