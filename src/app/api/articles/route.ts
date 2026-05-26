import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const tag = searchParams.get('tag') || '';
        const limit = parseInt(searchParams.get('limit') || '100');

        // Check if admin is calling (to show drafts)
        const session = await auth();
        const isAdmin = (session?.user as any)?.role === 'ADMIN';

        const whereClause: any = {};
        
        if (!isAdmin) {
            whereClause.published = true;
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
                { excerpt: { contains: search } },
            ];
        }

        if (tag) {
            whereClause.tags = { contains: tag };
        }

        const articles = await prisma.article.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json(articles);
    } catch (error: any) {
        console.error('Failed to fetch articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, content, excerpt, image, published, readingTime, authorName, metaTitle, metaDescription, tags } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        if (!content || !content.trim()) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Generate unique slug
        let baseSlug = slug && slug.trim() !== ''
            ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (!baseSlug) baseSlug = 'article';

        let uniqueSlug = baseSlug;
        let counter = 1;
        let slugConflict = true;

        while (slugConflict) {
            const existing = await prisma.article.findUnique({ where: { slug: uniqueSlug } });
            if (existing) {
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            } else {
                slugConflict = false;
            }
        }

        const finalMetaTitle = metaTitle && metaTitle.trim() !== '' ? metaTitle.trim() : `${title.trim()} | VibeZ`;
        const finalMetaDescription = metaDescription && metaDescription.trim() !== '' 
            ? metaDescription.trim().substring(0, 160)
            : excerpt ? excerpt.trim().replace(/\r?\n|\r/g, " ").substring(0, 155).trim() : content.trim().replace(/\r?\n|\r/g, " ").substring(0, 155).trim();

        const article = await prisma.article.create({
            data: {
                title: title.trim(),
                slug: uniqueSlug,
                content: content.trim(),
                excerpt: excerpt ? excerpt.trim() : '',
                image: image ? image.trim() : '',
                published: Boolean(published),
                readingTime: parseInt(readingTime) || 5,
                authorName: authorName && authorName.trim() !== '' ? authorName.trim() : 'VibeZ Team',
                metaTitle: finalMetaTitle,
                metaDescription: finalMetaDescription,
                tags: tags ? tags.trim() : null
            }
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create article:', error);
        return NextResponse.json({ error: 'Failed to create article', details: error.message }, { status: 500 });
    }
}
