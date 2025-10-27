import { Award, Eye, Package, Shield, ShoppingCart } from "lucide-react";
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
import { InfoBillboard } from "@/ui/home/info-billboard";
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

	// Featured products to show at top of each category (in fixed order)
	const featuredProductNames = [
		"Premium Classixxs MAN TGX XXL Blue Metallic",
		"KYOSHO Lamborghini Countach LP400 Red 1974",
		"IXO TOYOTA CALICA GT-FOUR",
		"PARAGON MODELS BMW X4 XDRIVE 3.5d F83 2014",
		"RANGE ROVER SPORT SV EDITION TWO GREY 2024 GT Spirit 1:18",
		"AutoArt ALFA ROMEO 4C GLOSS BLACK",
	];

	// Find featured products in order
	const featuredProducts = featuredProductNames.map((name) =>
		allProducts.find((p) => p.name.toLowerCase().includes(name.toLowerCase())),
	);

	// Distribute products across categories (3 per category + 1 featured at top)
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

		// Add featured product at the top (one per category, in order)
		const featuredProduct = featuredProducts[index];
		if (featuredProduct && !categoryProds.find((p) => p.id === featuredProduct.id)) {
			categoryProds = [featuredProduct, ...categoryProds.slice(0, 2)]; // Keep total at 3
		}

		return {
			category,
			products: categoryProds,
		};
	});

	return (
		<div className="bg-[var(--selfridges-background)] relative">
			{/* Content */}
			<div className="relative">
				{/* Hero Section */}
				<HeroSection />

				{/* Info Billboard - Live Stats */}
				<InfoBillboard />

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
						{/* Grid - Mobile optimized (2 cols on mobile, scales up gracefully) */}
						<div className="grid grid-cols-2 gap-4 xs:gap-5 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-7 xl:grid-cols-6 xl:gap-8">
							{categoryProducts.map(({ category, products }) => {
								return (
									<div
										key={category.slug}
										className="flex flex-col space-y-4 p-4 rounded-xl border border-[var(--vero-gold-accent)]/20 bg-[var(--selfridges-bg-secondary)] transition-all duration-300 hover:shadow-lg hover:border-[var(--vero-gold-accent)]/40"
									>
										{/* Category Badge */}
										<div className="relative text-center">
											<Badge
												className={`${category.badgeColor} text-[10px] xs:text-xs sm:text-sm font-bold px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-2.5 rounded-full shadow-lg whitespace-nowrap inline-block`}
											>
												{category.badge}
											</Badge>
											{/* Category Name as text below badge */}
											<h2 className="text-xs xs:text-sm sm:text-base font-bold text-[var(--selfridges-text-primary)] uppercase tracking-wide mt-3 mb-2">
												{category.name}
											</h2>
										</div>

										{/* Products */}
										<div className="flex-1 space-y-3">
											{products.slice(0, 3).map((product) => (
												<div
													key={product.id}
													className="group bg-[var(--selfridges-background)] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-[var(--selfridges-border)]"
												>
													{/* Product Image */}
													<Link href={`/product/${product.slug || product.id}`} className="block">
														<div className="relative aspect-[4/3] w-full bg-[var(--selfridges-background-muted)] group-hover:bg-[var(--selfridges-bg-secondary)] transition-colors duration-300 overflow-hidden">
															{product.images && product.images.length > 0 && product.images[0] ? (
																<Image
																	src={product.images[0]}
																	alt={product.name}
																	fill
																	className="object-cover object-center transition-all duration-500 group-hover:scale-105"
																	sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
																/>
															) : (
																<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F5]">
																	<span className="text-[#C4A962] text-xs font-semibold uppercase tracking-wide">
																		Coming Soon
																	</span>
																</div>
															)}
															<div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
																<FavoriteHeartIcon product={product} />
															</div>
														</div>
													</Link>

													{/* Product Info */}
													<div className="p-2 sm:p-3 bg-[var(--selfridges-background)] space-y-2 group-hover:bg-[var(--selfridges-bg-secondary)] transition-colors duration-300">
														<Link href={`/product/${product.slug || product.id}`} className="block">
															<h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-[var(--selfridges-text-primary)] line-clamp-2 group-hover:text-[#dfbc3f] transition-colors leading-tight min-h-[24px] xs:min-h-[28px] sm:min-h-[32px]">
																{product.name}
															</h3>
														</Link>

														{/* Price */}
														<p className="text-xs sm:text-sm font-bold text-[#dfbc3f] text-center">
															€{(product.price / 100).toFixed(2)}
														</p>

														{/* Action buttons */}
														<div className="flex gap-1">
															<Link
																href={`/product/${product.slug || product.id}`}
																className="flex-1 inline-flex items-center justify-center gap-0.5 rounded border border-[#dfbc3f] px-1.5 py-1 text-[9px] xs:text-xs font-semibold uppercase tracking-wide text-black bg-white transition-all duration-300 hover:bg-[#dfbc3f] hover:text-white"
															>
																<Eye className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
																<span className="hidden xs:inline">View</span>
																<span className="xs:hidden">V</span>
															</Link>
															<AddToCart
																variantId={product.id}
																className="flex-1 inline-flex items-center justify-center gap-0.5 rounded bg-[#dfbc3f] px-1.5 py-1 text-[9px] xs:text-xs font-semibold text-black transition-colors duration-300 hover:bg-[#c4a535] uppercase tracking-wide !px-1.5 !py-1"
															>
																<ShoppingCart className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
																<span className="hidden xs:inline">Add</span>
																<span className="xs:hidden">+</span>
															</AddToCart>
														</div>
													</div>
												</div>
											))}
										</div>

										{/* View All Link */}
										{products.length > 0 && (
											<Link
												href={`/category/${category.slug}`}
												className="text-[10px] xs:text-xs sm:text-xs text-black hover:text-black font-semibold tracking-wide transition-all duration-300 text-center py-2 hover:underline uppercase"
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
