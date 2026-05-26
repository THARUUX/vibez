import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'IDs are required' }, { status: 400 });
        }

        const result = await prisma.article.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return NextResponse.json({ count: result.count });
    } catch (error: any) {
        console.error('Failed to perform bulk delete on articles:', error);
        return NextResponse.json({ error: 'Failed to perform bulk delete', details: error.message }, { status: 500 });
    }
}
