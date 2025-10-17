"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/favorites-context";
import { FavoriteButton } from "@/ui/favorite-button";

export default function FavoritesPage() {
	const { favorites } = useFavorites();

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-white">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-light text-[#212529] mb-4 tracking-wide">
						My Favorites
					</h1>
					<p className="text-[#6C757D] text-lg">
						{favorites.length === 0
							? "You haven't added any models to your favorites yet"
							: `You have ${favorites.length} favorite ${favorites.length === 1 ? 'model' : 'models'}`
						}
					</p>
				</div>

				{favorites.length === 0 ? (
					/* Empty State */
					<div className="text-center py-16">
						<div className="inline-flex items-center justify-center w-24 h-24 bg-[#D4AF37]/10 rounded-full mb-6">
							<svg className="w-12 h-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</div>
						<h2 className="text-2xl font-light text-[#212529] mb-4">
							No Favorites Yet
						</h2>
						<p className="text-[#6C757D] mb-8">
							Start exploring our collection and add your favorite diecast models to your wishlist!
						</p>
						<Link
							href="/products"
							className="inline-flex items-center px-8 py-3 bg-[#D4AF37] text-black rounded-sm hover:bg-[#B8941F] transition-colors duration-300 font-medium uppercase tracking-wider text-sm"
						>
							Browse Collection
						</Link>
					</div>
				) : (
					/* Favorites Grid */
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{favorites.map((product) => {
							const isOnSale = product.metadata?.onSale === "true";
							const originalPrice = product.metadata?.originalPrice
								? parseFloat(product.metadata.originalPrice)
								: null;
							const imageUrl = product.images[0] || "/placeholder-car.jpg";

							return (
								<div key={product.id} className="group">
									<div className="vero-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
										<div className="relative aspect-square overflow-hidden bg-black/50">
											{/* Remove Button Overlay */}
											<div className="absolute top-3 right-3 z-20">
												<FavoriteButton product={product} size="md" />
											</div>

											{/* Product Image */}
											<div className="relative h-full w-full border-2 border-transparent group-hover:border-[#D4AF37]/30 transition-colors duration-500">
												<Image
													src={imageUrl}
													alt={product.name}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-110"
													sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
												/>
											</div>
										</div>

										<div className="p-4 sm:p-5 space-y-3 bg-white">
											{/* Brand */}
											{product.metadata?.brand && (
												<div className="text-xs text-[#D4AF37]/70 uppercase tracking-[0.2em] font-light">
													{product.metadata.brand}
												</div>
											)}

											{/* Product Name */}
											<h3 className="font-light text-sm sm:text-base leading-snug line-clamp-2 text-[#212529] group-hover:text-[#D4AF37] transition-colors duration-300 tracking-wide">
												{product.name}
											</h3>

											{/* Pricing */}
											<div className="flex items-baseline gap-2 pt-1">
												{isOnSale && originalPrice && originalPrice > product.price ? (
													<>
														<span className="text-xl font-semibold vero-text-gradient">
															€{product.price.toFixed(2)}
														</span>
														<span className="text-sm text-[#6C757D] line-through">
															€{originalPrice.toFixed(2)}
														</span>
													</>
												) : (
													<span className="text-xl font-semibold vero-text-gradient">
														€{product.price.toFixed(2)}
													</span>
												)}
											</div>

											{/* View Details Button */}
											<div className="pt-3 border-t border-[#D4AF37]/20">
												<Link
													href={`/product/${product.slug}`}
													className="text-xs text-[#D4AF37] group-hover:text-[#B8941F] font-medium uppercase tracking-wider transition-colors duration-300 flex items-center gap-2"
												>
													View Details
													<svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}