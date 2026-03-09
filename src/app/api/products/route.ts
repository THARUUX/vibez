import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            take: limit,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                image: body.image,
                stock: body.stock,
                sku: body.sku,
                categoryId: body.categoryId,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
            },
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
