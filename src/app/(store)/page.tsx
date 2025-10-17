import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProductsByCategory } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description:
		"Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch 3 products per category for cleaner layout
	const categoryProducts = await Promise.all(
		StoreConfig.categories.map(async (category) => ({
			category,
			products: await getProductsByCategory(category.slug, 3),
		})),
	);

	return (
		<main className="min-h-screen bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
			{/* Minimal Top Banner */}
			<section className="relative bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-[#D4AF37]/10 border-b border-[#D4AF37]/20 py-4">
				<div className="w-full px-4 max-w-7xl mx-auto">
					<div className="text-center">
						<p className="text-sm md:text-base text-[#6C757D] font-light">
							Premium 1:18 Scale Die-Cast Model Cars • Free Shipping Over €150
						</p>
					</div>
				</div>
			</section>

			{/* Category Columns with Products - 6 Columns in Single Row */}
			<section className="w-full px-4 py-8 bg-transparent">
				<div className="max-w-[1600px] mx-auto">
					{/* Grid of 6 columns (1 on mobile, 3 on tablet, 6 on desktop) */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{categoryProducts.map(({ category, products }) => {
							// Map badge color to subtle background tint
							const getBgTint = (badgeColor: string) => {
								const colorMap: Record<string, string> = {
									"bg-green-500": "bg-green-50/50 border-green-100",
									"bg-red-500": "bg-red-50/50 border-red-100",
									"bg-purple-500": "bg-purple-50/50 border-purple-100",
									"bg-amber-500": "bg-amber-50/50 border-amber-100",
									"bg-blue-500": "bg-blue-50/50 border-blue-100",
									"bg-indigo-500": "bg-indigo-50/50 border-indigo-100",
								};
								return colorMap[badgeColor] || "bg-gray-50/50 border-gray-100";
							};

							return (
								<div
									key={category.slug}
									className={`flex flex-col space-y-3 p-3 rounded-xl border ${getBgTint(category.badgeColor)} transition-all duration-300 hover:shadow-lg`}
								>
									{/* Category Header */}
									<Link
										href={`/category/${category.slug}`}
										className="group relative overflow-hidden rounded-lg aspect-[4/3] hover:scale-[1.02] transition-all duration-300"
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
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-2.5">
											<Badge className={`${category.badgeColor} text-white text-[10px] mb-1 w-fit px-2 py-0.5`}>
												{category.badge}
											</Badge>
											<h2 className="text-white font-semibold text-xs uppercase tracking-wide">
												{category.name}
											</h2>
										</div>
									</Link>

									{/* 3 Products under this category */}
									<div className="space-y-2.5">
										{products.slice(0, 3).map((product) => (
											<Link
												key={product.id}
												href={`/product/${product.slug || product.id}`}
												className="group block"
											>
												<div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
													{/* Product Image */}
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
													</div>

													{/* Product Info - Compact */}
													<div className="p-2 bg-white">
														<h3 className="text-[11px] text-[#212529] font-medium line-clamp-2 mb-1 group-hover:text-[#D4AF37] transition-colors leading-tight">
															{product.name}
														</h3>
														<p className="text-sm font-bold text-[#D4AF37]">
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
