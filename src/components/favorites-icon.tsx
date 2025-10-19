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
			className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#B8941F]/10 transition-all duration-300 group"
			aria-label={`Favorites (${itemCount} items)`}
		>
			<Heart className="w-5 h-5 text-[#6C757D] group-hover:text-[#B8941F] group-hover:fill-[#B8941F]/20 transition-all duration-300" strokeWidth={1.5} />
			{itemCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#B8941F] to-[#8B7015] text-[10px] font-semibold text-white shadow-lg">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
