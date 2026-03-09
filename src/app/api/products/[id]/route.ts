import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const product = await prisma.product.update({
            where: { id: params.id },
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
        return NextResponse.json(product);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
