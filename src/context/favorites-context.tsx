"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[];
	metadata?: {
		originalPrice?: string;
		onSale?: string;
		preorder?: string;
		brand?: string;
		releaseDate?: string;
		category?: string;
	};
}

interface FavoritesContextType {
	favorites: Product[];
	isFavorite: (productId: string) => boolean;
	addFavorite: (product: Product) => void;
	removeFavorite: (productId: string) => void;
	toggleFavorite: (product: Product) => void;
	favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
	children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
	const [favorites, setFavorites] = useState<Product[]>([]);

	// Load favorites from localStorage on mount
	useEffect(() => {
		const loadFavorites = () => {
			try {
				const stored = localStorage.getItem("veromodels-favorites");
				if (stored) {
					setFavorites(JSON.parse(stored));
				}
			} catch (error) {
				console.error("Failed to load favorites:", error);
			}
		};

		loadFavorites();
	}, []);

	// Save favorites to localStorage whenever they change
	useEffect(() => {
		try {
			localStorage.setItem("veromodels-favorites", JSON.stringify(favorites));
		} catch (error) {
			console.error("Failed to save favorites:", error);
		}
	}, [favorites]);

	const isFavorite = (productId: string) => {
		return favorites.some((fav) => fav.id === productId);
	};

	const addFavorite = (product: Product) => {
		setFavorites((prev) => [...prev, product]);
	};

	const removeFavorite = (productId: string) => {
		setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
	};

	const toggleFavorite = (product: Product) => {
		if (isFavorite(product.id)) {
			removeFavorite(product.id);
		} else {
			addFavorite(product);
		}
	};

	const value: FavoritesContextType = {
		favorites,
		isFavorite,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		favoritesCount: favorites.length,
	};

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (context === undefined) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
}