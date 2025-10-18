"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
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

export function FavoriteButton({ product, className = "" }: FavoriteButtonProps) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const isProductFavorite = isFavorite(product.id);

	const handleToggleFavorite = () => {
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
				"flex items-center justify-center gap-2 rounded-lg px-6 py-3 transition-all duration-300 border-2",
				isProductFavorite
					? "bg-[#D4AF37] border-[#D4AF37] text-white hover:bg-[#E6C757] hover:border-[#E6C757]"
					: "bg-white border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]",
				className,
			)}
			aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
		>
			<Heart className={cn("h-5 w-5", isProductFavorite && "fill-current")} />
			{isProductFavorite ? "Remove from Favorites" : "Add to Favorites"}
		</button>
	);
}
