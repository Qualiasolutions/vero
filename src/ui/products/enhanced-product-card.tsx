"use client";

import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";

interface EnhancedProductCardProps {
	product: {
		id: string;
		name: string;
		slug: string;
		price: number;
		images: string[];
		metadata?: {
			originalPrice?: string;
			onSale?: string;
			preorder?: string;
			brand?: string;
			releaseDate?: string;
			category?: string;
		};
	};
	currency?: string;
}

export function EnhancedProductCard({ product, currency = "EUR" }: EnhancedProductCardProps) {
	const isOnSale = product.metadata?.onSale === "true";
	const isPreorder = product.metadata?.preorder === "true";
	const originalPrice = product.metadata?.originalPrice ? parseFloat(product.metadata.originalPrice) : null;

	// Determine badge based on product metadata - Selfridges-inspired palette
	const getBadge = () => {
		const category = product.metadata?.category?.toLowerCase();

		if (isOnSale) {
			return { text: "SPECIAL PRICE", color: "bg-[var(--vero-gold-accent-dark)] text-white shadow-md" };
		}
		if (isPreorder && product.metadata?.releaseDate) {
			return {
				text: "PRE-ORDER",
				color:
					"bg-[var(--selfridges-black)] text-[var(--selfridges-cream)] border border-[var(--vero-gold-accent)]/20",
			};
		}
		if (category?.includes("rare") || product.name.toLowerCase().includes("rare")) {
			return {
				text: "RARE",
				color:
					"bg-gradient-to-r from-[var(--vero-gold-accent)] to-[var(--vero-gold-accent-light)] text-white shadow-lg",
			};
		}
		if (category?.includes("limited") || product.name.toLowerCase().includes("limited")) {
			return {
				text: "LIMITED EDITION",
				color: "bg-[var(--selfridges-black)] border-2 border-[var(--vero-gold-accent)] text-black",
			};
		}
		if (category?.includes("collection") || category?.includes("new")) {
			return {
				text: "NEW ARRIVAL",
				color: "bg-[var(--selfridges-cream)] text-black border border-[var(--vero-gold-accent)]/30",
			};
		}
		return null;
	};

	const badge = getBadge();
	const imageUrl = product.images[0] || "/placeholder-car.jpg";

	return (
		<div className="group relative">
			<Link href={`/product/${product.slug}`} className="block">
				<div className="vero-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
					<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--selfridges-black)] to-[var(--selfridges-gray-medium)]">
						{/* Badge - Selfridges-inspired Styling */}
						{badge && (
							<div className="absolute top-3 left-3 z-10">
								<Badge
									variant="secondary"
									className={cn(
										"px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm",
										badge.color,
									)}
								>
									{badge.text}
								</Badge>
							</div>
						)}

						{/* Product Image with Gold Border Effect */}
						<div className="relative h-full w-full border-2 border-transparent group-hover:border-[var(--vero-gold-accent)]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_var(--vero-gold-accent-glow)]">
							<Image
								src={imageUrl}
								alt={product.name}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
							{/* Overlay glow effect on hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--vero-gold-accent)]/0 via-transparent to-transparent group-hover:from-[var(--vero-gold-accent)]/10 transition-all duration-500"></div>
						</div>

						{/* Pre-order Release Date Overlay */}
						{isPreorder && product.metadata?.releaseDate && (
							<div className="absolute bottom-0 left-0 right-0 bg-[var(--selfridges-black)]/90 text-black p-2 text-xs text-center uppercase tracking-wider font-semibold border-t border-[var(--vero-gold-accent)]/30 backdrop-blur-sm">
								Release: {product.metadata.releaseDate}
							</div>
						)}

						{/* Quick Action Buttons Overlay */}
						<div className="absolute inset-0 flex items-center justify-center bg-[var(--selfridges-black)]/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
							<div className="flex gap-3 p-4">
								<Button
									variant="outline"
									className="flex h-11 w-11 items-center justify-center rounded-full border-white/40 bg-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:border-[var(--vero-gold-accent)]"
								>
									<Heart className="h-5 w-5" />
								</Button>
								<Button
									variant="outline"
									className="flex h-11 w-11 items-center justify-center rounded-full border-white/40 bg-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:border-[var(--vero-gold-accent)]"
								>
									<Eye className="h-5 w-5" />
								</Button>
								<Button
									variant="default"
									className="flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold uppercase tracking-wide transition-all duration-300 bg-[var(--vero-gold-accent)] text-black hover:bg-[var(--vero-gold-accent-dark)] border-0"
								>
									<Eye className="h-5 w-5" />
									Add to Cart
								</Button>
							</div>
						</div>
					</div>

					<div className="p-4 sm:p-5 space-y-3 bg-white">
						{/* Brand */}
						{product.metadata?.brand && (
							<div className="text-xs text-[var(--selfridges-text-secondary)]/70 uppercase tracking-[0.2em] font-light">
								{product.metadata.brand}
							</div>
						)}

						{/* Product Name */}
						<h3 className="font-light text-sm sm:text-base leading-snug line-clamp-2 text-[var(--selfridges-text-primary)] transition-colors duration-300 tracking-wide">
							{product.name}
						</h3>

						{/* Pricing */}
						<div className="flex items-baseline gap-2 pt-1">
							{isOnSale && originalPrice && originalPrice > product.price ? (
								<>
									<span className="text-xl font-semibold text-[var(--selfridges-text-primary)]">
										{currency}
										{product.price.toFixed(2)}
									</span>
									<span className="text-sm text-[var(--selfridges-text-muted)] line-through">
										{currency}
										{originalPrice.toFixed(2)}
									</span>
									<Badge
										variant="secondary"
										className="text-xs text-black bg-[var(--vero-gold-accent)]/10 px-2 py-0.5 rounded"
									>
										-{Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
									</Badge>
								</>
							) : (
								<span className="text-xl font-semibold text-[var(--selfridges-text-primary)]">
									{currency}
									{product.price.toFixed(2)}
								</span>
							)}
						</div>

						{/* Details Link */}
						<div className="pt-3 border-t border-[var(--selfridges-border-light)]">
							<span className="text-xs text-[var(--selfridges-text-secondary)] group-hover:text-[var(--selfridges-text-primary)] font-medium uppercase tracking-wider transition-colors duration-300 flex items-center gap-2">
								View Details
								<svg
									className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
