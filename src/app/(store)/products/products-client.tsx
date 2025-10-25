"use client";

import { ArrowRight, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { BreadcrumbNavigation, generateBreadcrumbs } from "@/components/breadcrumb-navigation";
import type { Product } from "@/lib/product-service";
import ProductFiltersClient from "@/ui/products/product-filters-client";
import { ProductList } from "@/ui/products/product-list";

interface ProductsClientProps {
	initialProducts: Product[];
	locale?: string;
}

export default function ProductsClient({ initialProducts, locale = "en-US" }: ProductsClientProps) {
	const [filters, setFilters] = useState({
		search: "",
		category: "",
		brand: "",
		priceRange: null as { min: number; max: number } | null,
		sortBy: "name-asc",
	});

	// Apply filters and sorting
	const filteredProducts = useMemo(() => {
		let filtered = initialProducts.filter((product) => {
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
	}, [initialProducts, filters]);

	return (
		<main className="min-h-screen bg-gradient-to-b from-[#FAFAF9] via-white to-[#F8F7F4]">
			{/* Luxury Boutique Hero Section */}
			<section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0">
					<Image
						src="https://i.ibb.co/Z6H98VGZ/Untitled-design-1.png"
						alt="Premium Die-Cast Collection"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					{/* Elegant Dark Overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
				</div>

				{/* Refined Hero Content */}
				<div className="relative z-10 h-full flex flex-col items-center justify-center px-6 lg:px-12">
					{/* Elegant Gold Line */}
					<div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--vero-gold-accent)] to-transparent mb-8" />

					{/* Refined Title */}
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white text-center mb-6 tracking-wider uppercase">
						All Models
					</h1>

					{/* Gold Accent Line */}
					<div className="w-32 h-0.5 bg-[var(--vero-gold-accent)] mb-8" />

					{/* Elegant Subtitle */}
					<p className="text-base md:text-lg text-white/80 text-center max-w-2xl leading-relaxed font-light tracking-wide">
						Curated collection of premium 1:18 scale die-cast models
					</p>

					{/* Scroll Indicator */}
					<a
						href="#collection"
						className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
					>
						<span className="text-xs uppercase tracking-widest font-light">Explore</span>
						<ArrowRight className="w-4 h-4 rotate-90 group-hover:translate-y-1 transition-transform" />
					</a>
				</div>
			</section>

			{/* Elegant Divider */}
			<div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--vero-gold-accent)]/30 to-transparent" />

			{/* Premium Filters and Collection */}
			<div id="collection" className="container mx-auto px-4 py-12 lg:py-16">
				{/* Breadcrumb Navigation */}
				<BreadcrumbNavigation items={generateBreadcrumbs("products")} className="mb-8" />

				<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
					{/* Premium Filters Sidebar - Sticky */}
					<aside className="lg:w-80 xl:w-96 flex-shrink-0">
						<div className="lg:sticky lg:top-24 space-y-6">
							{/* Filter Card */}
							<div className="bg-white border border-[var(--vero-gold-accent)]/20 rounded-lg shadow-sm overflow-hidden">
								<div className="bg-gradient-to-r from-[#FAFAF9] to-white border-b border-[var(--vero-gold-accent)]/20 px-6 py-4">
									<h3 className="text-lg font-medium text-[#111827] uppercase tracking-wide flex items-center gap-2">
										<Search className="w-5 h-5 text-[var(--vero-gold-accent)]" />
										Refine Collection
									</h3>
								</div>
								<div className="p-6">
									<ProductFiltersClient
										products={initialProducts}
										filters={filters}
										onFiltersChange={setFilters}
									/>
								</div>
							</div>

							{/* Collection Info */}
							<div className="bg-gradient-to-br from-[var(--vero-gold-accent)]/5 to-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/20 rounded-lg p-6">
								<Sparkles className="w-8 h-8 text-[var(--vero-gold-accent)] mb-3" />
								<h4 className="text-sm font-bold text-[#111827] mb-2 uppercase tracking-wide">
									Premium Collection
								</h4>
								<p className="text-xs text-[#6B7280] leading-relaxed">
									Each model is carefully selected for authenticity and detail. Limited editions available.
								</p>
							</div>
						</div>
					</aside>

					{/* Results Section */}
					<div className="flex-1 min-w-0">
						{/* Results Header with Active Filters */}
						<div className="mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
								<div>
									<h2 className="text-3xl md:text-4xl font-extralight text-[#111827] uppercase tracking-wider mb-2">
										{filteredProducts.length} Model{filteredProducts.length !== 1 ? "s" : ""}
									</h2>
									{filteredProducts.length !== initialProducts.length && (
										<p className="text-sm text-[#6B7280]">
											Filtered from {initialProducts.length} total models
										</p>
									)}
								</div>

								{/* Sort Options */}
								<select
									value={filters.sortBy}
									onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
									className="px-4 py-2 bg-white border border-[var(--vero-gold-accent)]/20 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[var(--vero-gold-accent)]/30 transition-all"
								>
									<option value="name-asc">Name: A-Z</option>
									<option value="name-desc">Name: Z-A</option>
									<option value="price-asc">Price: Low to High</option>
									<option value="price-desc">Price: High to Low</option>
									<option value="brand">Brand</option>
								</select>
							</div>

							{/* Active Filter Chips */}
							{(filters.search || filters.category || filters.brand || filters.priceRange) && (
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-xs text-[#6B7280] uppercase tracking-wide">Active Filters:</span>
									{filters.search && (
										<button
											onClick={() => setFilters({ ...filters, search: "" })}
											className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/30 rounded-full text-xs text-[#111827] hover:bg-[var(--vero-gold-accent)]/20 transition-colors group"
										>
											<span>Search: "{filters.search}"</span>
											<span className="text-[var(--vero-gold-accent)] group-hover:text-[#111827]">×</span>
										</button>
									)}
									{filters.category && (
										<button
											onClick={() => setFilters({ ...filters, category: "" })}
											className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/30 rounded-full text-xs text-[#111827] hover:bg-[var(--vero-gold-accent)]/20 transition-colors group"
										>
											<span>Category: {filters.category}</span>
											<span className="text-[var(--vero-gold-accent)] group-hover:text-[#111827]">×</span>
										</button>
									)}
									{filters.brand && (
										<button
											onClick={() => setFilters({ ...filters, brand: "" })}
											className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/30 rounded-full text-xs text-[#111827] hover:bg-[var(--vero-gold-accent)]/20 transition-colors group"
										>
											<span>Brand: {filters.brand}</span>
											<span className="text-[var(--vero-gold-accent)] group-hover:text-[#111827]">×</span>
										</button>
									)}
									{filters.priceRange && (
										<button
											onClick={() => setFilters({ ...filters, priceRange: null })}
											className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--vero-gold-accent)]/10 border border-[var(--vero-gold-accent)]/30 rounded-full text-xs text-[#111827] hover:bg-[var(--vero-gold-accent)]/20 transition-colors group"
										>
											<span>
												Price: €{filters.priceRange.min}-€{filters.priceRange.max}
											</span>
											<span className="text-[var(--vero-gold-accent)] group-hover:text-[#111827]">×</span>
										</button>
									)}
									<button
										onClick={() =>
											setFilters({
												search: "",
												category: "",
												brand: "",
												priceRange: null,
												sortBy: "name-asc",
											})
										}
										className="text-xs text-[var(--vero-gold-accent)] hover:text-[#A89050] uppercase tracking-wide font-medium transition-colors"
									>
										Clear All
									</button>
								</div>
							)}
						</div>

						{/* Gold Divider */}
						<div className="w-full h-px bg-gradient-to-r from-[var(--vero-gold-accent)]/20 via-[var(--vero-gold-accent)]/40 to-[var(--vero-gold-accent)]/20 mb-8" />

						{/* Product Grid */}
						<ProductList products={filteredProducts} locale={locale} />
					</div>
				</div>
			</div>
		</main>
	);
}
