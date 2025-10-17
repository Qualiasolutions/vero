import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProductsByCategory } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { HeroSlideshow } from "@/ui/hero-slideshow";
import { CompactProductCard } from "@/ui/products/compact-product-card";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";
import { ShootingStars } from "@/ui/shadcn/shooting-stars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/shadcn/tooltip";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description:
		"Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch products by category
	const categoryProducts = await Promise.all(
		StoreConfig.categories.map(async (category) => ({
			category,
			products: await getProductsByCategory(category.slug, 3),
		})),
	);

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Slideshow - Right under header */}
			<HeroSlideshow />

			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-[#FDFBF7] via-white to-[#F8F9FA] border-b border-[#D4AF37]/20 overflow-hidden">
				{/* Subtle Animated Background */}
				<div className="absolute inset-0 opacity-30">
					<ShootingStars className="absolute inset-0 z-0" starColor="#D4AF37" trailColor="#E6C757" />
				</div>

				<div className="w-full px-4 py-16 md:py-20 relative z-10">
					{/* Main Hero */}
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-widest uppercase mb-6">
							<span className="vero-elegant-text">VEROMODELS</span>
						</h1>
						<p className="text-xl md:text-2xl text-[#212529] font-light tracking-wide mb-4">
							Premium Diecast Car Models
						</p>
						<p className="text-base md:text-lg text-[#6C757D] max-w-3xl mx-auto leading-relaxed">
							Exquisite 1:18 scale collectibles from the world&apos;s most prestigious automobile
							manufacturers
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
							<Link
								href="/products"
								className="vero-button has-ripple px-8 py-4 rounded-lg inline-block text-center shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40"
							>
								Explore Collection
							</Link>
							<Link
								href="/category/pre-order"
								className="vero-button-outline px-8 py-4 rounded-lg inline-block text-center"
							>
								View Pre-Orders
							</Link>
						</div>
					</div>

					{/* Category Quick Links */}
					<TooltipProvider delayDuration={200}>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
							{StoreConfig.categories.map((category) => (
								<Tooltip key={category.slug}>
									<TooltipTrigger asChild>
										<Link
											href={`/category/${category.slug}`}
											className="group vero-card relative overflow-hidden aspect-[4/3] hover:scale-[1.03] transition-all duration-300 rounded-xl"
										>
											<div className="relative w-full h-full">
												<Image
													src={category.image}
													alt={category.name}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-110"
													sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
												/>
											</div>
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
												<Badge className={`${category.badgeColor} text-white text-xs mb-2 w-fit`}>
													{category.badge}
												</Badge>
												<h3 className="text-white font-medium text-sm md:text-base uppercase tracking-wide">
													{category.name}
												</h3>
											</div>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="bottom" className="bg-white border-[#D4AF37]/30 text-[#212529]">
										<p className="text-sm">{category.description}</p>
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					</TooltipProvider>
				</div>
			</section>

			{/* Category-Based Product Sections - Same Size as Category Boxes */}
			<section className="w-full px-4 py-20 space-y-20 bg-white">
				{categoryProducts.map(({ category, products }) => {
					if (products.length === 0) return null;

					return (
						<div key={category.slug} className="space-y-8 max-w-7xl mx-auto">
							{/* Category Header */}
							<div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
								<div>
									<h2 className="text-2xl md:text-3xl font-light text-[#212529] uppercase tracking-wider mb-2">
										{category.name}
									</h2>
									<p className="text-sm md:text-base text-[#6C757D]">{category.description}</p>
								</div>
								<Link
									href={`/category/${category.slug}`}
									className="text-[#D4AF37] hover:text-[#B8941F] font-medium text-sm tracking-wide transition-all duration-300 flex items-center gap-2 hover:gap-3"
								>
									View All
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</Link>
							</div>

							{/* Products Grid - Same 4-column layout as categories */}
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{products.map((product) => (
									<CompactProductCard
										key={product.id}
										product={{
											id: product.id,
											name: product.name,
											slug: product.slug || product.id,
											price: product.price,
											images: product.images || [],
											metadata: product.metadata || {},
										}}
										currency="€"
									/>
								))}
							</div>
						</div>
					);
				})}
			</section>

			{/* Brand Showcase - Animated Marquee */}
			<section className="border-t border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] via-[#F8F9FA] to-white py-24">
				<div className="w-full px-4 max-w-7xl mx-auto">
					<h3 className="text-center text-2xl md:text-3xl font-light vero-text-gradient uppercase tracking-widest mb-16">
						PREMIUM BRANDS WE CARRY
					</h3>
					<Marquee className="py-6">
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent speed={40}>
							{StoreConfig.brands.map((brand, idx) => (
								<MarqueeItem key={`${brand}-${idx}`} className="mx-16 flex items-center justify-center">
									<div className="text-2xl md:text-3xl font-light text-[#6C757D] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
										{brand}
									</div>
								</MarqueeItem>
							))}
						</MarqueeContent>
					</Marquee>
				</div>
			</section>
		</main>
	);
}
