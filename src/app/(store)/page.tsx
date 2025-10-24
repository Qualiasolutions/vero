import { Award, Eye, Package, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteHeartIcon } from "@/components/favorite-heart-icon";
import { publicUrl } from "@/env.mjs";
import { getPremiumPlaceholder, getProductImage } from "@/lib/product-image-mapping";
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
		<div className="bg-[var(--selfridges-background)] relative overflow-hidden">
			{/* Parallax Background */}
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-b from-[var(--selfridges-background)] via-[var(--selfridges-bg-secondary)] to-[var(--selfridges-bg-tertiary)]"></div>
				<div className="parallax-bg absolute inset-0 opacity-5">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"></div>
				</div>
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Announcement Banner */}
				<section className="relative bg-[var(--selfridges-gray-light)] text-[var(--selfridges-text-primary)] py-2 border-b border-[var(--selfridges-border-light)]">
					<div className="w-full px-6 lg:px-12">
						<div className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
							<Sparkles className="w-4 h-4 animate-pulse" />
							<span>NEW ARRIVALS WEEKLY • FREE SHIPPING AED 550+ • EXCLUSIVE COLLECTIBLES</span>
							<Sparkles className="w-4 h-4 animate-pulse" />
						</div>
					</div>
				</section>

				{/* Hero Section */}
				<HeroSection />

				{/* Feature Bar */}
				<section className="w-full px-6 lg:px-12 xl:px-16 py-6 bg-[var(--selfridges-bg-secondary)] border-y border-[var(--vero-gold-accent)]/20">
					<div className="w-full">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--selfridges-background)] rounded-lg border border-[var(--vero-gold-accent)]/20">
								<Shield className="w-8 h-8 text-[var(--vero-gold-accent)] flex-shrink-0" />
								<div>
									<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">AUTHENTIC</p>
									<p className="text-[10px] text-[var(--selfridges-text-muted)]">Officially Licensed</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[var(--vero-gold-accent-light)]/10 to-[var(--selfridges-background)] rounded-lg border border-[var(--vero-gold-accent)]/20">
								<Package className="w-8 h-8 text-[var(--vero-gold-accent-dark)] flex-shrink-0" />
								<div>
									<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">FREE SHIPPING</p>
									<p className="text-[10px] text-[var(--selfridges-text-muted)]">Orders Over AED 550</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[var(--selfridges-cream)]/50 to-[var(--selfridges-background)] rounded-lg border border-[var(--vero-gold-accent)]/20">
								<Award className="w-8 h-8 text-[var(--vero-gold-accent)] flex-shrink-0" />
								<div>
									<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">PREMIUM</p>
									<p className="text-[10px] text-[var(--selfridges-text-muted)]">1:18 Scale Quality</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[var(--selfridges-black-secondary)]/5 to-[var(--selfridges-background)] rounded-lg border border-[var(--vero-gold-accent)]/20">
								<TrendingUp className="w-8 h-8 text-[var(--vero-gold-accent-dark)] flex-shrink-0" />
								<div>
									<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">LIMITED</p>
									<p className="text-[10px] text-[var(--selfridges-text-muted)]">Exclusive Releases</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Special Offers Banner - Dark Theme */}
				<section className="w-full px-6 lg:px-12 xl:px-16 py-3 bg-gradient-to-r from-[var(--selfridges-black)] via-[var(--selfridges-gray-medium)] to-[var(--selfridges-black)] border-y border-[var(--selfridges-border-light)]">
					<div className="w-full">
						<div className="flex items-center justify-center gap-2 text-[var(--selfridges-text-primary)]">
							<Zap className="w-5 h-5 animate-pulse" />
							<p className="text-sm md:text-base font-semibold uppercase tracking-wide">
								Special Offers: Up to 30% Off Selected Items - Limited Time!
							</p>
							<Zap className="w-5 h-5 animate-pulse" />
						</div>
					</div>
				</section>

				{/* Category Columns with Products - 6 Columns in Single Row */}
				<section
					id="categories"
					className="w-full px-6 lg:px-12 xl:px-16 py-12 bg-gradient-to-b from-[var(--selfridges-background)] via-[var(--selfridges-bg-secondary)]/30 to-[var(--selfridges-background)]"
				>
					<div className="w-full">
						{/* Section Header */}
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-light text-[var(--selfridges-text-primary)] uppercase tracking-wider mb-3">
								Shop By Category
							</h2>
							<p className="text-[var(--selfridges-text-muted)] text-lg max-w-2xl mx-auto">
								Explore our curated collection of premium 1:18 scale die-cast models
							</p>
						</div>
						{/* Grid of 6 columns (1 on mobile, 3 on tablet, 6 on desktop) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{categoryProducts.map(({ category, products }) => {
								return (
									<div
										key={category.slug}
										className="flex flex-col space-y-3 p-6 rounded-xl border border-[var(--vero-gold-accent)]/20 bg-[var(--selfridges-bg-secondary)] transition-all duration-300 hover:shadow-lg hover:border-[var(--vero-gold-accent)]/40"
									>
										{/* Category Badge */}
										<div className="relative mb-4">
											<Badge
												className={`${category.badgeColor} text-xs font-bold px-4 py-2 rounded-full absolute -top-2 left-1/2 -translate-x-1/2 z-10 shadow-lg whitespace-nowrap`}
											>
												{category.badge}
											</Badge>
										</div>

										{/* Category Header with Image */}
										<Link
											href={`/category/${category.slug}`}
											className="group relative overflow-hidden rounded-lg aspect-[4/3] hover:scale-[1.02] transition-all duration-300 vero-card"
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
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
												<h2 className="text-white font-bold text-lg uppercase tracking-wide text-center drop-shadow-lg">
													{category.name}
												</h2>
											</div>
										</Link>

										{/* Clean separator */}
										<div className="h-px bg-gradient-to-r from-transparent via-[var(--vero-gold-accent)]/30 to-transparent my-6"></div>

										{/* Exactly 3 Products under this category */}
										<div className="space-y-4">
											{products.slice(0, 3).map((product) => (
												<div
													key={product.id}
													className="group bg-[var(--selfridges-bg-secondary)] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-[var(--selfridges-border)]"
												>
													{/* Product Image with enhanced hover */}
													<Link href={`/product/${product.slug || product.id}`} className="block">
														<div className="relative aspect-square w-full bg-[var(--selfridges-background-muted)] group-hover:bg-[var(--selfridges-bg-secondary)] transition-colors duration-300">
															{(() => {
																// Try to get image from mapping first
																const mappedImage = getProductImage(product.slug);
																if (mappedImage) {
																	return (
																		<Image
																			src={mappedImage}
																			alt={product.name}
																			fill
																			className="object-contain p-3 transition-all duration-500 group-hover:scale-105"
																			sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
																		/>
																	);
																}

																// Use product images if available
																if (product.images && product.images.length > 0 && product.images[0]) {
																	return (
																		<Image
																			src={product.images[0]}
																			alt={product.name}
																			fill
																			className="object-contain p-3 transition-all duration-500 group-hover:scale-105"
																			sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
																		/>
																	);
																}

																// Use premium placeholder based on product name
																const isSports =
																	product.name.toLowerCase().includes("porsche") ||
																	product.name.toLowerCase().includes("ferrari") ||
																	product.name.toLowerCase().includes("lamborghini");
																const isLuxury =
																	product.name.toLowerCase().includes("mercedes") ||
																	product.name.toLowerCase().includes("bmw") ||
																	product.name.toLowerCase().includes("aston");
																const placeholderType = isSports ? "sports" : isLuxury ? "luxury" : "classic";
																const placeholderImage = getPremiumPlaceholder(placeholderType, product.slug);

																return (
																	<Image
																		src={placeholderImage}
																		alt={product.name}
																		fill
																		className="object-contain p-3 transition-all duration-500 group-hover:scale-105"
																		sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
																	/>
																);
															})()}
															<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
																<FavoriteHeartIcon product={product} />
															</div>
														</div>
													</Link>

													{/* Enhanced Product Info */}
													<div className="p-3 bg-[var(--selfridges-bg-secondary)] space-y-2 group-hover:bg-[var(--selfridges-background)] transition-colors duration-300">
														<Link href={`/product/${product.slug || product.id}`} className="block">
															<h3 className="text-sm font-semibold text-[var(--selfridges-text-primary)] line-clamp-2 group-hover:text-[var(--vero-gold-accent)] transition-colors leading-snug mb-2">
																{product.name}
															</h3>
															<div className="flex flex-col gap-2">
																<p className="text-lg font-bold text-[var(--selfridges-text-primary)]">
																	€{(product.price / 100).toFixed(2)}
																</p>
																<div className="flex gap-1.5">
																	<AddToCart
																		variantId={product.id}
																		className="flex-1 items-center justify-center gap-1 rounded-md bg-black px-2 py-1.5 text-xs font-semibold text-white transition-colors duration-300 hover:bg-gray-800"
																	>
																		<span className="uppercase tracking-wide text-xs">Add</span>
																	</AddToCart>
																	<Link
																		href={`/product/${product.slug || product.id}`}
																		className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-[var(--vero-gold-accent)]/40 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-black bg-[var(--vero-gold-accent)] transition-all duration-300 hover:border-[var(--vero-gold-accent-dark)] hover:bg-[var(--vero-gold-accent-dark)]"
																	>
																		<Eye className="h-3 w-3 text-black" />
																		<span className="text-xs text-black">View</span>
																	</Link>
																</div>
															</div>
														</Link>
													</div>
												</div>
											))}
										</div>

										{/* View All Link */}
										{products.length > 0 && (
											<Link
												href={`/category/${category.slug}`}
												className="text-[11px] text-black hover:text-black font-semibold tracking-wide transition-all duration-300 text-center py-1.5 hover:underline uppercase"
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
				<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-[var(--selfridges-bg-secondary)] to-[var(--selfridges-background)] border-y border-[var(--vero-gold-accent)]/20">
					<div className="w-full">
						{/* Section Header */}
						<div className="text-center mb-12">
							<h3 className="text-3xl md:text-4xl font-light text-[var(--selfridges-text-primary)] uppercase tracking-wider mb-3">
								Why Collectors Choose Veromodels
							</h3>
							<p className="text-[var(--selfridges-text-muted)] text-lg max-w-2xl mx-auto">
								Premium quality, authenticity, and exceptional service for every collector
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Award className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Authenticity Guaranteed
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Every model is officially licensed and comes with certificates of authenticity from verified
									manufacturers
								</p>
							</div>

							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Package className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Secure Packaging
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Double-boxed with protective foam to ensure safe delivery of your precious collectible items
								</p>
							</div>

							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Shield className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Quality Assurance
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Inspected and verified before shipment with premium 1:18 scale craftsmanship and attention
									to detail
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Brand Showcase - Animated Marquee */}
				<section className="relative border-t border-[var(--vero-gold-accent)]/20 py-12 overflow-hidden bg-[var(--selfridges-background)]">
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
					<div className="absolute inset-0 bg-gradient-to-b from-[var(--selfridges-bg-secondary)] via-[var(--selfridges-background)]/95 to-[var(--selfridges-background)]/95 z-0" />

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
										<div className="text-lg md:text-xl font-light text-[var(--selfridges-text-muted)] hover:text-[var(--vero-gold-accent)] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
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
				<section className="w-full px-6 lg:px-12 xl:px-16 py-8 bg-[var(--selfridges-bg-secondary)] border-t border-[var(--selfridges-border-light)]">
					<div className="w-full text-center">
						<h3 className="text-xl md:text-2xl font-semibold text-[var(--selfridges-text-primary)] mb-2">
							Get Exclusive Updates & Early Access
						</h3>
						<p className="text-sm text-[var(--selfridges-text-muted)] mb-4">
							Subscribe to our newsletter for new releases, special offers, and collector tips
						</p>
						<Link
							href="/newsletter"
							className="inline-flex items-center gap-2 bg-[var(--selfridges-black)] hover:bg-[var(--selfridges-gray-medium)] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-300 uppercase tracking-wide"
						>
							Subscribe Now
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
