"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface FavoriteProduct {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[];
	metadata?: Record<string, string>;
}

interface FavoritesContextType {
	favorites: FavoriteProduct[];
	isFavorite: (productId: string) => boolean;
	toggleFavorite: (product: FavoriteProduct) => void;
	clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const FAVORITES_STORAGE_KEY = "veromodels_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load favorites from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as FavoriteProduct[];
				setFavorites(parsed);
			}
		} catch (error) {
			logger.error("Failed to load favorites", { error });
		} finally {
			setIsLoaded(true);
		}
	}, []);

	// Save favorites to localStorage whenever they change
	useEffect(() => {
		if (isLoaded) {
			try {
				localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
			} catch (error) {
				logger.error("Failed to save favorites", { error });
			}
		}
	}, [favorites, isLoaded]);

	const isFavorite = (productId: string): boolean => {
		return favorites.some((fav) => fav.id === productId);
	};

	const toggleFavorite = (product: FavoriteProduct) => {
		setFavorites((prev) => {
			const exists = prev.some((fav) => fav.id === product.id);

			if (exists) {
				// Remove from favorites
				toast.success("Removed from favorites", {
					description: `${product.name} has been removed from your favorites`,
				});
				return prev.filter((fav) => fav.id !== product.id);
			}

			// Add to favorites
			toast.success("Added to favorites", {
				description: `${product.name} has been added to your favorites`,
			});
			return [...prev, product];
		});
	};

	const clearFavorites = () => {
		setFavorites([]);
		toast.success("Favorites cleared", {
			description: "All favorites have been removed",
		});
	};

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				isFavorite,
				toggleFavorite,
				clearFavorites,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
}
