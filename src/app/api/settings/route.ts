import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
                    currencyCode: 'LKR',
                    currencySymbol: 'Rs.',
                    storeName: 'VibeZ',
                    payhereEnabled: true,
                    bankEnabled: true,
                    codEnabled: true,
                    bankName: '',
                    bankAccount: '',
                    bankBranch: '',
                    codTerms: '',
                    deliveryTerms: '',
                    deliveryBaseFee: 400,
                    deliveryExtraFee: 100,
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
                payhereEnabled: body.payhereEnabled,
                bankEnabled: body.bankEnabled,
                codEnabled: body.codEnabled,
                bankName: body.bankName,
                bankAccount: body.bankAccount,
                bankBranch: body.bankBranch,
                codTerms: body.codTerms,
                deliveryTerms: body.deliveryTerms,
                deliveryBaseFee: typeof body.deliveryBaseFee === 'number' ? body.deliveryBaseFee : parseFloat(body.deliveryBaseFee || 400),
                deliveryExtraFee: typeof body.deliveryExtraFee === 'number' ? body.deliveryExtraFee : parseFloat(body.deliveryExtraFee || 100),
            },
            create: {
                id: 'global',
                currencyCode: body.currencyCode,
                currencySymbol: body.currencySymbol,
                storeName: body.storeName,
                payhereEnabled: body.payhereEnabled !== undefined ? body.payhereEnabled : true,
                bankEnabled: body.bankEnabled !== undefined ? body.bankEnabled : true,
                codEnabled: body.codEnabled !== undefined ? body.codEnabled : true,
                bankName: body.bankName || '',
                bankAccount: body.bankAccount || '',
                bankBranch: body.bankBranch || '',
                codTerms: body.codTerms || '',
                deliveryTerms: body.deliveryTerms || '',
                deliveryBaseFee: typeof body.deliveryBaseFee === 'number' ? body.deliveryBaseFee : parseFloat(body.deliveryBaseFee || 400),
                deliveryExtraFee: typeof body.deliveryExtraFee === 'number' ? body.deliveryExtraFee : parseFloat(body.deliveryExtraFee || 100),
            },
        });
        return NextResponse.json(settings);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
