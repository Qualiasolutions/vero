"use client";

import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

interface CompactProductCardProps {
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

export function CompactProductCard({ product, currency = "€" }: CompactProductCardProps) {
	const { optimisticAdd } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const isOnSale = product.metadata?.onSale === "true";
	const isPreorder = product.metadata?.preorder === "true";
	const originalPrice = product.metadata?.originalPrice ? parseFloat(product.metadata.originalPrice) : null;

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent Link navigation
		e.stopPropagation();
		try {
			await optimisticAdd(product.id, 1, {
				id: product.id,
				name: product.name,
				images: product.images,
			});
		} catch (error) {
			console.error("Failed to add to cart:", error);
		}
	};

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent Link navigation
		e.stopPropagation();
		toggleFavorite({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			images: product.images,
			metadata: product.metadata,
		});
	};

	// Determine badge based on product metadata - Professional Vero palette
	const getBadge = () => {
		const category = product.metadata?.category?.toLowerCase();

		if (isOnSale) {
			return { text: "SALE", color: "bg-[#B8941F] text-white shadow-md" };
		}
		if (isPreorder && product.metadata?.releaseDate) {
			return { text: "PRE-ORDER", color: "bg-[#2A2A2A] text-[#F5E6D3] border border-[#D4AF37]/20" };
		}
		if (category?.includes("rare") || product.name.toLowerCase().includes("rare")) {
			return { text: "RARE", color: "bg-gradient-to-r from-[#D4AF37] to-[#E6C757] text-white shadow-lg" };
		}
		if (category?.includes("limited") || product.name.toLowerCase().includes("limited")) {
			return { text: "LIMITED", color: "bg-[#0A0A0A] border-2 border-[#D4AF37] text-[#D4AF37]" };
		}
		if (category?.includes("new") || category?.includes("collection")) {
			return { text: "NEW", color: "bg-[#F5E6D3] text-[#B8941F] border border-[#D4AF37]/30" };
		}
		return null;
	};

	const badge = getBadge();
	const imageUrl = product.images[0] || "/placeholder-car.jpg";

	return (
		<Link href={`/product/${product.slug}`} className="group block">
			<div className="vero-card overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.03]">
				<div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
					{/* Badge */}
					{badge && (
						<div className="absolute top-2 left-2 z-10">
							<div
								className={cn(
									"px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-lg",
									badge.color,
								)}
							>
								{badge.text}
							</div>
						</div>
					)}

					{/* Favorite Button - Vero Gold Theme */}
					<button
						onClick={handleToggleFavorite}
						className={cn(
							"absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-md",
							isFavorite(product.id)
								? "bg-[#D4AF37] text-white"
								: "bg-white/90 text-[#6C757D] hover:bg-white hover:text-[#D4AF37]",
						)}
						aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
						title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
					>
						<Heart className={cn("h-4 w-4 transition-all", isFavorite(product.id) && "fill-current")} />
					</button>

					{/* Product Image */}
					<Image
						src={imageUrl}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>

					{/* Overlay gradient for better visual depth */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="p-4 space-y-2 bg-white">
					{/* Brand */}
					{product.metadata?.brand && (
						<div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold">
							{product.metadata.brand}
						</div>
					)}

					{/* Product Name */}
					<h3 className="font-medium text-sm md:text-base leading-snug line-clamp-2 text-[#212529] group-hover:text-[#D4AF37] transition-colors duration-300">
						{product.name}
					</h3>

					{/* Pricing and Add to Cart */}
					<div className="flex items-center justify-between gap-2 pt-1">
						<div className="flex items-baseline gap-1.5">
							{isOnSale && originalPrice && originalPrice > product.price ? (
								<>
									<span className="text-lg font-semibold text-[#D4AF37]">
										{currency}
										{product.price.toFixed(2)}
									</span>
									<span className="text-xs text-gray-400 line-through">
										{currency}
										{originalPrice.toFixed(2)}
									</span>
								</>
							) : (
								<span className="text-lg font-semibold text-[#D4AF37]">
									{currency}
									{product.price.toFixed(2)}
								</span>
							)}
						</div>

						{/* Quick Add to Cart Button */}
						<button
							onClick={handleAddToCart}
							className="flex-shrink-0 p-2 rounded-md bg-[#D4AF37] hover:bg-[#B8941F] text-white transition-all duration-300 hover:scale-110 shadow-md hover:shadow-xl"
							aria-label="Add to cart"
							title="Add to cart"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
}
