import { RedirectType, redirect } from "next/navigation";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { searchProducts } from "@/lib/product-service";
import { ProductList } from "@/ui/products/product-list";
import { ProductNotFound } from "@/ui/products/product-not-found";

export const generateMetadata = async (props: {
	searchParams: Promise<{
		q?: string;
	}>;
}): Promise<Metadata> => {
	const searchParams = await props.searchParams;
	const t = await getTranslations("/search.metadata");
	return {
		title: t("title", { query: searchParams.q }),
		alternates: { canonical: `${publicUrl}/search` },
	};
};

export default async function SearchPage(props: {
	searchParams: Promise<{
		q?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const query = searchParams.q;

	if (!query) {
		return redirect("/", RedirectType.replace);
	}

	const t = await getTranslations("/search.page");

	const products = await searchProducts(query);

	return (
		<main>
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("title", { query })}
			</h1>
			{products && products.length > 0 ? <ProductList products={products} /> : <ProductNotFound query={query} />}
		</main>
	);
}
