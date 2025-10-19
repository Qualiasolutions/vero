import { Award, Eye, Package, Shield, ShoppingCart, Sparkles, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteHeartIcon } from "@/components/favorite-heart-icon";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { HeroSection } from "@/ui/home/hero-section";
import { ImageSlideshow } from "@/ui/home/image-slideshow";
import { ParallaxSection } from "@/ui/home/parallax-section";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description:
		"Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch all products once
	const allProductsResult = await getProducts(100);
	const allProducts = allProductsResult.data || [];

	// Distribute products across categories (3 per category)
	const categoryProducts = StoreConfig.categories.map((category, index) => {
		// First, try to get products with matching category metadata
		let categoryProds = allProducts.filter(
			(p) => p.metadata.category?.toLowerCase() === category.slug.toLowerCase(),
		);

		// If no products with category metadata, use fallback logic
		if (categoryProds.length === 0) {
			const startIndex = index * 3;
			categoryProds = allProducts.slice(startIndex, startIndex + 3);
		} else {
			// Limit to 3 products
			categoryProds = categoryProds.slice(0, 3);
		}

		return {
			category,
			products: categoryProds,
		};
	});

	return (
		<main className="min-h-screen bg-white">
			{/* Announcement Banner */}
			<section className="relative bg-gradient-to-r from-[#D4AF37] via-[#E6C757] to-[#D4AF37] text-white py-2.5">
				<div className="w-full px-6 lg:px-12">
					<div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
						<Sparkles className="w-4 h-4 animate-pulse" />
						<span>NEW ARRIVALS WEEKLY • FREE SHIPPING AED 550+ • EXCLUSIVE COLLECTIBLES</span>
						<Sparkles className="w-4 h-4 animate-pulse" />
					</div>
				</div>
			</section>

			{/* Hero Section */}
			<HeroSection />

			{/* Feature Bar */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-6 bg-white border-y border-[#D4AF37]/20">
				<div className="w-full">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#D4AF37]/10 to-white rounded-lg border border-[#D4AF37]/20">
							<Shield className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
							<div>
								<p className="text-xs font-bold text-[#212529]">AUTHENTIC</p>
								<p className="text-[10px] text-[#6C757D]">Officially Licensed</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#E6C757]/10 to-white rounded-lg border border-[#D4AF37]/20">
							<Package className="w-8 h-8 text-[#B8941F] flex-shrink-0" />
							<div>
								<p className="text-xs font-bold text-[#212529]">FREE SHIPPING</p>
								<p className="text-[10px] text-[#6C757D]">Orders Over AED 550</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#F5E6D3]/50 to-white rounded-lg border border-[#D4AF37]/20">
							<Award className="w-8 h-8 text-[#D4AF37] flex-shrink-0" />
							<div>
								<p className="text-xs font-bold text-[#212529]">PREMIUM</p>
								<p className="text-[10px] text-[#6C757D]">1:18 Scale Quality</p>
							</div>
						</div>
						<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#1A1A1A]/5 to-white rounded-lg border border-[#D4AF37]/20">
							<TrendingUp className="w-8 h-8 text-[#B8941F] flex-shrink-0" />
							<div>
								<p className="text-xs font-bold text-[#212529]">LIMITED</p>
								<p className="text-[10px] text-[#6C757D]">Exclusive Releases</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Special Offers Banner - Vero Gold */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-3 bg-gradient-to-r from-[#B8941F] via-[#D4AF37] to-[#B8941F]">
				<div className="w-full">
					<div className="flex items-center justify-center gap-2 text-white">
						<Zap className="w-5 h-5 animate-pulse" />
						<p className="text-sm md:text-base font-bold uppercase tracking-wide">
							✨ Special Offers: Up to 30% Off Selected Items - Limited Time!
						</p>
						<Zap className="w-5 h-5 animate-pulse" />
					</div>
				</div>
			</section>

			{/* Category Columns with Products - 6 Columns in Single Row */}
			<section
				id="categories"
				className="w-full px-6 lg:px-12 xl:px-16 py-12 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white"
			>
				<div className="w-full">
					{/* Section Header */}
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-light text-[#212529] uppercase tracking-wider mb-3">
							Shop By Category
						</h2>
						<p className="text-[#6C757D] text-lg max-w-2xl mx-auto">
							Explore our curated collection of premium 1:18 scale die-cast models
						</p>
					</div>
					{/* Grid of 6 columns (1 on mobile, 3 on tablet, 6 on desktop) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{categoryProducts.map(({ category, products }) => {
							// Map badge color to subtle background tint matching the premium darker badges
							const getBgTint = (badgeColor: string) => {
								// Extract the first class from badgeColor for matching
								const firstClass = badgeColor.split(" ")[0] || "";
								const colorMap: Record<string, string> = {
									"bg-emerald-600": "bg-emerald-50 border-emerald-300", // NEW
									"bg-rose-600": "bg-rose-50 border-rose-300", // SALE
									"bg-violet-600": "bg-violet-50 border-violet-300", // LIMITED
									"bg-orange-600": "bg-orange-50 border-orange-300", // RARE
									"bg-sky-600": "bg-sky-50 border-sky-300", // PRE-ORDER
									"bg-slate-700": "bg-slate-50 border-slate-300", // SOON
								};
								return colorMap[firstClass] || "bg-gray-50 border-gray-200";
							};

							return (
								<div
									key={category.slug}
									className={`flex flex-col space-y-3 p-3 rounded-xl border ${getBgTint(category.badgeColor)} transition-all duration-300 hover:shadow-lg`}
								>
									{/* Category Badge on Top - Wider and Professional */}
									<div className="relative">
										<Badge
											className={`${category.badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-t-lg absolute -top-3 left-1/2 -translate-x-1/2 z-10 shadow-lg w-[85%] justify-center`}
										>
											{category.badge}
										</Badge>
									</div>

									{/* Category Header */}
									<Link
										href={`/category/${category.slug}`}
										className="group relative overflow-hidden rounded-lg aspect-[4/3] hover:scale-[1.02] transition-all duration-300 mt-2"
									>
										<div className="relative w-full h-full">
											<Image
												src={category.image}
												alt={category.name}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-110"
												sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
											/>
										</div>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5">
											<h2 className="text-white font-bold text-sm uppercase tracking-wide text-center">
												{category.name}
											</h2>
										</div>
									</Link>

									{/* 3 Products under this category */}
									<div className="space-y-2.5">
										{products.slice(0, 3).map((product) => (
											<div
												key={product.id}
												className="group bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
											>
												{/* Product Image */}
												<Link href={`/product/${product.slug || product.id}`} className="block">
													<div className="relative aspect-square w-full bg-white">
														{product.images && product.images.length > 0 && product.images[0] ? (
															<Image
																src={product.images[0]}
																alt={product.name}
																fill
																className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
																sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center text-[#6C757D] text-xs">
																No Image
															</div>
														)}
														<FavoriteHeartIcon product={product} />
													</div>
												</Link>

												{/* Product Info - Compact */}
												<div className="p-2 bg-white space-y-1.5">
													<Link href={`/product/${product.slug || product.id}`}>
														<h3 className="text-xs text-black font-semibold line-clamp-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
															{product.name}
														</h3>
													</Link>
													<p className="text-sm font-bold text-[#D4AF37]">
														€{(product.price / 100).toFixed(2)}
													</p>
													<div className="flex gap-1">
														<AddToCart
															variantId={product.id}
															className="flex-1 !py-1.5 !px-2 text-[10px] !rounded-sm"
														>
															<ShoppingCart className="h-3 w-3" />
															ADD
														</AddToCart>
														<Link
															href={`/product/${product.slug || product.id}`}
															className="flex-1 flex items-center justify-center gap-1 bg-[#212529] hover:bg-[#1A1A1A] text-white py-1.5 px-2 text-[10px] font-semibold rounded-sm uppercase tracking-wide transition-colors"
														>
															<Eye className="h-3 w-3" />
															DETAILS
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* View All Link */}
									{products.length > 0 && (
										<Link
											href={`/category/${category.slug}`}
											className="text-[11px] text-[#D4AF37] hover:text-[#B8941F] font-semibold tracking-wide transition-all duration-300 text-center py-1.5 hover:underline uppercase"
										>
											View All →
										</Link>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Image Slideshow */}
			<ImageSlideshow />

			{/* Why Choose Us Section */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-[#FDFBF7] to-white border-y border-[#D4AF37]/20">
				<div className="w-full">
					{/* Section Header */}
					<div className="text-center mb-12">
						<h3 className="text-3xl md:text-4xl font-light text-[#212529] uppercase tracking-wider mb-3">
							Why Collectors Choose Veromodels
						</h3>
						<p className="text-[#6C757D] text-lg max-w-2xl mx-auto">
							Premium quality, authenticity, and exceptional service for every collector
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="group text-center p-8 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
							<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
								<Award className="w-10 h-10 text-[#D4AF37]" />
							</div>
							<h4 className="text-xl font-semibold text-[#212529] mb-3">Authenticity Guaranteed</h4>
							<p className="text-[#6C757D] leading-relaxed">
								Every model is officially licensed and comes with certificates of authenticity from verified
								manufacturers
							</p>
						</div>

						<div className="group text-center p-8 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
							<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
								<Package className="w-10 h-10 text-[#D4AF37]" />
							</div>
							<h4 className="text-xl font-semibold text-[#212529] mb-3">Secure Packaging</h4>
							<p className="text-[#6C757D] leading-relaxed">
								Double-boxed with protective foam to ensure safe delivery of your precious collectible items
							</p>
						</div>

						<div className="group text-center p-8 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
							<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
								<Shield className="w-10 h-10 text-[#D4AF37]" />
							</div>
							<h4 className="text-xl font-semibold text-[#212529] mb-3">Quality Assurance</h4>
							<p className="text-[#6C757D] leading-relaxed">
								Inspected and verified before shipment with premium 1:18 scale craftsmanship and attention to
								detail
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Brand Showcase - Animated Marquee */}
			<section className="relative border-t border-[#D4AF37]/20 py-12 overflow-hidden bg-white">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="https://i.ibb.co/8D9g5bJm/Untitled-design-1.png"
						alt="Background"
						fill
						className="object-cover opacity-10"
						sizes="100vw"
					/>
				</div>
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#F8F9FA]/95 to-white/95 z-0" />

				<div className="relative z-10 w-full px-6 lg:px-12 xl:px-16">
					<h3 className="text-center text-lg md:text-xl font-light vero-text-gradient uppercase tracking-widest mb-8">
						Premium Brands We Carry
					</h3>
					<Marquee className="py-4">
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent speed={40}>
							{StoreConfig.brands.map((brand, idx) => (
								<MarqueeItem key={`${brand}-${idx}`} className="mx-12 flex items-center justify-center">
									<div className="text-lg md:text-xl font-light text-[#6C757D] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
										{brand}
									</div>
								</MarqueeItem>
							))}
						</MarqueeContent>
					</Marquee>
				</div>
			</section>

			{/* Parallax Section */}
			<ParallaxSection />

			{/* Newsletter CTA */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-8 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#D4AF37]/20 border-t border-[#D4AF37]/20">
				<div className="w-full text-center">
					<h3 className="text-xl md:text-2xl font-bold text-[#212529] mb-2">
						Get Exclusive Updates & Early Access
					</h3>
					<p className="text-sm text-[#6C757D] mb-4">
						Subscribe to our newsletter for new releases, special offers, and collector tips
					</p>
					<Link
						href="/newsletter"
						className="inline-block vero-button px-8 py-3 text-sm font-semibold uppercase tracking-wide"
					>
						Subscribe Now
					</Link>
				</div>
			</section>
		</main>
	);
}
