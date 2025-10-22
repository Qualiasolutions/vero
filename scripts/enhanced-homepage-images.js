#!/usr/bin/env node

/**
 * Enhanced Homepage Images Script
 *
 * This script creates a mapping of product slugs to image URLs from the CSV
 * and generates enhanced fallback images for the homepage
 */

import fs from "fs";

// Load products from JSON
const products = JSON.parse(fs.readFileSync("/tmp/products_to_sync.json", "utf8"));

console.log("\n🖼️  Creating image mapping for homepage...");

// Create a mapping of product slugs to image URLs
const imageMap = {};
const categoryImageMap = {};

products.forEach((product) => {
	if (product.imageUrl) {
		imageMap[product.slug] = product.imageUrl;
	}

	// Also create category-based images for products without specific images
	if (!categoryImageMap[product.category]) {
		categoryImageMap[product.category] = [];
	}
	if (product.imageUrl) {
		categoryImageMap[product.category].push(product.imageUrl);
	}
});

console.log(`✅ Created image mapping for ${Object.keys(imageMap).length} products`);

// Generate a JavaScript file with the image mapping
const imageMappingCode = `
// Auto-generated image mapping for products
export const productImageMap = ${JSON.stringify(imageMap, null, 2)};

export const categoryImages = ${JSON.stringify(categoryImageMap, null, 2)};

// Function to get product image by slug
export function getProductImage(slug, fallbackIndex = 0) {
    if (productImageMap[slug]) {
        return productImageMap[slug];
    }

    // Try to extract category from slug or use fallback
    const categories = Object.keys(categoryImages);
    const randomCategory = categories[fallbackIndex % categories.length];
    const categoryImagesList = categoryImages[randomCategory];

    if (categoryImagesList && categoryImagesList.length > 0) {
        const randomImage = categoryImagesList[fallbackIndex % categoryImagesList.length];
        return randomImage;
    }

    return null;
}

// Premium placeholder images based on car types
export const premiumPlaceholders = {
    sports: [
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107986378-G99ECY8DIPS0GIPKO964/Untitled%2Bdesign%2B%252817%2529.png",
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760108044506-92Z462UX0YCT05QNWIUP/gt341-toyota-supra-gr-fuji-speedway-edition-01-2.jpg"
    ],
    luxury: [
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107955163-BL52Z0X7FW3Y70342O7O/aston-martin-db5-silver-birch-1964-01.jpg",
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760108000880-MF2JE25XC25YLJKEU2EO/1976-Mercedes-Benz-450-SEL-6-9-W116-silver-1-18-Norev-diecast-scale-model-car-7_grande.webp"
    ],
    classic: [
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107962506-ZJCD3KB6WP091BCT9OTA/123200nh.jpg",
        "https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107972843-LZ87LACZV07GT69YPO6H/189034nh.jpg"
    ]
};

export function getPremiumPlaceholder(type = 'sports', index = 0) {
    const placeholders = premiumPlaceholders[type] || premiumPlaceholders.sports;
    return placeholders[index % placeholders.length];
}
`;

// Write the mapping file
fs.writeFileSync("/tmp/product-image-mapping.js", imageMappingCode);
console.log("✅ Image mapping saved to: /tmp/product-image-mapping.js");

// Create enhanced homepage component patch
const homepagePatch = `
// PATCH FOR src/app/(store)/page.tsx
// Add this import near the top:
import { getProductImage, getPremiumPlaceholder } from '@/lib/product-image-mapping';

// Replace the product image section (around lines 191-205) with:
<div className="relative aspect-square w-full bg-white">
    {(() => {
        // Try to get image from mapping first
        const mappedImage = getProductImage(product.slug);
        if (mappedImage) {
            return (
                <Image
                    src={mappedImage}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
            );
        }

        // Use product images if available
        if (product.images && product.images.length > 0 && product.images[0]) {
            return (
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
            );
        }

        // Use premium placeholder based on product name
        const isSports = product.name.toLowerCase().includes('porsche') || product.name.toLowerCase().includes('ferrari') || product.name.toLowerCase().includes('lamborghini');
        const isLuxury = product.name.toLowerCase().includes('mercedes') || product.name.toLowerCase().includes('bmw') || product.name.toLowerCase().includes('aston');
        const placeholderType = isSports ? 'sports' : isLuxury ? 'luxury' : 'classic';
        const placeholderImage = getPremiumPlaceholder(placeholderType, Math.abs(product.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0)));

        return (
            <Image
                src={placeholderImage}
                alt={product.name}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
        );
    })()}
    <FavoriteHeartIcon product={product} />
</div>
`;

fs.writeFileSync("/tmp/homepage-patch.js", homepagePatch);
console.log("✅ Homepage patch saved to: /tmp/homepage-patch.js");

console.log("\n📋 SUMMARY:");
console.log(`- Products with images: ${Object.keys(imageMap).length}`);
console.log(`- Categories: ${Object.keys(categoryImageMap).length}`);
console.log("\n📁 Files created:");
console.log("- /tmp/product-image-mapping.js (copy to src/lib/)");
console.log("- /tmp/homepage-patch.js (apply to page.tsx)");

console.log("\n🔧 NEXT STEPS:");
console.log("1. Copy product-image-mapping.js to src/lib/");
console.log("2. Apply the homepage patch to src/app/(store)/page.tsx");
console.log("3. Build and deploy to see images on homepage!");
