import Image from "next/image";
import type { Metadata } from "next/types";
import Link from "next/link";
import { publicUrl } from "@/env.mjs";
import { commerce } from "@/lib/commerce";
import StoreConfig from "@/store.config";
import { EnhancedProductCard } from "@/ui/products/enhanced-product-card";
import { Badge } from "@/ui/shadcn/badge";
import { GradientText } from "@/ui/shadcn/gradient-text";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";
import { Meteors } from "@/ui/shadcn/meteors";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description: "Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	let products: any[] = [];

	try {
		// Load products from Stripe
		const result = await commerce.product.browse({ first: 24 });
		products = result?.data || [];

		return (
			<main className="min-h-screen">
				{/* Hero Section with Meteors */}
				<section className="relative vero-gradient border-b border-yellow-900/30 overflow-hidden">
					<Meteors number={20} />
					<div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
						{/* Main Hero */}
						<div className="text-center mb-16">
							<h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-widest uppercase mb-8">
								<GradientText
									text="VEROMODELS"
									gradient="linear-gradient(135deg, #D4AF37 0%, #E6C757 100%)"
									className="text-5xl md:text-7xl lg:text-8xl"
								/>
							</h1>
							<p className="text-xl md:text-2xl text-yellow-200/90 font-light tracking-wide mb-6">
								Premium Diecast Car Models
							</p>
							<p className="text-lg text-yellow-300/80 max-w-3xl mx-auto leading-relaxed">
								Exquisite 1:18 scale collectibles from the world&apos;s most prestigious automobile manufacturers
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
								<Link href="/products" className="vero-button px-8 py-4 inline-block">
									Explore Collection
								</Link>
								<Link href="/category/pre-order" className="vero-button-outline px-8 py-4 inline-block">
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
									className="group vero-card relative overflow-hidden aspect-square hover:scale-105 transition-all duration-300"
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
										<h3 className="text-yellow-400 font-light text-sm md:text-base uppercase tracking-wide">
											{category.name}
										</h3>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Products Grid - Main Display */}
				<section className="container mx-auto px-4 py-20">
					<div className="flex items-center justify-between mb-12">
						<h2 className="text-3xl md:text-4xl font-light vero-text-gradient uppercase tracking-widest">
							Latest Models
						</h2>
						<Link href="/products" className="text-yellow-400 hover:text-yellow-300 font-light tracking-wide transition-colors">
							View All →
						</Link>
					</div>

					{products.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product) => (
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
					) : (
						<div className="text-center py-20">
							<div className="text-yellow-400/40 text-7xl mb-6">🏎️</div>
							<h3 className="text-2xl font-light text-yellow-400 mb-3 uppercase tracking-wide">
								No models available yet
							</h3>
							<p className="text-yellow-400/60 mb-8">
								Products will appear here once they are migrated to Stripe
							</p>
							<div className="vero-card p-8 max-w-md mx-auto">
								<p className="text-sm text-yellow-400/80 mb-4">
									<strong className="text-yellow-400">Next step:</strong> Run the migration script to import products from CSV
								</p>
								<code className="text-xs bg-black/50 text-yellow-300 px-3 py-2 rounded border border-yellow-900/30 inline-block">
									bun run scripts/migrate-products.ts
								</code>
							</div>
						</div>
					)}
				</section>

				{/* Brand Showcase - Animated Marquee */}
				<section className="border-t border-yellow-900/30 bg-gradient-to-b from-black to-yellow-950/5 py-20">
					<div className="container mx-auto px-4">
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
										<div className="text-2xl font-light text-yellow-400/60 hover:text-yellow-400 transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
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
	} catch (error) {
		console.error("Error in Home component:", error);
		// Continue with empty products array
		products = [];
	}

	return (
		<main className="min-h-screen">
			{/* Hero Section with Categories */}
			<section className="vero-gradient border-b border-yellow-900/30">
				<div className="container mx-auto px-4 py-24">
					{/* Main Hero */}
					<div className="text-center mb-16">
						<h1 className="text-5xl md:text-7xl font-light tracking-widest uppercase vero-text-gradient mb-6">
							VEROMODELS
						</h1>
						<p className="text-xl md:text-2xl text-yellow-200/90 font-light tracking-wide mb-4">
							Premium Diecast Car Models
						</p>
						<p className="text-lg text-yellow-300/80 max-w-2xl mx-auto">
							Discover exclusive 1:18 scale models from the world's finest manufacturers
						</p>
					</div>

					{/* Category Quick Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{StoreConfig.categories.map((category) => (
							<Link
								key={category.slug}
								href={`/category/${category.slug}`}
								className="group relative overflow-hidden rounded-lg aspect-square"
							>
								<Image
									src={category.image}
									alt={category.name}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-110"
									sizes="(max-width: 768px) 50vw, 16.666vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
									<Badge className={`${category.badgeColor} text-white text-xs mb-2 w-fit`}>
										{category.badge}
									</Badge>
									<h3 className="text-white font-bold text-sm md:text-base">
										{category.name}
									</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Products Grid - Main Display */}
			<section className="container mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900">
						Latest Models
					</h2>
					<Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
						View All →
					</Link>
				</div>

				{products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
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
				) : (
					<div className="text-center py-16">
						<div className="text-gray-400 text-6xl mb-4">🏎️</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							No models available yet
						</h3>
						<p className="text-gray-500 mb-6">
							Products will appear here once they are migrated to Stripe
						</p>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
							<p className="text-sm text-blue-800">
								<strong>Next step:</strong> Run the migration script to import products from CSV
							</p>
							<code className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded mt-2 inline-block">
								npx tsx scripts/migrate-products-to-stripe.ts
							</code>
						</div>
					</div>
				)}
			</section>

			{/* Brand Showcase */}
			<section className="bg-white py-12 border-t">
				<div className="container mx-auto px-4">
					<h3 className="text-center text-lg font-semibold text-gray-600 mb-6">
						PREMIUM BRANDS WE CARRY
					</h3>
					<div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
						{StoreConfig.brands.slice(0, 8).map((brand) => (
							<div
								key={brand}
								className="text-gray-400 hover:text-gray-700 transition-colors font-medium text-sm md:text-base"
							>
								{brand}
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
