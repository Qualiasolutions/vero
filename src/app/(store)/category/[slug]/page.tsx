import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { ProductList } from "@/ui/products/product-list";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const category = StoreConfig.categories.find(cat => cat.slug === params.slug);

	if (!category) {
		return notFound();
	}


	return {
		title: `${category.name} - Veromodels`,
		description: category.description,
		alternates: { canonical: `${publicUrl}/category/${params.slug}` },
	};
};

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const category = StoreConfig.categories.find(cat => cat.slug === params.slug);

	if (!category) {
		return notFound();
	}

	// Get all products and filter based on category logic
	const allProductsResult = await getProducts(100);
	const allProducts = allProductsResult.data || [];
	let filteredProducts = allProducts;

	// Apply category filtering based on product metadata and category type
	switch (params.slug) {
		case "new-arrivals":
			// Show first 12 products as "new arrivals"
			filteredProducts = allProducts.slice(0, 12);
			break;
		case "on-sale":
			// Show some mid-range products as "on sale"
			filteredProducts = allProducts.slice(12, 24);
			break;
		case "limited-edition":
			// Show products with "limited" in name or premium models
			filteredProducts = allProducts.filter(p =>
				p.name.toLowerCase().includes("limited") ||
				p.name.toLowerCase().includes("edition") ||
				p.price > 150
			);
			// Fallback if no matches
			if (filteredProducts.length === 0) {
				filteredProducts = allProducts.slice(24, 36);
			}
			break;
		case "rare":
			// Show premium/older models
			filteredProducts = allProducts.filter(p =>
				p.name.toLowerCase().includes("rare") ||
				p.name.toLowerCase().includes("vintage") ||
				p.name.toLowerCase().includes("classic")
			);
			// Fallback if no matches
			if (filteredProducts.length === 0) {
				filteredProducts = allProducts.slice(36, 48);
			}
			break;
		case "pre-order":
			// Show some premium models as "pre-order"
			filteredProducts = allProducts.filter(p =>
				p.name.toLowerCase().includes("2025") ||
				p.name.toLowerCase().includes("pre-order")
			);
			// Fallback if no matches
			if (filteredProducts.length === 0) {
				filteredProducts = allProducts.slice(48, 60);
			}
			break;
		case "coming-soon":
			// Show remaining products as "coming soon"
			filteredProducts = allProducts.slice(60);
			break;
		default:
			// If no matching category, return empty
			filteredProducts = [];
	}

	const products = filteredProducts;

	return (
		<main className="pb-16">
			{/* Category Header */}
			<div className="relative bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/20">
				<div className="container mx-auto px-4 py-16 md:py-24">
					<div className="text-center space-y-6">
						<div className="flex items-center justify-center gap-4">
							<span className={`${category.badgeColor} text-white text-xs px-3 py-1 rounded-sm uppercase tracking-wider font-bold`}>
								{category.badge}
							</span>
						</div>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-widest uppercase vero-text-gradient">
							{category.name}
						</h1>
						<div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
						<p className="text-lg text-[#6C757D] max-w-3xl mx-auto leading-relaxed">
							{category.description}
						</p>
						<div className="text-sm text-[#D4AF37] font-medium uppercase tracking-[0.2em]">
							{products.length} {products.length === 1 ? "Premium Model" : "Premium Models"} Available
						</div>
					</div>
				</div>
			</div>

			{/* Products Section */}
			{products.length > 0 ? (
				<div className="container mx-auto px-4 py-16">
					<ProductList products={products} />
				</div>
			) : (
				<div className="container mx-auto px-4 py-20">
					<div className="text-center py-16">
						<div className="text-[#D4AF37]/40 text-6xl mb-6">🏎️</div>
						<h3 className="text-2xl font-light text-[#212529] mb-4 uppercase tracking-wide">
							Models Coming Soon
						</h3>
						<p className="text-[#6C757D] max-w-2xl mx-auto">
							We're currently curating the finest selection for {category.name.toLowerCase()}.
							Check back soon or explore our other collections.
						</p>
						<div className="mt-8">
							<a href="/products" className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium tracking-wide transition-colors">
								View All Models →
							</a>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
