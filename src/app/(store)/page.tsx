import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProductsByCategory } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { HeroSlideshow } from "@/ui/hero-slideshow";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description:
		"Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch products by category - get 4 products per category for the column layout
	const categoryProducts = await Promise.all(
		StoreConfig.categories.map(async (category) => ({
			category,
			products: await getProductsByCategory(category.slug, 4),
		})),
	);

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Slideshow - Compact and cute */}
			<HeroSlideshow />

			{/* Welcome Section - Compact */}
			<section className="relative bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/20 py-8">
				<div className="w-full px-4 max-w-7xl mx-auto">
					<div className="text-center">
						<h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-3">
							<span className="vero-elegant-text">VEROMODELS</span>
						</h1>
						<p className="text-base md:text-lg text-[#6C757D] max-w-2xl mx-auto leading-relaxed">
							Exquisite 1:18 scale collectibles from the world&apos;s most prestigious automobile
							manufacturers
						</p>
					</div>
				</div>
			</section>

			{/* Category Columns with Products - CK Models Style */}
			<section className="w-full px-4 py-12 bg-white">
				<div className="max-w-7xl mx-auto">
					{/* Grid of 6 columns (2 on mobile, 3 on tablet, 6 on desktop) */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{categoryProducts.map(({ category, products }) => (
							<div key={category.slug} className="flex flex-col space-y-4">
								{/* Category Header with Image */}
								<Link
									href={`/category/${category.slug}`}
									className="group relative overflow-hidden rounded-lg aspect-square hover:scale-[1.02] transition-all duration-300"
								>
									<div className="relative w-full h-full">
										<Image
											src={category.image}
											alt={category.name}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-110"
											sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
										/>
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3">
										<Badge className={`${category.badgeColor} text-white text-xs mb-1 w-fit`}>
											{category.badge}
										</Badge>
										<h2 className="text-white font-medium text-xs uppercase tracking-wide">
											{category.name}
										</h2>
									</div>
								</Link>

								{/* Products under this category */}
								<div className="space-y-3">
									{products.slice(0, 4).map((product) => (
										<Link
											key={product.id}
											href={`/product/${product.slug || product.id}`}
											className="group block"
										>
											<div className="vero-card rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
												{/* Product Image */}
												<div className="relative aspect-square w-full bg-[#F8F9FA]">
													{product.images && product.images.length > 0 ? (
														<Image
															src={product.images[0]}
															alt={product.name}
															fill
															className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
															sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center text-[#6C757D]">
															No Image
														</div>
													)}
												</div>

												{/* Product Info - Compact */}
												<div className="p-2">
													<h3 className="text-xs text-[#212529] font-medium line-clamp-2 mb-1 group-hover:text-[#D4AF37] transition-colors">
														{product.name}
													</h3>
													<p className="text-sm font-semibold text-[#D4AF37]">
														€{(product.price / 100).toFixed(2)}
													</p>
												</div>
											</div>
										</Link>
									))}
								</div>

								{/* View All Link */}
								{products.length > 0 && (
									<Link
										href={`/category/${category.slug}`}
										className="text-xs text-[#D4AF37] hover:text-[#B8941F] font-medium tracking-wide transition-all duration-300 text-center py-2 hover:underline"
									>
										View All →
									</Link>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Brand Showcase - Animated Marquee */}
			<section className="relative border-t border-[#D4AF37]/20 py-16 overflow-hidden">
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

				<div className="relative z-10 w-full px-4 max-w-7xl mx-auto">
					<h3 className="text-center text-xl md:text-2xl font-light vero-text-gradient uppercase tracking-widest mb-12">
						PREMIUM BRANDS WE CARRY
					</h3>
					<Marquee className="py-4">
						<MarqueeFade side="left" />
						<MarqueeFade side="right" />
						<MarqueeContent speed={40}>
							{StoreConfig.brands.map((brand, idx) => (
								<MarqueeItem key={`${brand}-${idx}`} className="mx-12 flex items-center justify-center">
									<div className="text-xl md:text-2xl font-light text-[#6C757D] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
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
