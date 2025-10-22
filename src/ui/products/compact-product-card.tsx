"use client";

import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";

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

export function CompactProductCard({ product, currency = "AED" }: CompactProductCardProps) {
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
			<Card className="vero-card overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
				<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
					{/* Badge using Shadcn Badge */}
					{badge && (
						<div className="absolute top-2 left-2 z-10">
							<Badge
								variant="secondary"
								className={cn(
									"px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-lg",
									badge.color,
								)}
							>
								{badge.text}
							</Badge>
						</div>
					)}

					{/* Favorite Button using Shadcn Button */}
					<Button
						variant="outline"
						size="sm"
						onClick={handleToggleFavorite}
						className={cn(
							"absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-md",
							isFavorite(product.id)
								? "bg-[#D4AF37] text-white border-[#D4AF37] hover:bg-[#B8941F]"
								: "bg-white/90 text-[#6C757D] border-white hover:bg-white hover:text-[#D4AF37]",
						)}
						aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
						title={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
					>
						<Heart className={cn("h-4 w-4 transition-all", isFavorite(product.id) && "fill-current")} />
					</Button>

					{/* Product Image with enhanced hover */}
					<div className="relative h-full w-full">
						<Image
							src={imageUrl}
							alt={product.name}
							fill
							className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
							sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
						/>
						{/* Enhanced overlay with gold glow effect */}
						<div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 via-transparent to-transparent group-hover:from-[#D4AF37]/10 transition-all duration-500"></div>
					</div>

					{/* Pre-order Release Date Overlay */}
					{isPreorder && product.metadata?.releaseDate && (
						<div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[#D4AF37] p-2 text-[10px] text-center uppercase tracking-wider font-semibold border-t border-[#D4AF37]/30">
							Release: {product.metadata.releaseDate}
						</div>
					)}
				</div>

				<CardContent className="p-4 space-y-3">
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
									<span className="text-lg font-semibold vero-text-gradient">
										{currency}
										{(product.price / 100).toFixed(2)}
									</span>
									<span className="text-xs text-[#6C757D] line-through">
										{currency}
										{(originalPrice / 100).toFixed(2)}
									</span>
									<Badge
										variant="secondary"
										className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded"
									>
										-{Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
									</Badge>
								</>
							) : (
								<span className="text-lg font-semibold vero-text-gradient">
									{currency}
									{(product.price / 100).toFixed(2)}
								</span>
							)}
						</div>

						{/* Quick Add to Cart Button using Shadcn Button */}
						<Button
							variant="default"
							size="sm"
							onClick={handleAddToCart}
							className="flex-shrink-0 vero-button p-2 hover:scale-110 transition-all duration-300"
							aria-label="Add to cart"
							title="Add to cart"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
