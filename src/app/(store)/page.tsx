import Image from "next/image";
import type { Metadata } from "next/types";
import Link from "next/link";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { EnhancedProductCard } from "@/ui/products/enhanced-product-card";
import { Badge } from "@/ui/shadcn/badge";
import { GradientText } from "@/ui/shadcn/gradient-text";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description: "Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	let products: any[] = [];

	try {
		// Load products from our custom service
		const result = await getProducts(24);
		products = result.data || [];
		console.log(`✅ Loaded ${products.length} products from Stripe`);
	} catch (error) {
		console.error("Error in Home component:", error);
		products = [];
	}

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/20 overflow-hidden">
				<div className="w-full px-4 py-24 md:py-32 relative z-10">
					{/* Main Hero */}
					<div className="text-center mb-16">
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-widest uppercase mb-8">
							<GradientText
								text="VEROMODELS"
								gradient="linear-gradient(135deg, #D4AF37 0%, #E6C757 100%)"
								className="text-5xl md:text-7xl lg:text-8xl"
							/>
						</h1>
						<p className="text-xl md:text-2xl text-[#6C757D] font-light tracking-wide mb-6">
							Premium Diecast Car Models
						</p>
						<p className="text-lg text-[#6C757D]/80 max-w-3xl mx-auto leading-relaxed">
							Exquisite 1:18 scale collectibles from the world&apos;s most prestigious automobile manufacturers
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
							<Link href="/products" className="vero-button px-8 py-4 rounded-lg inline-block">
								Explore Collection
							</Link>
							<Link href="/category/pre-order" className="vero-button-outline px-8 py-4 rounded-lg inline-block">
								View Pre-Orders
							</Link>
						</div>
					</div>

					{/* Category Quick Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{StoreConfig.categories.map((category) => (
							<Link
								key={category.slug}
								href={`/category/${category.slug}`}
								className="group vero-card relative overflow-hidden aspect-square hover:scale-105 transition-all duration-300 rounded-lg"
							>
								<Image
									src={category.image}
									alt={category.name}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-110"
									sizes="(max-width: 768px) 50vw, 16.666vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4">
									<Badge className={`${category.badgeColor} text-white text-xs mb-2 w-fit`}>
										{category.badge}
									</Badge>
									<h3 className="text-white font-light text-sm md:text-base uppercase tracking-wide">
										{category.name}
									</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{products.length > 0 ? (
				<>
					{/* Featured Products Section */}
					<section className="w-full px-4 py-20">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-light vero-text-gradient uppercase tracking-widest mb-4">
								Featured Collection
							</h2>
							<div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							{products.slice(0, 4).map((product) => (
								<EnhancedProductCard
									key={product.id}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug || product.id,
										price: product.price,
										images: product.images,
										metadata: (product as any).metadata || {},
									}}
									currency="€"
								/>
							))}
						</div>
					</section>

					{/* Latest Models Grid */}
					<section className="w-full px-4 py-20 bg-gradient-to-b from-[#FDFBF7] to-white">
						<div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
							<div>
								<h2 className="text-3xl md:text-4xl font-light vero-text-gradient uppercase tracking-widest">
									Latest Models
								</h2>
								<p className="text-sm text-[#6C757D] mt-2">Discover our newest arrivals</p>
							</div>
							<Link href="/products" className="vero-button-outline px-6 py-3 rounded-lg inline-block">
								View All Models
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.slice(4, 13).map((product) => (
								<EnhancedProductCard
									key={product.id}
									product={{
										id: product.id,
										name: product.name,
										slug: product.slug || product.id,
										price: product.price,
										images: product.images,
										metadata: (product as any).metadata || {},
									}}
									currency="€"
								/>
							))}
						</div>
					</section>

					{/* Category-Based Rows */}
					<section className="w-full px-4 py-20">
						<div className="space-y-16">
							{/* Pre-Orders Section */}
							<div>
								<div className="flex items-center justify-between mb-8">
									<div>
										<h3 className="text-2xl md:text-3xl font-light vero-text-gradient uppercase tracking-wider">
											Pre-Order Now
										</h3>
										<p className="text-sm text-[#6C757D] mt-2">Reserve upcoming releases</p>
									</div>
									<Link href="/category/pre-order" className="text-[#D4AF37] hover:text-[#B8941F] font-light tracking-wide transition-colors">
										View All →
									</Link>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{products.slice(13, 17).map((product) => (
										<EnhancedProductCard
											key={product.id}
											product={{
												id: product.id,
												name: product.name,
												slug: product.slug || product.id,
												price: product.price,
												images: product.images,
												metadata: (product as any).metadata || {},
											}}
											currency="€"
										/>
									))}
								</div>
							</div>

							{/* Limited Editions Section */}
							<div>
								<div className="flex items-center justify-between mb-8">
									<div>
										<h3 className="text-2xl md:text-3xl font-light vero-text-gradient uppercase tracking-wider">
											Limited Editions
										</h3>
										<p className="text-sm text-[#6C757D] mt-2">Rare and exclusive models</p>
									</div>
									<Link href="/category/limited-edition" className="text-[#D4AF37] hover:text-[#B8941F] font-light tracking-wide transition-colors">
										View All →
									</Link>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{products.slice(17, 21).map((product) => (
										<EnhancedProductCard
											key={product.id}
											product={{
												id: product.id,
												name: product.name,
												slug: product.slug || product.id,
												price: product.price,
												images: product.images,
												metadata: (product as any).metadata || {},
											}}
											currency="€"
										/>
									))}
								</div>
							</div>
						</div>
					</section>
				</>
			) : (
				<section className="w-full px-4 py-20">
					<div className="text-center py-20">
						<div className="text-[#D4AF37]/40 text-7xl mb-6">🏎️</div>
						<h3 className="text-2xl font-light text-[#212529] mb-3 uppercase tracking-wide">
							Products Loading
						</h3>
						<p className="text-[#6C757D] mb-8">
							66 premium models have been migrated to Stripe
						</p>
					</div>
				</section>
			)}

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
