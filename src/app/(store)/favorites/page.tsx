"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/favorites-context";
import { CompactProductCard } from "@/ui/products/compact-product-card";

export default function FavoritesPage() {
	const { favorites, clearFavorites } = useFavorites();

	if (favorites.length === 0) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
				<div className="mb-6 p-8 rounded-full bg-[#C4A962]/10">
					<Heart className="h-16 w-16 text-[#C4A962]" />
				</div>
				<h1 className="text-3xl md:text-4xl font-light text-[#111827] mb-4 uppercase tracking-wider">
					Your Favorites
				</h1>
				<p className="text-lg text-[#6B7280] mb-8 max-w-md">
					You haven&apos;t added any favorites yet. Start exploring our collection to save your favorite
					models!
				</p>
				<Link
					href="/products"
					className="vero-button inline-flex items-center gap-2 px-8 py-4 rounded-lg shadow-lg"
				>
					<ShoppingBag className="h-5 w-5" />
					Explore Products
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto py-12 px-4">
			{/* Header */}
			<div className="mb-12">
				<div className="flex items-center justify-between border-b border-[#C4A962]/20 pb-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-light text-[#111827] uppercase tracking-wider mb-2">
							Your Favorites
						</h1>
						<p className="text-base text-[#6B7280]">
							{favorites.length} {favorites.length === 1 ? "item" : "items"} saved
						</p>
					</div>
					{favorites.length > 0 && (
						<button
							onClick={clearFavorites}
							className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors duration-300"
						>
							Clear All
						</button>
					)}
				</div>
			</div>

			{/* Favorites Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				{favorites.map((product) => (
					<CompactProductCard key={product.id} product={product} currency="AED" />
				))}
			</div>
		</div>
	);
}
