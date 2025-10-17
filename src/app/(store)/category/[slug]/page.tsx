import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { commerce } from "@/lib/commerce";
import { deslugify } from "@/lib/utils";
import { ProductList } from "@/ui/products/product-list";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const result = await commerce.product.browse({
		first: 100,
		category: params.slug, // YNS SDK uses direct category parameter
	});

	if (!result.data || result.data.length === 0) {
		return notFound();
	}

	const t = await getTranslations("/category.metadata");

	return {
		title: t("title", { categoryName: deslugify(params.slug) }),
		alternates: { canonical: `${publicUrl}/category/${params.slug}` },
	};
};

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const result = await commerce.product.browse({
		first: 100,
		category: params.slug, // YNS SDK uses direct category parameter
	});

	if (!result.data || result.data.length === 0) {
		return notFound();
	}

	const products = result.data;

	const t = await getTranslations("/category.page");

	return (
		<main className="pb-16">
			<div className="mb-8 sm:mb-12 space-y-4">
				<div className="text-center space-y-3">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider vero-text-gradient uppercase px-4">
						{deslugify(params.slug)}
					</h1>
					<div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
				</div>
				<p className="text-center text-xs sm:text-sm text-[#D4AF37] uppercase tracking-[0.2em] sm:tracking-[0.3em] px-4">
					{t("title", { categoryName: deslugify(params.slug) })}
				</p>
				<div className="text-center text-xs sm:text-sm text-[#6C757D] mt-4">
					{products.length} {products.length === 1 ? "Model" : "Models"}
				</div>
			</div>
			<ProductList products={products} />
		</main>
	);
}
