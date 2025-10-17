// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteButton } from "@/components/favorite-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publicUrl } from "@/env.mjs";
import { getLocale, getTranslations } from "@/i18n/server";
import { getProductBySlug } from "@/lib/product-service";
import { deslugify, formatMoney } from "@/lib/utils";
import { JsonLd } from "@/ui/json-ld";
import { Markdown } from "@/ui/markdown";
import { MainProductImage } from "@/ui/products/main-product-image";
import { YnsLink } from "@/ui/yns-link";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const product = await getProductBySlug(params.slug);

	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${params.slug}`);

	return {
		title: t("title", { productName: product.name }),
		description: product.description || product.name,
		alternates: { canonical },
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; image?: string }>;
}) {
	const params = await props.params;

	const product = await getProductBySlug(params.slug);

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.metadata?.category;
	const images = product.images;

	// Generate placeholder images if there are less than 4 images
	const displayImages = [...images];
	const placeholderImage = "/placeholder-car.jpg";
	while (displayImages.length < 4) {
		displayImages.push(placeholderImage);
	}

	return (
		<article className="pb-16">
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							asChild
							className="inline-flex min-h-12 min-w-12 items-center justify-center text-[#D4AF37] hover:text-[#B8941F]"
						>
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator className="text-[#D4AF37]/50" />
							<BreadcrumbItem>
								<BreadcrumbLink
									className="inline-flex min-h-12 min-w-12 items-center justify-center text-[#D4AF37] hover:text-[#B8941F]"
									asChild
								>
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

			<div className="mt-6 sm:mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-7xl mx-auto">
				{/* Image Gallery - Left Side */}
				<div className="space-y-4">
					<h2 className="sr-only">{t("imagesTitle")}</h2>

					{/* Stacked Vertical Image Gallery */}
					<div className="space-y-4">
						{displayImages.map((image, idx) => {
							const params = new URLSearchParams({
								image: idx.toString(),
							});
							const isPlaceholder = image === placeholderImage;
							return (
								<YnsLink
									key={`${image}-${idx}`}
									href={isPlaceholder ? "#" : `?${params}`}
									scroll={false}
									className={`group block ${isPlaceholder ? "pointer-events-none" : ""}`}
								>
									<div
										className={`vero-card rounded-xl overflow-hidden ${idx === 0 ? "border-2 border-[#D4AF37]/30" : "border border-[#D4AF37]/20"} hover:border-[#D4AF37]/50 transition-all duration-500 aspect-[4/3] relative`}
									>
										{isPlaceholder ? (
											<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
												<div className="text-center space-y-2">
													<div className="text-4xl text-gray-300">📷</div>
													<p className="text-sm text-gray-400 font-medium">Image Coming Soon</p>
												</div>
											</div>
										) : idx === 0 ? (
											<MainProductImage
												className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
												src={image}
												loading="eager"
												priority
												alt={product.name}
											/>
										) : (
											<Image
												className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
												src={image}
												fill
												sizes="(max-width: 1024px) 100vw, 50vw"
												loading="eager"
												priority
												alt={`${product.name} - Image ${idx + 1}`}
											/>
										)}
										{idx === 0 && (
											<div className="absolute top-4 left-4 bg-[#D4AF37] text-white px-3 py-1 rounded-md text-xs font-semibold">
												Main Image
											</div>
										)}
									</div>
								</YnsLink>
							);
						})}
					</div>
				</div>

				{/* Product Info - Right Side */}
				<div>
					<div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
						<div className="space-y-3">
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-wide text-[#212529]">
								{product.name}
							</h1>
							<div className="w-12 sm:w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
						</div>

						<p className="text-2xl sm:text-3xl font-semibold vero-text-gradient">
							{formatMoney({
								amount: product.price * 100,
								currency: product.currency,
								locale,
							})}
						</p>

						{/* Product Status Badge */}
						{product.metadata?.preorder === "true" && (
							<Alert className="bg-yellow-500/10 border-yellow-500/30">
								<AlertDescription className="text-yellow-600 font-medium">
									⏰ Pre-Order Item - Expected {product.metadata?.releaseDate || "Soon"}
								</AlertDescription>
							</Alert>
						)}

						{/* Key Features Section */}
						<div className="bg-gradient-to-br from-[#FDFBF7] to-white rounded-xl p-6 border border-[#D4AF37]/20">
							<h3 className="text-lg font-semibold text-[#212529] mb-4 flex items-center gap-2">
								<span className="text-[#D4AF37]">✦</span>
								Key Features
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<p className="text-xs text-[#6C757D] uppercase tracking-wide">Scale</p>
									<p className="text-sm font-semibold text-[#212529]">1:18</p>
								</div>
								<div className="space-y-1">
									<p className="text-xs text-[#6C757D] uppercase tracking-wide">Material</p>
									<p className="text-sm font-semibold text-[#212529]">Die-Cast Metal</p>
								</div>
								<div className="space-y-1">
									<p className="text-xs text-[#6C757D] uppercase tracking-wide">Brand</p>
									<Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] font-semibold">
										{product.metadata?.brand || "Premium Brand"}
									</Badge>
								</div>
								<div className="space-y-1">
									<p className="text-xs text-[#6C757D] uppercase tracking-wide">Condition</p>
									<Badge className="bg-green-500/10 text-green-700 border-0 font-semibold">Brand New</Badge>
								</div>
							</div>
						</div>

						{/* Product Details Tabs */}
						<Tabs defaultValue="description" className="w-full">
							<TabsList className="grid w-full grid-cols-4 bg-[#F8F9FA]">
								<TabsTrigger
									value="description"
									className="data-[state=active]:bg-white data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
								>
									Description
								</TabsTrigger>
								<TabsTrigger
									value="specifications"
									className="data-[state=active]:bg-white data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
								>
									Specs
								</TabsTrigger>
								<TabsTrigger
									value="details"
									className="data-[state=active]:bg-white data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
								>
									Features
								</TabsTrigger>
								<TabsTrigger
									value="shipping"
									className="data-[state=active]:bg-white data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
								>
									Shipping
								</TabsTrigger>
							</TabsList>

							<TabsContent value="description" className="space-y-4 pt-4">
								<div className="prose prose-sm max-w-none text-[#6C757D]">
									<Markdown source={product.description || product.name} />
								</div>
							</TabsContent>

							<TabsContent value="specifications" className="space-y-4 pt-4">
								<div className="bg-white rounded-lg border border-[#D4AF37]/10 overflow-hidden">
									<div className="grid gap-0 text-sm">
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10 bg-[#FDFBF7]/50">
											<span className="text-[#6C757D] font-medium">Scale</span>
											<span className="text-[#212529] font-semibold">1:18</span>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10">
											<span className="text-[#6C757D] font-medium">Manufacturer</span>
											<Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] font-semibold">
												{product.metadata?.brand || "Premium Brand"}
											</Badge>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10 bg-[#FDFBF7]/50">
											<span className="text-[#6C757D] font-medium">Material</span>
											<span className="text-[#212529] font-semibold">Die-Cast Metal</span>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10">
											<span className="text-[#6C757D] font-medium">Opening Parts</span>
											<span className="text-[#212529] font-semibold">Doors, Hood, Trunk</span>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10 bg-[#FDFBF7]/50">
											<span className="text-[#6C757D] font-medium">Interior Detail</span>
											<span className="text-[#212529] font-semibold">Fully Detailed</span>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10">
											<span className="text-[#6C757D] font-medium">Wheels</span>
											<span className="text-[#212529] font-semibold">Steerable</span>
										</div>
										<div className="flex justify-between py-3 px-4 border-b border-[#D4AF37]/10 bg-[#FDFBF7]/50">
											<span className="text-[#6C757D] font-medium">Condition</span>
											<Badge className="bg-green-500/10 text-green-700 border-0 font-semibold">
												Brand New in Box
											</Badge>
										</div>
										{product.metadata?.category && (
											<div className="flex justify-between py-3 px-4 bg-[#FDFBF7]/50">
												<span className="text-[#6C757D] font-medium">Category</span>
												<span className="text-[#212529] uppercase tracking-wide text-xs font-semibold">
													{product.metadata.category}
												</span>
											</div>
										)}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="details" className="space-y-4 pt-4">
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-[#FDFBF7] to-white rounded-lg p-5 border border-[#D4AF37]/20">
										<h4 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide">
											Authenticity & Quality
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Officially Licensed:</span> Authentic
													collectible with manufacturer approval
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Premium Construction:</span>{" "}
													High-grade die-cast metal with precision engineering
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Quality Control:</span> Inspected and
													verified before shipment
												</p>
											</div>
										</div>
									</div>

									<div className="bg-gradient-to-r from-white to-[#FDFBF7] rounded-lg p-5 border border-[#D4AF37]/20">
										<h4 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide">
											Detail & Craftsmanship
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Interior:</span> Fully detailed
													dashboard, seats, and trim
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Exterior:</span> Accurate paint
													finish with precise decals
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Engine:</span> Detailed engine bay
													(where applicable)
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Display Ready:</span> Comes with
													presentation base/case
												</p>
											</div>
										</div>
									</div>

									<div className="bg-[#D4AF37]/5 rounded-lg p-5 border border-[#D4AF37]/30">
										<h4 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide flex items-center gap-2">
											<span className="text-[#D4AF37]">★</span>
											Collector's Note
										</h4>
										<p className="text-sm text-[#6C757D] leading-relaxed">
											This model is a limited production piece perfect for serious collectors and automotive
											enthusiasts. Each unit represents the pinnacle of scale model craftsmanship with
											attention to every detail.
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="shipping" className="space-y-4 pt-4">
								<div className="space-y-4">
									<div className="bg-gradient-to-br from-[#FDFBF7] to-white rounded-lg p-5 border border-[#D4AF37]/20">
										<h4 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide flex items-center gap-2">
											<span className="text-[#D4AF37]">📦</span>
											Shipping Information
										</h4>
										<div className="space-y-3 text-sm">
											<div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
												<span className="text-[#6C757D] font-medium">Processing Time</span>
												<span className="text-[#212529] font-semibold">1-2 Business Days</span>
											</div>
											<div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
												<span className="text-[#6C757D] font-medium">Standard Shipping</span>
												<span className="text-[#212529] font-semibold">3-5 Business Days</span>
											</div>
											<div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
												<span className="text-[#6C757D] font-medium">Express Shipping</span>
												<span className="text-[#212529] font-semibold">1-2 Business Days</span>
											</div>
											<div className="flex justify-between py-2">
												<span className="text-[#6C757D] font-medium">International</span>
												<span className="text-[#212529] font-semibold">7-14 Business Days</span>
											</div>
										</div>
									</div>

									<div className="bg-gradient-to-r from-white to-[#FDFBF7] rounded-lg p-5 border border-[#D4AF37]/20">
										<h4 className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide flex items-center gap-2">
											<span className="text-[#D4AF37]">🛡️</span>
											Packaging & Protection
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Secure Packaging:</span> Double-boxed
													with protective foam
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Insured Shipping:</span> All items
													fully insured during transit
												</p>
											</div>
											<div className="flex items-start gap-3">
												<span className="text-[#D4AF37] mt-0.5 text-lg">✓</span>
												<p className="text-[#6C757D]">
													<span className="font-semibold text-[#212529]">Tracking Included:</span> Track your
													order every step of the way
												</p>
											</div>
										</div>
									</div>

									<div className="bg-green-50 rounded-lg p-4 border border-green-200">
										<div className="flex items-start gap-3">
											<span className="text-green-600 text-xl">✓</span>
											<div>
												<p className="text-sm font-semibold text-green-900 mb-1">Free Shipping Available</p>
												<p className="text-sm text-green-700">
													Orders over €150 qualify for free standard shipping within the EU
												</p>
											</div>
										</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<div className="flex gap-3">
							<AddToCart variantId={product.id} className="vero-button flex-1 py-4">
								Add to Cart
							</AddToCart>
							<FavoriteButton
								product={{
									id: product.id,
									name: product.name,
									slug: product.slug,
									price: product.price,
									images: product.images,
									metadata: product.metadata,
								}}
								className="py-4"
							/>
						</div>
					</div>
				</div>
			</div>

			<Suspense>
				<SimilarProducts id={product.id} />
			</Suspense>

			<Suspense>
				<ProductImageModal images={images} />
			</Suspense>

			<JsonLd
				jsonLd={{
					"@context": "https://schema.org",
					"@type": "Product",
					name: product.name,
					description: product.description || product.name,
					image: images,
					offers: {
						"@type": "Offer",
						price: product.price,
						priceCurrency: product.currency.toUpperCase(),
						availability: "https://schema.org/InStock",
					},
				}}
			/>
		</article>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	// TODO: Implement similar products functionality
	return null;
}
