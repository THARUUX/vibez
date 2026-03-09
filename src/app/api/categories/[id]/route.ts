import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
            },
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.category.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
