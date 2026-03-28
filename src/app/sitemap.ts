import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://apex-auto-parts.com';

    // Fetch all products
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true }
    });

    // Fetch all categories
    const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true }
    });

    const productEntries = products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const categoryEntries = categories.map((c) => ({
        url: `${baseUrl}/categories/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productEntries,
        ...categoryEntries,
    ];
}
