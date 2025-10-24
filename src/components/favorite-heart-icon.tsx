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
		const slug = product.slug ?? product.id;
		const metadata = product.metadata ?? {};
		toggleFavorite({
			id: product.id,
			name: product.name,
			slug,
			price: product.price,
			images: product.images,
			metadata,
		});
	};

	return (
		<button
			onClick={handleToggleFavorite}
			className={cn(
				"absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg",
				isProductFavorite
					? "bg-[#C4A962] hover:bg-[#D4B673] text-white"
					: "bg-white/90 hover:bg-white text-[#6B7280] hover:text-[#C4A962]",
				className,
			)}
			aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
		>
			<Heart className={cn("h-4 w-4", isProductFavorite && "fill-current")} />
		</button>
	);
}
