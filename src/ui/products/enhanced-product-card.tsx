"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export function EnhancedProductCard({ product, currency = "€" }: EnhancedProductCardProps) {
	const isOnSale = product.metadata?.onSale === "true";
	const isPreorder = product.metadata?.preorder === "true";
	const originalPrice = product.metadata?.originalPrice ? parseFloat(product.metadata.originalPrice) : null;

	// Determine badge based on product metadata - Professional Vero palette
	const getBadge = () => {
		const category = product.metadata?.category?.toLowerCase();

		if (isOnSale) {
			return { text: "SPECIAL PRICE", color: "bg-[#B8941F] text-white shadow-md" };
		}
		if (isPreorder && product.metadata?.releaseDate) {
			return { text: "PRE-ORDER", color: "bg-[#2A2A2A] text-[#F5E6D3] border border-[#D4AF37]/20" };
		}
		if (category?.includes("rare") || product.name.toLowerCase().includes("rare")) {
			return { text: "RARE", color: "bg-gradient-to-r from-[#D4AF37] to-[#E6C757] text-white shadow-lg" };
		}
		if (category?.includes("limited") || product.name.toLowerCase().includes("limited")) {
			return { text: "LIMITED EDITION", color: "bg-[#0A0A0A] border-2 border-[#D4AF37] text-[#D4AF37]" };
		}
		if (category?.includes("collection") || category?.includes("new")) {
			return { text: "NEW ARRIVAL", color: "bg-[#F5E6D3] text-[#B8941F] border border-[#D4AF37]/30" };
		}
		return null;
	};

	const badge = getBadge();
	const imageUrl = product.images[0] || "/placeholder-car.jpg";

	return (
		<Link href={`/product/${product.slug}`} className="group block">
			<div className="vero-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
				<div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
					{/* Badge - Professional Vero Styling */}
					{badge && (
						<div className="absolute top-3 left-3 z-10">
							<div
								className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm", badge.color)}
							>
								{badge.text}
							</div>
						</div>
					)}

					{/* Product Image with Gold Border Effect */}
					<div className="relative h-full w-full border-2 border-transparent group-hover:border-[#D4AF37]/50 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
						<Image
							src={imageUrl}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>
						{/* Overlay glow effect on hover */}
						<div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 via-transparent to-transparent group-hover:from-[#D4AF37]/10 transition-all duration-500"></div>
					</div>

					{/* Pre-order Release Date Overlay */}
					{isPreorder && product.metadata?.releaseDate && (
						<div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[#D4AF37] p-2 text-xs text-center uppercase tracking-wider font-semibold border-t border-[#D4AF37]/30">
							Release: {product.metadata.releaseDate}
						</div>
					)}
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
									{currency}
									{product.price.toFixed(2)}
								</span>
								<span className="text-sm text-[#6C757D] line-through">
									{currency}
									{originalPrice.toFixed(2)}
								</span>
								<span className="text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded">
									-{Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
								</span>
							</>
						) : (
							<span className="text-xl font-semibold vero-text-gradient">
								{currency}
								{product.price.toFixed(2)}
							</span>
						)}
					</div>

					{/* Details Link */}
					<div className="pt-3 border-t border-[#D4AF37]/20">
						<span className="text-xs text-[#D4AF37] group-hover:text-[#B8941F] font-medium uppercase tracking-wider transition-colors duration-300 flex items-center gap-2">
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
	);
}
