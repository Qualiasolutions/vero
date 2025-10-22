import type { Product } from "commerce-kit";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteHeartIcon } from "@/components/favorite-heart-icon";
import { getLocale } from "@/i18n/server";
import { formatMoney } from "@/lib/utils";
import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { Badge } from "@/ui/shadcn/badge";
import { Card, CardContent } from "@/ui/shadcn/card";
import { YnsLink } from "@/ui/yns-link";

export const ProductList = async ({ products }: { products: Product[] }) => {
	const locale = await getLocale();

	return (
		<>
			<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product, idx) => {
					// Determine if product has special attributes for badges
					const isNew = idx < 3; // First 3 products marked as new
					const isSpecial = product.price && product.price > 200; // Higher-priced items as special

					return (
						<Card
							key={product.id}
							className="vero-card group overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
						>
							<div className="relative">
								{product.images[0] && (
									<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
										{/* Badge overlays */}
										<div className="absolute top-3 left-3 z-10 flex gap-2">
											{isNew && (
												<Badge className="bg-[#F5E6D3] text-[#B8941F] border border-[#D4AF37]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
													New
												</Badge>
											)}
											{isSpecial && (
												<Badge className="bg-gradient-to-r from-[#D4AF37] to-[#E6C757] text-white shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
													Premium
												</Badge>
											)}
										</div>

										{/* Product image with enhanced border effect */}
										<div className="relative h-full w-full border-2 border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
											<YnsLink href={`/product/${product.slug}`}>
												<Image
													className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
													src={product.images[0]}
													width={768}
													height={768}
													loading={idx < 3 ? "eager" : "lazy"}
													priority={idx < 3}
													sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
													alt={product.name}
												/>
											</YnsLink>
											{/* Overlay glow effect on hover */}
											<div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 via-transparent to-transparent group-hover:from-[#D4AF37]/10 transition-all duration-500"></div>
										</div>

										{/* Favorite heart icon */}
										<FavoriteHeartIcon product={product} />

										{/* Quick action overlay on hover */}
										<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm">
											<div className="flex gap-3 p-4">
												{/* Favorite button - using the existing FavoriteHeartIcon but with white styling for overlay */}
												<div className="flex h-11 w-11 items-center justify-center rounded-full border-white/40 bg-white/15 text-white transition-all duration-300 hover:bg-white/25">
													<FavoriteHeartIcon product={product} />
												</div>

												{/* View button - actual link to product page */}
												<Link
													href={`/product/${product.slug}`}
													className="flex h-11 w-11 items-center justify-center rounded-full border-white/40 bg-white/15 text-white transition-all duration-300 hover:bg-white/25"
												>
													<Eye className="h-5 w-5" />
												</Link>

												{/* Add to cart button - using the AddToCart component */}
												<AddToCart
													variantId={product.id}
													className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-[#B8941F]"
												>
													<ShoppingCart className="h-5 w-5" />
													Quick Add
												</AddToCart>
											</div>
										</div>
									</div>
								)}

								<CardContent className="p-5 space-y-3">
									{/* Product name with hover effect */}
									<YnsLink href={`/product/${product.slug}`}>
										<h2 className="text-base font-light text-[#212529] group-hover:text-[#D4AF37] transition-colors duration-300 tracking-wide line-clamp-2">
											{product.name}
										</h2>
									</YnsLink>

									{/* Price display */}
									<div className="pt-2 border-t border-[#D4AF37]/20">
										{product.price && (
											<div className="flex items-center justify-between">
												<p className="text-xl font-semibold vero-text-gradient">
													{formatMoney({
														amount: product.price,
														currency: product.currency,
														locale,
													})}
												</p>
												{isSpecial && (
													<Badge
														variant="secondary"
														className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded"
													>
														Exclusive
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
