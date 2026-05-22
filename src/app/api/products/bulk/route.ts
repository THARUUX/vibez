import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { products } = body;

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'No products provided for import.' }, { status: 400 });
        }

        const createdProducts = [];
        const errors: string[] = [];

        // Fetch existing categories to ensure validation is sound
        const allCategories = await prisma.category.findMany();
        const categoryIds = new Set(allCategories.map(c => c.id));

        for (let i = 0; i < products.length; i++) {
            const item = products[i];
            const rowNumber = i + 2; // offset for 1-based index + header row

            // Basic Validation
            if (!item.name || !item.name.trim()) {
                errors.push(`Row ${rowNumber}: Product name is missing.`);
                continue;
            }
            if (!item.categoryId || !categoryIds.has(item.categoryId)) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Category is missing or invalid.`);
                continue;
            }

            const price = parseFloat(item.price);
            if (isNaN(price) || price < 0) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Price must be a non-negative number.`);
                continue;
            }

            const stock = parseInt(item.stock);
            if (isNaN(stock) || stock < 0) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Stock must be a non-negative integer.`);
                continue;
            }

            const weight = parseFloat(item.weight || '0');
            if (isNaN(weight) || weight < 0) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Weight must be a non-negative number.`);
                continue;
            }

            if (!item.image || !item.image.trim()) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Image URL is missing.`);
                continue;
            }

            if (!item.description || !item.description.trim()) {
                errors.push(`Row ${rowNumber} ("${item.name}"): Description is missing.`);
                continue;
            }

            // SKU Uniqueness Check
            const sku = item.sku && item.sku.trim() !== '' ? item.sku.trim() : null;
            if (sku) {
                const skuExists = await prisma.product.findUnique({
                    where: { sku }
                });
                if (skuExists) {
                    errors.push(`Row ${rowNumber} ("${item.name}"): Duplicate SKU "${sku}" already exists in the database.`);
                    continue;
                }
            }

            // Slug Generation with collision resolution
            let baseSlug = item.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            if (!baseSlug) baseSlug = 'product';

            let uniqueSlug = baseSlug;
            let slugCounter = 1;
            let slugConflict = true;

            while (slugConflict) {
                const existingProduct = await prisma.product.findUnique({
                    where: { slug: uniqueSlug }
                });
                if (existingProduct) {
                    uniqueSlug = `${baseSlug}-${slugCounter}`;
                    slugCounter++;
                } else {
                    slugConflict = false;
                }
            }

            // Generate SEO defaults if missing
            const metaTitle = item.metaTitle && item.metaTitle.trim() !== '' 
                ? item.metaTitle.trim() 
                : `${item.name.trim()} | VibeZ`;

            const metaDescription = item.metaDescription && item.metaDescription.trim() !== '' 
                ? item.metaDescription.trim().substring(0, 160) 
                : item.description.trim().replace(/\r?\n|\r/g, " ").substring(0, 155).trim();

            try {
                const product = await prisma.product.create({
                    data: {
                        name: item.name.trim(),
                        slug: uniqueSlug,
                        description: item.description.trim(),
                        price: price,
                        image: item.image.trim(),
                        stock: stock,
                        weight: weight,
                        sku: sku,
                        categoryId: item.categoryId,
                        metaTitle: metaTitle,
                        metaDescription: metaDescription,
                        warranty: item.warranty || null,
                        hasWarranty: item.hasWarranty !== undefined ? Boolean(item.hasWarranty) : true,
                        delivery: item.delivery || null,
                        hasDelivery: item.hasDelivery !== undefined ? Boolean(item.hasDelivery) : true,
                        returns: item.returns || null,
                        hasReturns: item.hasReturns !== undefined ? Boolean(item.hasReturns) : true,
                        terms: item.terms || null,
                        tags: item.tags || null,
                    }
                });
                createdProducts.push(product);
            } catch (createError: any) {
                console.error(`Error creating product at Row ${rowNumber}:`, createError);
                errors.push(`Row ${rowNumber} ("${item.name}"): Database creation failed - ${createError.message}`);
            }
        }

        if (createdProducts.length === 0 && errors.length > 0) {
            return NextResponse.json({
                error: 'Import failed completely.',
                details: errors
            }, { status: 400 });
        }

        return NextResponse.json({
            message: `Successfully imported ${createdProducts.length} products.`,
            count: createdProducts.length,
            errors: errors.length > 0 ? errors : null
        }, { status: 201 });

    } catch (error: any) {
        console.error('Bulk Import API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error during import.', details: error.message }, { status: 500 });
    }
}
