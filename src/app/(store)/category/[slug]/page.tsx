import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { CategoryContent } from "@/ui/category/category-content";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const category = StoreConfig.categories.find((cat) => cat.slug === params.slug);

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
	const category = StoreConfig.categories.find((cat) => cat.slug === params.slug);

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
			filteredProducts = allProducts.filter(
				(p) =>
					p.name.toLowerCase().includes("limited") ||
					p.name.toLowerCase().includes("edition") ||
					p.price > 150,
			);
			// Fallback if no matches
			if (filteredProducts.length === 0) {
				filteredProducts = allProducts.slice(24, 36);
			}
			break;
		case "rare":
			// Show premium/older models
			filteredProducts = allProducts.filter(
				(p) =>
					p.name.toLowerCase().includes("rare") ||
					p.name.toLowerCase().includes("vintage") ||
					p.name.toLowerCase().includes("classic"),
			);
			// Fallback if no matches
			if (filteredProducts.length === 0) {
				filteredProducts = allProducts.slice(36, 48);
			}
			break;
		case "pre-order":
			// Show some premium models as "pre-order"
			filteredProducts = allProducts.filter(
				(p) => p.name.toLowerCase().includes("2025") || p.name.toLowerCase().includes("pre-order"),
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
			{/* Enhanced Category Header */}
			<div className="relative bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] border-b border-[#D4AF37]/30 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-0 right-0 w-96 h-96 border border-[#D4AF37] rounded-full -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-64 h-64 border border-[#D4AF37] rounded-full translate-y-1/2 -translate-x-1/2" />
				</div>

				<div className="relative container mx-auto px-4 py-10">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="flex items-center gap-4">
							<span
								className={`${category.badgeColor} text-white text-xs px-3 py-1.5 rounded-md uppercase tracking-wider font-bold shadow-lg`}
							>
								{category.badge}
							</span>
							<div>
								<h1 className="text-3xl md:text-4xl font-light tracking-wider uppercase text-white mb-2">
									{category.name}
								</h1>
								{category.description && (
									<p className="text-[#E6C757] text-sm md:text-base max-w-2xl">
										{category.description}
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
								<div className="text-2xl font-bold text-[#D4AF37]">{products.length}</div>
								<div className="text-xs text-white/80 uppercase tracking-wide">
									{products.length === 1 ? "Model" : "Models"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Products Section with Filters */}
			{products.length > 0 ? (
				<CategoryContent products={products} />
			) : (
				<div className="container mx-auto px-4 py-12">
					<div className="vero-card rounded-2xl p-12 text-center border border-[#D4AF37]/20 max-w-2xl mx-auto">
						<div className="text-[#D4AF37]/40 text-6xl mb-6">🏎️</div>
						<h3 className="text-2xl font-light text-[#212529] mb-4 uppercase tracking-wide">
							Models Coming Soon
						</h3>
						<p className="text-[#6C757D] leading-relaxed mb-8">
							We're currently curating the finest selection for {category.name.toLowerCase()}. Check back soon
							or explore our other collections.
						</p>
						<div className="mt-6">
							<a
								href="/products"
								className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/30 uppercase tracking-wide text-sm"
							>
								View All Models →
							</a>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
