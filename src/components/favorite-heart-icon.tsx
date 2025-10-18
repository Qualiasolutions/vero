"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

interface FavoriteHeartIconProps {
	product: {
		id: string;
		name: string;
		slug?: string;
		price: number;
		images: string[];
		metadata?: Record<string, string>;
	};
	className?: string;
}

export function FavoriteHeartIcon({ product, className = "" }: FavoriteHeartIconProps) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const isProductFavorite = isFavorite(product.id);

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Toggle favorite (no auth required - uses local storage)
		toggleFavorite({
			id: product.id,
			name: product.name,
			slug: product.slug || product.id,
			price: product.price,
			images: product.images,
			metadata: product.metadata,
		});
	};

	return (
		<button
			onClick={handleToggleFavorite}
			className={cn(
				"absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg",
				isProductFavorite
					? "bg-[#D4AF37] hover:bg-[#E6C757] text-white"
					: "bg-white/90 hover:bg-white text-[#6C757D] hover:text-[#D4AF37]",
				className,
			)}
			aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
		>
			<Heart className={cn("h-4 w-4", isProductFavorite && "fill-current")} />
		</button>
	);
}
