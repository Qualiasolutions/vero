import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import { ProductList } from "@/ui/products/product-list";

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: "All Models - Veromodels",
		description: "Browse our complete collection of premium 1:18 scale diecast model cars",
		alternates: { canonical: `${publicUrl}/products` },
	};
};

export default async function AllProductsPage() {
	let products: any[] = [];

	try {
		const result = await getProducts(100);
		products = result.data || [];
		console.log(`✅ Loaded ${products.length} products from Stripe on /products`);
	} catch (error) {
		console.error("Error loading products:", error);
		products = [];
	}

	return (
		<main className="pb-16">
			{/* Compact Header */}
			<div className="bg-white border-b border-[#D4AF37]/20">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl md:text-3xl font-light tracking-wider uppercase vero-text-gradient">
							All Models
						</h1>
						<div className="text-sm text-[#D4AF37] font-medium">
							{products.length} {products.length === 1 ? "Model" : "Models"}
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 pt-8">
				<ProductList products={products} />
			</div>
		</main>
	);
}
