import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        // Find by ID or by Slug
        let article = await prisma.article.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id }
                ]
            }
        });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Hide drafts from public view
        if (!article.published) {
            const session = await auth();
            const isAdmin = (session?.user as any)?.role === 'ADMIN';
            if (!isAdmin) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }
        }

        return NextResponse.json(article);
    } catch (error: any) {
        console.error('Failed to fetch article:', error);
        return NextResponse.json({ error: 'Failed to fetch article', details: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, slug, content, excerpt, image, published, readingTime, authorName, metaTitle, metaDescription, tags } = body;

        const existing = await prisma.article.findUnique({
            where: { id: id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Format slug
        let baseSlug = slug && slug.trim() !== ''
            ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (!baseSlug) baseSlug = 'article';

        let uniqueSlug = baseSlug;
        let counter = 1;
        let slugConflict = true;

        while (slugConflict) {
            const collision = await prisma.article.findFirst({
                where: {
                    slug: uniqueSlug,
                    id: { not: id }
                }
            });
            if (collision) {
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

        const updatedArticle = await prisma.article.update({
            where: { id: id },
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

        return NextResponse.json(updatedArticle);
    } catch (error: any) {
        console.error('Failed to update article:', error);
        return NextResponse.json({ error: 'Failed to update article', details: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.article.findUnique({
            where: { id: id }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        await prisma.article.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete article:', error);
        return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
    }
}
