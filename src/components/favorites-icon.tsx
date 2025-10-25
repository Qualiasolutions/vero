"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/favorites-context";

type FavoritesIconVariant = "icon" | "pill";

interface FavoritesIconProps {
	variant?: FavoritesIconVariant;
	showLabel?: boolean;
}

export function FavoritesIcon({ variant = "icon", showLabel = false }: FavoritesIconProps) {
	const { favorites } = useFavorites();
	const itemCount = favorites.length;

	const baseClasses =
		variant === "pill"
			? "group relative inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#dfbc3f]/30 bg-white/10 backdrop-blur-sm px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:border-[#dfbc3f] hover:shadow-lg hover:shadow-[#dfbc3f]/20"
			: "group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#dfbc3f]/30 hover:bg-[#dfbc3f]/20 hover:border-[#dfbc3f] transition-all duration-300 backdrop-blur-sm";

	const iconClasses =
		variant === "pill"
			? "h-5 w-5 text-[#dfbc3f] transition-all duration-300 group-hover:text-[#c4a535] group-hover:fill-[#c4a535]/15"
			: "h-5 w-5 text-[#dfbc3f] transition-all duration-300 group-hover:text-[#c4a535] group-hover:fill-[#c4a535]/20";

	return (
		<Link href="/favorites" className={baseClasses} aria-label={`Favorites (${itemCount} items)`}>
			<Heart className={iconClasses} strokeWidth={1.5} />
			{showLabel && (
				<span className="hidden lg:inline text-sm font-medium group-hover:text-[#dfbc3f]">Favorites</span>
			)}
			{itemCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#dfbc3f] to-[#c4a535] text-[10px] font-semibold text-white shadow-lg">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
