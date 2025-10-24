import type { Product } from "commerce-kit";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteHeartIcon } from "@/components/favorite-heart-icon";
import { formatMoney } from "@/lib/utils";
import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { Badge } from "@/ui/shadcn/badge";
import { Card, CardContent } from "@/ui/shadcn/card";
import { YnsLink } from "@/ui/yns-link";

export const ProductList = ({ products, locale = "en-US" }: { products: Product[]; locale?: string }) => {
	return (
		<>
			<div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
				{products.map((product, idx) => {
					// Determine if product has special attributes for badges
					const isNew = idx < 3; // First 3 products marked as new
					const isSpecial = product.price && product.price > 200; // Higher-priced items as special

					return (
						<Card
							key={product.id}
							className="vero-card group overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl border border-[#E5E7EB]"
						>
							<div className="relative">
								{product.images[0] && (
									<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#FAFAF9] via-white to-[#F8F7F4]">
										{/* Badge overlays */}
										<div className="absolute top-2 left-2 z-10 flex gap-1.5">
											{isNew && (
												<Badge className="bg-[#F5E6D3] text-[#A89050] border border-[#C4A962]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm">
													New
												</Badge>
											)}
											{isSpecial && (
												<Badge className="bg-gradient-to-r from-[#C4A962] to-[#D4B673] text-white shadow-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm">
													Premium
												</Badge>
											)}
										</div>

										{/* Premium product frame with proper image display */}
										<div className="relative h-full w-full p-4">
											<YnsLink href={`/product/${product.slug}`} className="block h-full w-full">
												<div className="relative h-full w-full flex items-center justify-center">
													<Image
														className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105 drop-shadow-lg"
														src={product.images[0]}
														width={400}
														height={300}
														loading={idx < 3 ? "eager" : "lazy"}
														priority={idx < 3}
														sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 300px"
														alt={product.name}
													/>
												</div>
											</YnsLink>
											{/* Subtle frame border */}
											<div className="absolute inset-0 border border-[#E5E7EB]/50 rounded-sm pointer-events-none"></div>
											{/* Hover glow effect */}
											<div className="absolute inset-0 bg-gradient-radial from-[#C4A962]/0 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
										</div>

										{/* Favorite heart icon - compact */}
										<div className="absolute top-2 right-2 z-10">
											<FavoriteHeartIcon product={product} />
										</div>

										{/* Quick action overlay on hover - refined */}
										<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm">
											<div className="flex flex-col gap-2 p-3 items-center">
												{/* View button */}
												<Link
													href={`/product/${product.slug}`}
													className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4A962] text-white transition-all duration-300 hover:bg-[#A89050] hover:scale-110"
													title="View Details"
												>
													<Eye className="h-4 w-4" />
												</Link>

												{/* Add to cart button */}
												<AddToCart
													variantId={product.id}
													className="flex h-9 px-4 items-center justify-center gap-1.5 rounded-full bg-[#0F0F0F] text-white text-xs font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[#2A2A2A]"
												>
													<ShoppingCart className="h-3.5 w-3.5" />
													Add
												</AddToCart>
											</div>
										</div>
									</div>
								)}

								<CardContent className="p-3 sm:p-4 space-y-2">
									{/* Product name - compact */}
									<YnsLink href={`/product/${product.slug}`}>
										<h2 className="text-xs sm:text-sm font-medium text-[var(--selfridges-text-primary)] group-hover:text-[#C4A962] transition-colors duration-300 tracking-wide line-clamp-2 leading-tight">
											{product.name}
										</h2>
									</YnsLink>

									{/* Price display - refined */}
									<div className="pt-2 border-t border-[var(--selfridges-border-light)]">
										{product.price && (
											<div className="flex items-center justify-between">
												<p className="text-base sm:text-lg font-bold text-[var(--selfridges-text-primary)]">
													{formatMoney({
														amount: product.price,
														currency: product.currency,
														locale,
													})}
												</p>
												{isSpecial && (
													<Badge
														variant="secondary"
														className="text-[9px] sm:text-[10px] text-[#C4A962] bg-[#C4A962]/10 px-1.5 py-0.5 rounded uppercase font-bold"
													>
														VIP
													</Badge>
												)}
											</div>
										)}
									</div>
								</CardContent>
							</div>
						</Card>
					);
				})}
			</div>
			<JsonLd jsonLd={mappedProductsToJsonLd(products)} />
		</>
	);
};
