import type { Product } from "@/lib/product-service";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { CategoryContent } from "@/ui/category/category-content";

interface CategoryProductsProps {
	categorySlug: string;
}

async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
	// Get all products and filter based on category logic
	const allProductsResult = await getProducts(100);
	const allProducts = allProductsResult.data || [];
	let filteredProducts = allProducts;

	// Apply category filtering based on product metadata and category type
	switch (categorySlug) {
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

	return filteredProducts;
}

export async function CategoryProducts({ categorySlug }: CategoryProductsProps) {
	const products = await getCategoryProducts(categorySlug);
	const category = StoreConfig.categories.find((cat) => cat.slug === categorySlug);

	if (!category) {
		return (
			<div className="container mx-auto px-4 py-12">
				<div className="text-center py-12">
					<h3 className="text-xl font-light text-[#212529] mb-3 uppercase tracking-wide">
						Category Not Found
					</h3>
					<p className="text-[#6C757D] max-w-lg mx-auto text-sm">
						The category you're looking for doesn't exist. Explore our other collections.
					</p>
				</div>
			</div>
		);
	}

	return (
		<main className="pb-16">
			{/* Compact Category Header */}
			<div className="bg-white border-b border-[#D4AF37]/20">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span
								className={`${category.badgeColor} text-white text-xs px-2 py-1 rounded-sm uppercase tracking-wider font-bold`}
							>
								{category.badge}
							</span>
							<h1 className="text-2xl md:text-3xl font-light tracking-wider uppercase vero-text-gradient">
								{category.name}
							</h1>
						</div>
						<div className="text-sm text-[#D4AF37] font-medium">
							{products.length} {products.length === 1 ? "Model" : "Models"}
						</div>
					</div>
				</div>
			</div>

			{/* Products Section with Filters */}
			{products.length > 0 ? (
				<CategoryContent products={products} />
			) : (
				<div className="container mx-auto px-4 py-12">
					<div className="text-center py-12">
						<div className="text-[#D4AF37]/40 text-4xl mb-4">🏎️</div>
						<h3 className="text-xl font-light text-[#212529] mb-3 uppercase tracking-wide">
							Models Coming Soon
						</h3>
						<p className="text-[#6C757D] max-w-lg mx-auto text-sm">
							We're currently curating the finest selection for {category.name.toLowerCase()}. Check back soon
							or explore our other collections.
						</p>
						<div className="mt-6">
							<a
								href="/products"
								className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium tracking-wide transition-colors text-sm"
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
