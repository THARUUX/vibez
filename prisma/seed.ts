import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Database Seed ---');

    // 2. Create Global Settings
    console.log('Creating global settings...');
    await prisma.settings.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            storeName: 'Apex Auto Parts',
            currencyCode: 'USD',
            currencySymbol: '$'
        }
    });

    // 3. Create Categories
    console.log('Seeding categories...');
    const categories = [
        {
            name: 'Performance',
            slug: 'performance',
            description: 'High-performance upgrades for power and speed.',
            image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Maintenance',
            slug: 'maintenance',
            description: 'Essential service parts, oils, and filters.',
            image: 'https://images.unsplash.com/photo-1610493864198-4eabd27df61a?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Braking Systems',
            slug: 'brakes',
            description: 'Ceramic pads, drilled rotors, and high-temp fluid.',
            image: 'https://images.unsplash.com/photo-1598083842605-7af83fb18ebd?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Suspension',
            slug: 'suspension',
            description: 'Coilovers, lowering springs, and control arms.',
            image: 'https://images.unsplash.com/photo-1612997951721-4d986a7aeecb?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Lighting & Electrical',
            slug: 'lighting',
            description: 'LED conversions, headlight assemblies, and performance batteries.',
            image: 'https://images.unsplash.com/photo-1594002429411-9e73fcbe44b0?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Engine Components',
            slug: 'engine',
            description: 'Gaskets, pistons, timing belts, and intake manifolds.',
            image: 'https://images.unsplash.com/photo-1616788494672-87d042f9da37?auto=format&fit=crop&q=80&w=800',
        }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { ...cat },
            create: cat,
        });
    }

    const dbCats = await prisma.category.findMany();
    const catMap: Record<string, string> = Object.fromEntries(
        dbCats.map((c: { slug: string; id: string }) => [c.slug, c.id])
    );

    // 4. Create Products
    console.log('Seeding products...');
    const products = [
        {
            name: "V6 Performance Air Intake",
            slug: "v6-air-intake",
            price: 249.99,
            description: "High-flow cold air intake system for maximum horsepower gains and aggressive sound.",
            image: "https://images.unsplash.com/photo-1610493863481-9b7e779a543f?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['performance'],
            stock: 12,
            sku: "PER-INT-01",
            metaTitle: "V6 Performance Cold Air Intake | Apex Auto",
            metaDescription: "Boost your V6 engine's power with our high-flow cold air intake system.",
        },
        {
            name: "High-Temp Brake Fluid",
            slug: "race-brake-fluid",
            price: 24.50,
            description: "DOT 4 high-performance brake fluid designed for extreme track conditions and heat resistance.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['maintenance'],
            stock: 85,
            sku: "MNT-BRK-FL",
            metaTitle: "DOT 4 High-Temp Brake Fluid | Apex Auto",
            metaDescription: "Professional grade high-temp brake fluid for street and track use.",
        },
        {
            name: "Drilled & Slotted Rotors",
            slug: "rotors-drilled-slotted",
            price: 189.00,
            description: "Precision-engineered rotors for superior heat dissipation and wet-weather performance.",
            image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['brakes'],
            stock: 24,
            sku: "BRK-ROT-DS",
            metaTitle: "Performance Drilled & Slotted Rotors | Apex Auto",
            metaDescription: "Upgrade your braking performance with our precision-engineered rotors.",
        },
        {
            name: "Adjustable Coilover Kit",
            slug: "adjustable-coilovers",
            price: 1199.99,
            description: "Complete suspension solution with 32 levels of damping adjustment and height control.",
            image: "https://images.unsplash.com/photo-1612997951721-4d986a7aeecb?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['suspension'],
            stock: 8,
            sku: "SUS-COI-ADJ",
            metaTitle: "32-Way Adjustable Coilover Kit | Apex Auto",
            metaDescription: "Take control of your handling with our adjustable suspension kits.",
        },
        {
            name: "LED Headlight Conversion",
            slug: "led-headlight-kit",
            price: 79.99,
            description: "6000K Diamond White LED bulb kit with 12,000 lumens output and easy plug-play install.",
            image: "https://images.unsplash.com/photo-1594002429411-9e73fcbe44b0?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['lighting'],
            stock: 150,
            sku: "LGT-LED-6K",
            metaTitle: "6000K LED Headlight Conversion Kit | Apex Auto",
            metaDescription: "Brighten your drive with high-performance LED headlight upgrades.",
        },
        {
            name: "Forged Racing Pistons",
            slug: "forged-pistons-v8",
            price: 849.00,
            description: "Ultra-strong forged aluminum pistons for high-compression engine builds.",
            image: "https://images.unsplash.com/photo-1616788494672-87d042f9da37?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['engine'],
            stock: 4,
            sku: "ENG-PIS-FRG",
            metaTitle: "Forged Aluminum Racing Pistons | Apex Auto",
            metaDescription: "Professional grade engine internals for high-performance builds.",
        },
        {
            name: "Carbon Fiber Clutch Kit",
            slug: "carbon-clutch-kit",
            price: 649.99,
            description: "Stage 3 carbon-aramid clutch kit rated for up to 600 lb-ft of torque.",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
            categoryId: catMap['performance'],
            stock: 6,
            sku: "PER-CLU-C3",
            metaTitle: "Stage 3 Carbon Fiber Clutch Kit | Apex Auto",
            metaDescription: "Heavy-duty transmission performance for high-power vehicles.",
        }
    ];

    for (const prod of products) {
        await prisma.product.upsert({
            where: { slug: prod.slug },
            update: { ...prod },
            create: prod,
        });
    }

    // 5. Create Admin User
    console.log('Seeding admin account...');
    const adminEmail = 'admin@apexauto.com';
    const hashedPassword = await bcrypt.hash('admin123', 12);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: { password: hashedPassword },
        create: {
            email: adminEmail,
            name: 'System Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('--- Seed Completed Successfully! ---');
}

main()
    .catch((e) => {
        console.error('Seed Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
