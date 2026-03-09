import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: 'global' },
        });

        if (!settings) {
            // Initialize global settings if they don't exist
            settings = await prisma.settings.create({
                data: {
                    id: 'global',
                    currencyCode: 'USD',
                    currencySymbol: '$',
                    storeName: 'Apex Auto Parts',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = await prisma.settings.upsert({
            where: { id: 'global' },
            update: {
                currencyCode: body.currencyCode,
                currencySymbol: body.currencySymbol,
                storeName: body.storeName,
            },
            create: {
                id: 'global',
                currencyCode: body.currencyCode,
                currencySymbol: body.currencySymbol,
                storeName: body.storeName,
            },
        });
        return NextResponse.json(settings);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
