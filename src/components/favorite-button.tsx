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
				"flex items-center justify-center gap-2 rounded-lg px-6 py-3 transition-all duration-300 border-2",
				isProductFavorite
					? "bg-[#C4A962] border-[#C4A962] text-white hover:bg-[#D4B673] hover:border-[#D4B673]"
					: "bg-white border-[#C4A962]/30 text-[#C4A962] hover:bg-[#C4A962]/10 hover:border-[#C4A962]",
				className,
			)}
			aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
		>
			<Heart className={cn("h-5 w-5", isProductFavorite && "fill-current")} />
			{isProductFavorite ? "Remove from Favorites" : "Add to Favorites"}
		</button>
	);
}
