/* eslint-disable */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const orders = await prisma.order.findMany({
            where: userId ? { userId } : {},
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, shippingData, total, userId } = body;

        const order = await prisma.order.create({
            data: {
                userId,
                total,
                shippingName: `${shippingData.firstName} ${shippingData.lastName}`,
                shippingAddress: shippingData.address,
                shippingCity: shippingData.city,
                shippingZip: shippingData.zip,
                status: 'PENDING',
                orderItems: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });

        // Update stock levels
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.id },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
