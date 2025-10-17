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
	} catch (error) {
		console.error("Error loading products:", error);
		products = [];
	}

	
	return (
		<main className="pb-16">
			<div className="mb-8 sm:mb-12 text-center space-y-4">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider vero-text-gradient uppercase px-4">
					All Models
				</h1>
				<div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
				<p className="text-xs sm:text-sm text-[#D4AF37] uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4">
					{products.length} Premium Diecast Models Available
				</p>
			</div>
			<ProductList products={products} />
		</main>
	);
}
