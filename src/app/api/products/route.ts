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
        console.log('Incoming POST data:', body);

        // Sanitize and validate numeric inputs
        const price = typeof body.price === 'string' ? parseFloat(body.price) : body.price;
        const stock = typeof body.stock === 'string' ? parseInt(body.stock) : body.stock;
        const weight = typeof body.weight === 'string' ? parseFloat(body.weight) : (body.weight || 0);

        if (isNaN(price) || isNaN(stock) || isNaN(weight)) {
            return NextResponse.json({ error: 'Invalid numeric data detected in price, stock, or weight.' }, { status: 400 });
        }
        
        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: price,
                image: body.image,
                stock: stock,
                weight: weight,
                sku: body.sku && body.sku.trim() !== "" ? body.sku : null,
                categoryId: body.categoryId,
                metaTitle: body.metaTitle && body.metaTitle.trim() !== "" ? body.metaTitle : null,
                metaDescription: body.metaDescription && body.metaDescription.trim() !== "" 
                    ? body.metaDescription.substring(0, 160) 
                    : body.description?.substring(0, 160),
                warranty: body.warranty,
                hasWarranty: body.hasWarranty ?? true,
                delivery: body.delivery,
                hasDelivery: body.hasDelivery ?? true,
                returns: body.returns,
                hasReturns: body.hasReturns ?? true,
                terms: body.terms,
                tags: body.tags,
            } as any,
            include: {
                category: true,
            },
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('API Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({ 
            error: 'Failed to create product',
            details: error.message 
        }, { status: 500 });
    }
}
