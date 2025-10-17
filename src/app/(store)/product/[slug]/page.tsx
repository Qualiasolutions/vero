// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";

import type { YnsProduct } from "commerce-kit";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import { AddToCart } from "@/components/add-to-cart";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { publicUrl } from "@/env.mjs";
import { getLocale, getTranslations } from "@/i18n/server";
import { commerce } from "@/lib/commerce";
import { deslugify, formatMoney } from "@/lib/utils";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import { Markdown } from "@/ui/markdown";
import { MainProductImage } from "@/ui/products/main-product-image";
import { YnsLink } from "@/ui/yns-link";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const product = await commerce.product.get({ slug: params.slug });

	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${params.slug}`);

	return {
		title: t("title", { productName: product.name }),
		description: product.summary,
		alternates: { canonical },
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; image?: string }>;
}) {
	const params = await props.params;

	const product = await commerce.product.get({ slug: params.slug });

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	// Cast to YnsProduct to access YNS-specific fields
	const ynsProduct = product as YnsProduct;
	const category = ynsProduct.category?.slug;
	const images = product.images;

	return (
		<article className="pb-16">
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="inline-flex min-h-12 min-w-12 items-center justify-center text-[#D4AF37] hover:text-[#B8941F]">
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator className="text-[#D4AF37]/50" />
							<BreadcrumbItem>
								<BreadcrumbLink className="inline-flex min-h-12 min-w-12 items-center justify-center text-[#D4AF37] hover:text-[#B8941F]" asChild>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator className="text-[#D4AF37]/50" />
					<BreadcrumbItem>
						<BreadcrumbPage className="text-[#212529]">{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
				<div className="lg:col-span-5 lg:col-start-8">
					<div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
						<div className="space-y-3">
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-wide text-[#212529]">
								{product.name}
							</h1>
							<div className="w-12 sm:w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
						</div>

						<p className="text-2xl sm:text-3xl font-semibold vero-text-gradient">
							{formatMoney({
								amount: product.price,
								currency: product.currency,
								locale,
							})}
						</p>

						{(product.stock || 0) <= 0 && (
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-600 text-sm uppercase tracking-wider">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								Out of Stock
							</div>
						)}

						<section className="pt-6 border-t border-[#D4AF37]/20">
							<h2 className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] mb-4">Description</h2>
							<div className="prose prose-sm max-w-none text-[#6C757D]">
								<Markdown source={product.summary || ""} />
							</div>
						</section>

						<AddToCart
							variantId={ynsProduct.variants[0]?.id || product.id}
							className={(product.stock || 0) <= 0 ? "vero-button opacity-50 cursor-not-allowed w-full py-4" : "vero-button w-full py-4"}
						>
							{(product.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
						</AddToCart>
					</div>
				</div>

				<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
					<h2 className="sr-only">{t("imagesTitle")}</h2>

					<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
						{images.map((image, idx) => {
							const params = new URLSearchParams({
								image: idx.toString(),
							});
							return (
								<YnsLink key={idx} href={`?${params}`} scroll={false} className="group block">
									{idx === 0 ? (
										<div className="vero-card rounded-lg overflow-hidden border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-500">
											<MainProductImage
												key={image}
												className="w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
												src={image}
												loading="eager"
												priority
												alt={product.name}
											/>
										</div>
									) : (
										<div className="vero-card rounded-lg overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300">
											<Image
												key={image}
												className="w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
												src={image}
												width={700 / 3}
												height={700 / 3}
												sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
												loading="eager"
												priority
												alt={`${product.name} - Image ${idx + 1}`}
											/>
										</div>
									)}
								</YnsLink>
							);
						})}
					</div>
				</div>
			</div>

			<Suspense>
				<SimilarProducts id={product.id} />
			</Suspense>

			<Suspense>
				<ProductImageModal images={images} />
			</Suspense>

			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	// TODO: Implement similar products functionality
	return null;
}
