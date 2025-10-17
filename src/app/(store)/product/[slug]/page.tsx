// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";
import {
	Award,
	Box,
	Check,
	CheckCircle2,
	Clock,
	Image as ImageIcon,
	Package,
	Shield,
	Sparkles,
	Star,
	Truck,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import { Separator } from "@/ui/shadcn/separator";
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
		<article className="pb-16 bg-gradient-to-b from-white via-gray-50/30 to-white">
			<div className="bg-white border-b border-gray-200 shadow-sm mb-8">
				<Breadcrumb className="max-w-7xl mx-auto py-4">
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
								<BreadcrumbSeparator className="text-gray-400" />
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
						<BreadcrumbSeparator className="text-gray-400" />
						<BreadcrumbItem>
							<BreadcrumbPage className="text-gray-900">{product.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="mt-6 sm:mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-7xl mx-auto px-4">
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
									<Card
										className={`overflow-hidden ${idx === 0 ? "border-2 border-black/20 shadow-lg" : "border-2 border-gray-200"} hover:border-black/40 hover:shadow-xl transition-all duration-500 aspect-[4/3] relative bg-white`}
									>
										{isPlaceholder ? (
											<div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
												<div className="text-center space-y-3">
													<ImageIcon className="w-16 h-16 text-gray-300 mx-auto" strokeWidth={1.5} />
													<p className="text-sm text-gray-500 font-medium">Image Coming Soon</p>
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
											<div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
												<Sparkles className="w-3 h-3" />
												Main Image
											</div>
										)}
									</Card>
								</YnsLink>
							);
						})}
					</div>
				</div>

				{/* Product Info - Right Side */}
				<div>
					<div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
						<Card className="border-2 border-black/10 shadow-lg bg-white">
							<CardContent className="p-6 space-y-4">
								<div className="space-y-3">
									<h1 className="text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-wide text-gray-900">
										{product.name}
									</h1>
									<Separator className="bg-gradient-to-r from-black via-gray-300 to-transparent" />
								</div>

								<div className="flex items-baseline gap-2">
									<p className="text-3xl sm:text-4xl font-bold text-[#D4AF37]">
										{formatMoney({
											amount: product.price * 100,
											currency: product.currency,
											locale,
										})}
									</p>
									<Badge variant="outline" className="border-green-600/30 text-green-700 font-semibold">
										<CheckCircle2 className="w-3 h-3 mr-1" />
										In Stock
									</Badge>
								</div>

								{/* Product Status Badge */}
								{product.metadata?.preorder === "true" && (
									<Alert className="bg-yellow-500/10 border-yellow-500/30">
										<Clock className="h-4 w-4 text-yellow-600" />
										<AlertDescription className="text-yellow-700 font-medium">
											Pre-Order Item - Expected {product.metadata?.releaseDate || "Soon"}
										</AlertDescription>
									</Alert>
								)}
							</CardContent>
						</Card>

						{/* Key Features Section */}
						<Card className="border-2 border-black/10 shadow-md bg-gradient-to-br from-gray-50 to-white">
							<CardHeader className="border-b border-black/5 pb-4">
								<CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
									<Sparkles className="w-5 h-5 text-[#D4AF37]" />
									Key Features
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2 p-3 bg-white rounded-lg border border-black/5">
										<p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Scale</p>
										<p className="text-sm font-bold text-gray-900">1:18</p>
									</div>
									<div className="space-y-2 p-3 bg-white rounded-lg border border-black/5">
										<p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Material</p>
										<p className="text-sm font-bold text-gray-900">Die-Cast Metal</p>
									</div>
									<div className="space-y-2 p-3 bg-white rounded-lg border border-black/5">
										<p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Brand</p>
										<Badge variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] font-bold">
											<Award className="w-3 h-3 mr-1" />
											{product.metadata?.brand || "Premium"}
										</Badge>
									</div>
									<div className="space-y-2 p-3 bg-white rounded-lg border border-black/5">
										<p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Condition</p>
										<Badge className="bg-green-500/10 text-green-700 border-0 font-bold">
											<Star className="w-3 h-3 mr-1" />
											Brand New
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Product Details Tabs */}
						<Card className="border-2 border-black/10 shadow-md">
							<Tabs defaultValue="description" className="w-full">
								<TabsList className="grid w-full grid-cols-4 bg-gray-100 border-b-2 border-black/10">
									<TabsTrigger
										value="description"
										className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D4AF37] data-[state=active]:font-semibold"
									>
										Description
									</TabsTrigger>
									<TabsTrigger
										value="specifications"
										className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D4AF37] data-[state=active]:font-semibold"
									>
										Specs
									</TabsTrigger>
									<TabsTrigger
										value="details"
										className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D4AF37] data-[state=active]:font-semibold"
									>
										Features
									</TabsTrigger>
									<TabsTrigger
										value="shipping"
										className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D4AF37] data-[state=active]:font-semibold"
									>
										Shipping
									</TabsTrigger>
								</TabsList>

								<TabsContent value="description" className="p-6">
									<div className="prose prose-sm max-w-none text-gray-700">
										<Markdown source={product.description || product.name} />
									</div>
								</TabsContent>

								<TabsContent value="specifications" className="p-6">
									<div className="space-y-0 border-2 border-black/5 rounded-lg overflow-hidden">
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-gray-50">
											<span className="text-gray-600 font-medium">Scale</span>
											<span className="text-gray-900 font-bold">1:18</span>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-white">
											<span className="text-gray-600 font-medium">Manufacturer</span>
											<Badge variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] font-bold">
												<Award className="w-3 h-3 mr-1" />
												{product.metadata?.brand || "Premium Brand"}
											</Badge>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-gray-50">
											<span className="text-gray-600 font-medium">Material</span>
											<span className="text-gray-900 font-bold">Die-Cast Metal</span>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-white">
											<span className="text-gray-600 font-medium">Opening Parts</span>
											<span className="text-gray-900 font-bold">Doors, Hood, Trunk</span>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-gray-50">
											<span className="text-gray-600 font-medium">Interior Detail</span>
											<span className="text-gray-900 font-bold">Fully Detailed</span>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-white">
											<span className="text-gray-600 font-medium">Wheels</span>
											<span className="text-gray-900 font-bold">Steerable</span>
										</div>
										<div className="flex justify-between items-center py-4 px-5 border-b-2 border-black/5 bg-gray-50">
											<span className="text-gray-600 font-medium">Condition</span>
											<Badge className="bg-green-500/10 text-green-700 border border-green-500/20 font-bold">
												<Star className="w-3 h-3 mr-1" />
												Brand New in Box
											</Badge>
										</div>
										{product.metadata?.category && (
											<div className="flex justify-between items-center py-4 px-5 bg-white">
												<span className="text-gray-600 font-medium">Category</span>
												<span className="text-gray-900 uppercase tracking-wide text-xs font-bold">
													{product.metadata.category}
												</span>
											</div>
										)}
									</div>
								</TabsContent>

								<TabsContent value="details" className="p-6">
									<div className="space-y-4">
										<Card className="border-2 border-black/5 bg-gradient-to-br from-gray-50 to-white">
											<CardHeader className="border-b-2 border-black/5 pb-4">
												<CardTitle className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
													<Shield className="w-4 h-4 text-[#D4AF37]" />
													Authenticity & Quality
												</CardTitle>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="space-y-3 text-sm">
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Officially Licensed:</span> Authentic
															collectible with manufacturer approval
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Premium Construction:</span>{" "}
															High-grade die-cast metal with precision engineering
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Quality Control:</span> Inspected and
															verified before shipment
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										<Card className="border-2 border-black/5 bg-gradient-to-br from-white to-gray-50">
											<CardHeader className="border-b-2 border-black/5 pb-4">
												<CardTitle className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
													<Sparkles className="w-4 h-4 text-[#D4AF37]" />
													Detail & Craftsmanship
												</CardTitle>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="space-y-3 text-sm">
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Interior:</span> Fully detailed
															dashboard, seats, and trim
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Exterior:</span> Accurate paint finish
															with precise decals
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Engine:</span> Detailed engine bay
															(where applicable)
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Display Ready:</span> Comes with
															presentation base/case
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										<Card className="border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/5 to-white">
											<CardHeader className="border-b-2 border-[#D4AF37]/20 pb-4">
												<CardTitle className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
													<Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
													Collector's Note
												</CardTitle>
											</CardHeader>
											<CardContent className="pt-4">
												<p className="text-sm text-gray-600 leading-relaxed">
													This model is a limited production piece perfect for serious collectors and
													automotive enthusiasts. Each unit represents the pinnacle of scale model
													craftsmanship with attention to every detail.
												</p>
											</CardContent>
										</Card>
									</div>
								</TabsContent>

								<TabsContent value="shipping" className="p-6">
									<div className="space-y-4">
										<Card className="border-2 border-black/5 bg-gradient-to-br from-gray-50 to-white">
											<CardHeader className="border-b-2 border-black/5 pb-4">
												<CardTitle className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
													<Package className="w-4 h-4 text-[#D4AF37]" />
													Shipping Information
												</CardTitle>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="space-y-0 border-2 border-black/5 rounded-lg overflow-hidden">
													<div className="flex justify-between items-center py-3 px-4 border-b-2 border-black/5 bg-white">
														<span className="text-gray-600 font-medium flex items-center gap-2">
															<Clock className="w-4 h-4" />
															Processing Time
														</span>
														<span className="text-gray-900 font-bold">1-2 Business Days</span>
													</div>
													<div className="flex justify-between items-center py-3 px-4 border-b-2 border-black/5 bg-gray-50">
														<span className="text-gray-600 font-medium flex items-center gap-2">
															<Truck className="w-4 h-4" />
															Standard Shipping
														</span>
														<span className="text-gray-900 font-bold">3-5 Business Days</span>
													</div>
													<div className="flex justify-between items-center py-3 px-4 border-b-2 border-black/5 bg-white">
														<span className="text-gray-600 font-medium flex items-center gap-2">
															<Truck className="w-4 h-4" />
															Express Shipping
														</span>
														<span className="text-gray-900 font-bold">1-2 Business Days</span>
													</div>
													<div className="flex justify-between items-center py-3 px-4 bg-gray-50">
														<span className="text-gray-600 font-medium flex items-center gap-2">
															<Truck className="w-4 h-4" />
															International
														</span>
														<span className="text-gray-900 font-bold">7-14 Business Days</span>
													</div>
												</div>
											</CardContent>
										</Card>

										<Card className="border-2 border-black/5 bg-gradient-to-br from-white to-gray-50">
											<CardHeader className="border-b-2 border-black/5 pb-4">
												<CardTitle className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
													<Shield className="w-4 h-4 text-[#D4AF37]" />
													Packaging & Protection
												</CardTitle>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="space-y-3 text-sm">
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Secure Packaging:</span> Double-boxed
															with protective foam
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Insured Shipping:</span> All items
															fully insured during transit
														</p>
													</div>
													<div className="flex items-start gap-3">
														<Check className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" strokeWidth={3} />
														<p className="text-gray-600">
															<span className="font-bold text-gray-900">Tracking Included:</span> Track your
															order every step of the way
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										<Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-white">
											<CardContent className="p-5">
												<div className="flex items-start gap-3">
													<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
													<div>
														<p className="text-sm font-bold text-green-900 mb-1">Free Shipping Available</p>
														<p className="text-sm text-green-700">
															Orders over €150 qualify for free standard shipping within the EU
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</TabsContent>
							</Tabs>
						</Card>

						<Card className="border-2 border-black/10 shadow-lg bg-white">
							<CardContent className="p-6">
								<div className="flex gap-3">
									<AddToCart
										variantId={product.id}
										className="vero-button flex-1 py-4 text-base font-semibold"
									>
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
										className="py-4 border-2 border-black/10"
									/>
								</div>
							</CardContent>
						</Card>
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
