import { Suspense } from "react";
import { getLocale } from "@/i18n/server";
import { getProducts } from "@/lib/product-service";
import ProductsClient from "./products-client";

export default async function AllProductsPage() {
	// Fetch products server-side
	const result = await getProducts(100);
	const products = result.data || [];
	const locale = await getLocale();

	return (
		<Suspense fallback={<ProductsPageSkeleton />}>
			<ProductsClient initialProducts={products} locale={locale} />
		</Suspense>
	);
}

// Loading skeleton for better UX
function ProductsPageSkeleton() {
	return (
		<div className="min-h-screen bg-[var(--selfridges-bg-primary)] animate-pulse">
			<div className="relative w-full h-[400px] md:h-[500px] bg-gray-200" />
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-96 bg-gray-200 rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
}
