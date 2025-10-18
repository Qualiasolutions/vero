"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/favorites-context";

export function FavoritesIcon() {
	const { favorites } = useFavorites();
	const itemCount = favorites.length;

	return (
		<Link
			href="/favorites"
			className="relative text-[#D4AF37] hover:text-[#E6C757] transition-all duration-300 hover:scale-110"
			aria-label={`Favorites (${itemCount} items)`}
		>
			<Heart className="w-5 h-5" />
			{itemCount > 0 && (
				<span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-white">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
