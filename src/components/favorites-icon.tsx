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
			? "group relative inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 text-sm font-semibold text-[#212529] shadow-sm transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20"
			: "group relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#B8941F]/10 transition-all duration-300";

	const iconClasses =
		variant === "pill"
			? "h-5 w-5 text-[#6C757D] transition-all duration-300 group-hover:text-[#B8941F] group-hover:fill-[#B8941F]/15"
			: "h-5 w-5 text-[#6C757D] transition-all duration-300 group-hover:text-[#B8941F] group-hover:fill-[#B8941F]/20";

	return (
		<Link href="/favorites" className={baseClasses} aria-label={`Favorites (${itemCount} items)`}>
			<Heart className={iconClasses} strokeWidth={1.5} />
			{showLabel && (
				<span className="hidden lg:inline text-sm font-medium group-hover:text-[#B8941F]">Favorites</span>
			)}
			{itemCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#B8941F] to-[#8B7015] text-[10px] font-semibold text-white shadow-lg">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
