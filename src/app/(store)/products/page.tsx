import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { commerce } from "@/lib/commerce";
import { ProductList } from "@/ui/products/product-list";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/products.metadata");
	return {
		title: t("title"),
		alternates: { canonical: `${publicUrl}/products` },
	};
};

export default async function AllProductsPage() {
	let products: any[] = [];

	try {
		const result = await commerce.product.browse({ first: 100 });
		products = result?.data || [];
	} catch (error) {
		console.error("Error loading products:", error);
		products = [];
	}

	const t = await getTranslations("/products.page");

	return (
		<main className="pb-16">
			<div className="mb-8 sm:mb-12 text-center space-y-4">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider vero-text-gradient uppercase px-4">
					{t("title")}
				</h1>
				<div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
				<p className="text-xs sm:text-sm text-[#D4AF37] uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4">
					Premium Diecast Collection
				</p>
			</div>
			<ProductList products={products} />
		</main>
	);
}
