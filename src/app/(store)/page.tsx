import Image from "next/image";
import type { Metadata } from "next/types";
import Link from "next/link";
import { publicUrl } from "@/env.mjs";
import { getProductsByCategory } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { CompactProductCard } from "@/ui/products/compact-product-card";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";
import { BackgroundBeams } from "@/ui/shadcn/background-beams";
import { ShootingStars } from "@/ui/shadcn/shooting-stars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/shadcn/tooltip";
import { Skeleton } from "@/ui/shadcn/skeleton";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description: "Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch products by category
	const categoryProducts = await Promise.all(
		StoreConfig.categories.map(async (category) => ({
			category,
			products: await getProductsByCategory(category.slug, 3),
		}))
	);

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] border-b border-[#D4AF37]/30 overflow-hidden">
				{/* Animated Background */}
				<BackgroundBeams className="absolute inset-0 z-0" />
				<ShootingStars className="absolute inset-0 z-0" starColor="#D4AF37" trailColor="#E6C757" />

				<div className="w-full px-4 py-24 md:py-32 relative z-10">
					{/* Main Hero */}
					<div className="text-center mb-16">
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-widest uppercase mb-8 animate-float">
							<span className="vero-elegant-text text-5xl md:text-7xl lg:text-8xl">
								VEROMODELS
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-[#F5E6D3] font-light tracking-wide mb-6">
							Premium Diecast Car Models
						</p>
						<p className="text-lg text-[#F5E6D3]/70 max-w-3xl mx-auto leading-relaxed">
							Exquisite 1:18 scale collectibles from the world&apos;s most prestigious automobile manufacturers
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
							<Link href="/products" className="vero-button has-ripple px-8 py-4 rounded-lg inline-block text-center shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40">
								Explore Collection
							</Link>
							<Link href="/category/pre-order" className="vero-button-outline px-8 py-4 rounded-lg inline-block text-center">
								View Pre-Orders
							</Link>
						</div>
					</div>

					{/* Category Quick Links */}
					<TooltipProvider delayDuration={200}>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
							{StoreConfig.categories.map((category) => (
								<Tooltip key={category.slug}>
									<TooltipTrigger asChild>
										<Link
											href={`/category/${category.slug}`}
											className="group vero-card relative overflow-hidden aspect-square hover:scale-105 transition-all duration-300 rounded-lg"
										>
											<div className="relative w-full h-full">
												<Image
													src={category.image}
													alt={category.name}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-110"
													sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.666vw"
												/>
											</div>
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-3">
												<Badge className={`${category.badgeColor} text-white text-xs mb-2 w-fit`}>
													{category.badge}
												</Badge>
												<h3 className="text-white font-light text-xs md:text-sm uppercase tracking-wide">
													{category.name}
												</h3>
											</div>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="bottom" className="bg-[#0A0A0A] border-[#D4AF37]/30 text-[#F5E6D3]">
										<p className="text-sm">{category.description}</p>
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					</TooltipProvider>
				</div>
			</section>

			{/* Category-Based Product Sections */}
			<section className="w-full px-4 py-16 space-y-16">
				{categoryProducts.map(({ category, products }) => {
					if (products.length === 0) return null;

					return (
						<div key={category.slug} className="space-y-6">
							{/* Category Header */}
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl md:text-3xl font-light text-[#212529] uppercase tracking-wider mb-2">
										{category.name}
									</h2>
									<p className="text-sm text-[#6C757D]">{category.description}</p>
								</div>
								<Link
									href={`/category/${category.slug}`}
									className="text-[#D4AF37] hover:text-[#B8941F] font-light text-sm tracking-wide transition-colors flex items-center gap-2"
								>
									View All
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>

							{/* Products Grid - 3 products in a row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
			<section className="border-t border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] to-white py-20">
				<div className="w-full px-4">
					<h3 className="text-center text-2xl font-light vero-text-gradient uppercase tracking-widest mb-12">
						PREMIUM BRANDS WE CARRY
					</h3>
					<Marquee className="py-4">
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent speed={40}>
							{StoreConfig.brands.map((brand, idx) => (
								<MarqueeItem
									key={`${brand}-${idx}`}
									className="mx-12 flex items-center justify-center"
								>
									<div className="text-2xl font-light text-[#6C757D] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
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
