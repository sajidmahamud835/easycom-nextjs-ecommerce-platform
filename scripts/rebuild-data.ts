/*
  REBUILD DATA SCRIPT
  - Wipes all existing data (products, categories, brands, orders, reviews)
  - Seeds standardized Categories and Brands
  - Seeds 23 High-Quality Products mapped from standardized images
  - Uses realistic descriptions, prices, and new schema fields (SKU, SEO, Tags)
*/

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('❌ Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2025-01-01',
});

// --- DATA DEFINITIONS ---

const CATEGORIES = [
    { _id: 'category-electronics', name: 'Electronics', description: 'Cutting-edge gadgets and devices' },
    { _id: 'category-fashion', name: 'Fashion', description: 'Trendy apparel and accessories' },
    { _id: 'category-home', name: 'Home & Living', description: 'Everything for your modern home' },
    { _id: 'category-sports', name: 'Sports', description: 'High-performance gear' },
    { _id: 'category-toys', name: 'Toys & Hobbies', description: 'Fun for all ages' },
    { _id: 'category-beauty', name: 'Beauty', description: 'Skincare and cosmetics' },
];

const BRANDS = [
    { _id: 'brand-apple', name: 'Apple' },
    { _id: 'brand-samsung', name: 'Samsung' },
    { _id: 'brand-sony', name: 'Sony' },
    { _id: 'brand-nike', name: 'Nike' },
    { _id: 'brand-adidas', name: 'Adidas' },
    { _id: 'brand-lg', name: 'LG' },
    { _id: 'brand-dyson', name: 'Dyson' },
    { _id: 'brand-lego', name: 'LEGO' },
    { _id: 'brand-generic', name: 'Generic' },
];

// Product Templates (to make generated data realistic)
const PRODUCT_TEMPLATES = [
    { name: "Pro X1 Smartphone", cat: 'category-electronics', brand: 'brand-samsung', priceBase: 699, tags: ['smartphone', '5g', 'android'] },
    { name: "Ultra Book Air", cat: 'category-electronics', brand: 'brand-apple', priceBase: 1299, tags: ['laptop', 'macbook', 'lightweight'] },
    { name: "NoiseCanceller 3000", cat: 'category-electronics', brand: 'brand-sony', priceBase: 349, tags: ['headphones', 'audio', 'wireless'] },
    { name: "Air Zoom Runner", cat: 'category-fashion', brand: 'brand-nike', priceBase: 120, tags: ['shoes', 'running', 'sportswear'] },
    { name: "OLED 4K Smart TV", cat: 'category-electronics', brand: 'brand-lg', priceBase: 1500, tags: ['tv', '4k', 'oled'] },
    { name: "Cyclone V10 Vacuum", cat: 'category-home', brand: 'brand-dyson', priceBase: 499, tags: ['vacuum', 'cleaning', 'home'] },
    { name: "Galaxy Tab S9", cat: 'category-electronics', brand: 'brand-samsung', priceBase: 799, tags: ['tablet', 'android', 'productivity'] },
    { name: "PlayStation 5 Pro", cat: 'category-electronics', brand: 'brand-sony', priceBase: 499, tags: ['gaming', 'console', '4k'] },
    { name: "Millennium Falcon Set", cat: 'category-toys', brand: 'brand-lego', priceBase: 169, tags: ['lego', 'star wars', 'toy'] },
    { name: "Stan Smith Classic", cat: 'category-fashion', brand: 'brand-adidas', priceBase: 85, tags: ['sneakers', 'casual', 'vintage'] },
];

// --- HELPER FUNCTIONS ---

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateVariants = (category) => {
    if (category === 'category-fashion') {
        return [{
            _key: uuidv4(),
            name: "Size",
            options: [
                { _key: uuidv4(), label: "S", priceModifier: 0, isDefault: true },
                { _key: uuidv4(), label: "M", priceModifier: 0 },
                { _key: uuidv4(), label: "L", priceModifier: 0 },
                { _key: uuidv4(), label: "XL", priceModifier: 5 },
            ]
        }, {
            _key: uuidv4(),
            name: "Color",
            options: [
                { _key: uuidv4(), label: "Black", priceModifier: 0, isDefault: true },
                { _key: uuidv4(), label: "White", priceModifier: 0 },
            ]
        }];
    }
    if (category === 'category-electronics') {
        return [{
            _key: uuidv4(),
            name: "Storage",
            options: [
                { _key: uuidv4(), label: "128GB", priceModifier: 0, isDefault: true },
                { _key: uuidv4(), label: "256GB", priceModifier: 100 },
                { _key: uuidv4(), label: "512GB", priceModifier: 200 },
            ]
        }];
    }
    return [];
};

// --- MAIN FUNCTION ---

async function main() {
    console.log("⚠️  STARTING DATA REBUILD - THIS WILL DELETE ALL DATA  ⚠️");
    console.log(`Project: ${projectId} | Dataset: ${dataset}`);

    // 1. WIPE DATA
    console.log("🔥 Deleting existing data...");
    await client.delete({ query: '*[_type in ["product", "category", "brand", "order", "review", "ticket"]]' });
    console.log("✓ Data wiped.");

    // 2. SEED CATEGORIES
    console.log("🌱 Seeding Categories...");
    const categoryTransaction = client.transaction();
    CATEGORIES.forEach(cat => {
        categoryTransaction.createOrReplace({
            _id: cat._id,
            _type: 'category',
            title: cat.name, // Schema mismatch risk: "title" vs "name". Using both to be safe or checking schema. 
            // Previous schema had 'name'. Let's stick to standard Sanity patterns, usually 'title'. 
            // Wait, existing schema uses 'name'? Let's check. 
            // Re-checking category schema... assume 'title' is best practice, but let's support 'name' if schema has it.
            name: cat.name, // Backwards compat
            slug: { _type: 'slug', current: slugify(cat.name) },
            description: cat.description
        });
    });
    await categoryTransaction.commit();
    console.log("✓ Categories seeded.");

    // 3. SEED BRANDS
    console.log("🌱 Seeding Brands...");
    const brandTransaction = client.transaction();
    BRANDS.forEach(brand => {
        brandTransaction.createOrReplace({
            _id: brand._id,
            _type: 'brand',
            title: brand.name,
            name: brand.name,
            slug: { _type: 'slug', current: slugify(brand.name) }
        });
    });
    await brandTransaction.commit();
    console.log("✓ Brands seeded.");

    // 4. UPLOAD IMAGES & CREATE PRODUCTS
    const imagesDir = path.join(__dirname, '..', 'images', 'products');
    const imageFiles = fs.readdirSync(imagesDir).filter(f => f.startsWith('product-') && /\.(png|jpe?g|webp)$/i.test(f)).sort();

    console.log(`📸 Found ${imageFiles.length} standardized images. Creating products...`);

    for (const [index, file] of imageFiles.entries()) {
        const filePath = path.join(imagesDir, file);

        // Upload Asset
        const fileStream = fs.createReadStream(filePath);
        const asset = await client.assets.upload('image', fileStream, { filename: file });

        // Pick Template
        const template = PRODUCT_TEMPLATES[index % PRODUCT_TEMPLATES.length];
        const uniqueName = index < PRODUCT_TEMPLATES.length ? template.name : `${template.name} (${index + 1})`;
        const slug = slugify(uniqueName);
        const sku = `SKU-${1000 + index}`;

        const product = {
            _type: 'product',
            name: uniqueName,
            slug: { _type: 'slug', current: slug },
            sku: sku,
            price: template.priceBase + (index * 10),
            description: `Experience the power of the ${uniqueName}. Designed for performance and style, this item features top-tier specifications and premium materials. Ideal for ${template.tags.join(', ')}.`,
            stock: getRandomInt(5, 50),
            status: index % 5 === 0 ? 'hot' : 'new',
            isFeatured: index < 5,
            isTodaysDeal: index === 0, // First item is deal
            rating: 4 + (Math.random()),
            totalReviews: getRandomInt(10, 500),

            // References
            categories: [{ _type: 'reference', _ref: template.cat }],
            brand: { _type: 'reference', _ref: template.brand },

            // Images
            images: [{ _type: 'image', asset: { _type: 'reference', _ref: asset._id } }],

            // New Fields
            tags: template.tags,
            variants: generateVariants(template.cat),
            seo: {
                metaTitle: `${uniqueName} | EasyCom Store`,
                metaDescription: `Buy ${uniqueName} at best price. ${template.tags.join(', ')}.`,
                keywords: template.tags
            },

            // Metadata
            weight: getRandomInt(1, 5),
            dimensions: "20x10x5 cm"
        };

        await client.create(product);
        console.log(`✓ Created: ${uniqueName} (${sku})`);
    }

    console.log("✅ REBUILD COMPLETE! Sanity is now fresh and standardized.");
}

main().catch(err => {
    console.error("❌ Rebuild failed:", err);
    process.exit(1);
});
