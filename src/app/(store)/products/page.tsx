"use client";

import { ArrowRight, Grid3x3, LayoutGrid, Search, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "@/lib/product-service";
import ProductFiltersClient from "@/ui/products/product-filters-client";
import { ProductList } from "@/ui/products/product-list";

export default function AllProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filters, setFilters] = useState({
		search: "",
		category: "",
		brand: "",
		priceRange: null as { min: number; max: number } | null,
		sortBy: "name-asc",
	});

	// Load products on mount
	useEffect(() => {
		async function loadProducts() {
			try {
				const result = await getProducts(100);
				setProducts(result.data || []);
				console.log(`✅ Loaded ${result.data?.length || 0} products from Stripe on /products`);
			} catch (error) {
				console.error("Error loading products:", error);
				setProducts([]);
			}
		}

		loadProducts();
	}, []);

	// Apply filters and sorting
	const filteredProducts = useMemo(() => {
		let filtered = products.filter((product) => {
			// Search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const nameMatch = product.name.toLowerCase().includes(searchLower);
				const brandMatch = product.metadata?.brand?.toLowerCase().includes(searchLower);
				const categoryMatch = product.metadata?.category?.toLowerCase().includes(searchLower);

				if (!nameMatch && !brandMatch && !categoryMatch) return false;
			}

			// Category filter
			if (filters.category && product.metadata?.category !== filters.category) {
				return false;
			}

			// Brand filter
			if (filters.brand && product.metadata?.brand !== filters.brand) {
				return false;
			}

			// Price range filter
			if (filters.priceRange) {
				if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
					return false;
				}
			}

			return true;
		});

		// Apply sorting
		return filtered.sort((a, b) => {
			switch (filters.sortBy) {
				case "name-asc":
					return a.name.localeCompare(b.name);
				case "name-desc":
					return b.name.localeCompare(a.name);
				case "price-asc":
					return a.price - b.price;
				case "price-desc":
					return b.price - a.price;
				case "brand":
					return (a.metadata?.brand || "").localeCompare(b.metadata?.brand || "");
				default:
					return 0;
			}
		});
	}, [products, filters]);

	return (
		<main className="min-h-screen bg-[var(--selfridges-bg-primary)]">
			{/* Hero Section with Background Image */}
			<section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
				{/* Background Image with Parallax Effect */}
				<div className="absolute inset-0">
					<Image
						src="https://i.ibb.co/Z6H98VGZ/Untitled-design-1.png"
						alt="Premium Die-Cast Collection"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					{/* Gradient Overlays for Better Text Readability */}
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
				</div>

				{/* Hero Content */}
				<div className="relative z-10 h-full flex flex-col items-center justify-center px-6 lg:px-12">
					{/* Premium Badge */}
					<div className="inline-flex items-center gap-2 bg-[var(--vero-gold-accent)]/20 border border-[var(--vero-gold-accent)]/50 rounded-full px-6 py-2.5 backdrop-blur-md mb-6 animate-fade-in">
						<Star className="w-5 h-5 text-[var(--vero-gold-accent)]" fill="var(--vero-gold-accent)" />
						<span className="text-sm font-semibold text-white tracking-wide uppercase">
							Complete Collection
						</span>
						<Star className="w-5 h-5 text-[var(--vero-gold-accent)]" fill="var(--vero-gold-accent)" />
					</div>

					{/* Main Heading */}
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white text-center mb-4 tracking-tight">
						Explore <span className="vero-elegant-text">All Models</span>
					</h1>

					{/* Subtitle */}
					<p className="text-lg md:text-xl text-white/90 text-center max-w-3xl mb-8 leading-relaxed">
						Discover our exclusive collection of premium 1:18 scale die-cast models from legendary brands
						worldwide
					</p>

					{/* Stats Bar */}
					<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-white mb-1">{products.length}+</div>
							<div className="text-sm text-white/90 uppercase tracking-wide">Premium Models</div>
						</div>
						<div className="hidden md:block w-px h-12 bg-white/20" />
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
							<div className="text-sm text-white/90 uppercase tracking-wide">Top Brands</div>
						</div>
						<div className="hidden md:block w-px h-12 bg-white/20" />
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
							<div className="text-sm text-white/90 uppercase tracking-wide">Authentic</div>
						</div>
					</div>

					{/* CTA Button */}
					<a
						href="#collection"
						className="inline-flex items-center gap-3 bg-[var(--vero-gold-accent)] hover:bg-[var(--vero-gold-accent-dark)] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/50 group"
					>
						<LayoutGrid className="w-5 h-5" />
						<span className="uppercase tracking-wide">Browse Collection</span>
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</a>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-10 left-10 w-32 h-32 border border-[var(--vero-gold-accent)]/30 rounded-full blur-sm animate-float hidden lg:block" />
				<div className="absolute bottom-10 right-10 w-24 h-24 border border-[var(--vero-gold-accent)]/30 rounded-full blur-sm animate-float delay-1000 hidden lg:block" />
			</section>

			{/* Feature Highlights Bar */}
			<section className="w-full border-y border-[var(--vero-gold-accent)]/20 bg-gradient-to-r from-white via-[#FDFBF7] to-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--vero-gold-accent)]/20 to-[var(--vero-gold-accent)]/10 rounded-full flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-[var(--vero-gold-accent)]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#111827]">Limited Editions</p>
								<p className="text-xs text-[#6B7280]">Rare & Exclusive</p>
							</div>
						</div>

						<div className="hidden md:block w-px h-10 bg-[var(--vero-gold-accent)]/20" />

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--vero-gold-accent)]/20 to-[var(--vero-gold-accent)]/10 rounded-full flex items-center justify-center">
								<Grid3x3 className="w-6 h-6 text-[var(--vero-gold-accent)]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#111827]">All Categories</p>
								<p className="text-xs text-[#6B7280]">Complete Range</p>
							</div>
						</div>

						<div className="hidden md:block w-px h-10 bg-[var(--vero-gold-accent)]/20" />

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[var(--vero-gold-accent)]/20 to-[var(--vero-gold-accent)]/10 rounded-full flex items-center justify-center">
								<Search className="w-6 h-6 text-[var(--vero-gold-accent)]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#111827]">Easy Search</p>
								<p className="text-xs text-[#6B7280]">Find Your Model</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Filters and Results */}
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Filters Sidebar */}
					<div className="lg:w-80 flex-shrink-0">
						<ProductFiltersClient products={products} filters={filters} onFiltersChange={setFilters} />
					</div>

					{/* Results */}
					<div className="flex-1">
						{/* Results Header */}
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl md:text-3xl font-light text-[var(--selfridges-text-primary)] uppercase tracking-wider">
								{filteredProducts.length} Premium Model{filteredProducts.length !== 1 ? "s" : ""}
							</h2>
							{filteredProducts.length !== products.length && (
								<p className="text-sm text-[var(--selfridges-text-secondary)]">
									Showing {filteredProducts.length} of {products.length} models
								</p>
							)}
						</div>

						{/* Product Grid */}
						<ProductList products={filteredProducts} />
					</div>
				</div>
			</div>
		</main>
	);
}
