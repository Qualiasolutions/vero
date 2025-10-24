"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { config } from "@/store.config";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";

// Extract unique values from products
export function extractFilterOptions(products: any[]) {
	const brands = [...new Set(products.flatMap((p) => p.metadata?.brand).filter(Boolean))];
	const categories = [...new Set(products.flatMap((p) => p.metadata?.category).filter(Boolean))];

	const priceRanges = [
		{ label: "Under €100", min: 0, max: 100 },
		{ label: "€100 - €300", min: 100, max: 300 },
		{ label: "€300 - €500", min: 300, max: 500 },
		{ label: "Over €500", min: 500, max: Infinity },
	];

	const brandsWithCounts = brands.map((brand) => ({
		name: brand,
		count: products.filter((p) => p.metadata?.brand === brand).length,
	}));

	const categoriesWithCounts = categories.map((category) => ({
		name: category,
		count: products.filter((p) => p.metadata?.category === category).length,
	}));

	return { brands: brandsWithCounts, categories: categoriesWithCounts, priceRanges };
}

interface ProductFiltersProps {
	products: any[];
	filters: {
		search: string;
		category: string;
		brand: string;
		priceRange: { min: number; max: number } | null;
		sortBy: string;
	};
	onFiltersChange: (filters: any) => void;
}

export function ProductFilters({ products, filters, onFiltersChange }: ProductFiltersProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const filterOptions = useMemo(() => extractFilterOptions(products), [products]);

	const activeFilterCount = [filters.category, filters.brand, filters.priceRange, filters.search].filter(
		Boolean,
	).length;

	const handleClearFilters = () => {
		onFiltersChange({
			search: "",
			category: "",
			brand: "",
			priceRange: null,
			sortBy: "name-asc",
		});
	};

	const hasActiveFilters = filters.category || filters.brand || filters.priceRange || filters.search;

	return (
		<div className="bg-white border border-[var(--selfridges-border-light)] rounded-lg p-6 mb-8 shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<SlidersHorizontal className="w-5 h-5 text-[var(--selfridges-text-secondary)]" />
					<h3 className="text-lg font-medium text-[var(--selfridges-text-primary)]">
						Filters{" "}
						{activeFilterCount > 0 && (
							<Badge variant="secondary" className="ml-2 text-xs bg-[var(--vero-gold-accent)]/10 text-black">
								{activeFilterCount} active
							</Badge>
						)}
					</h3>
				</div>

				{hasActiveFilters && (
					<Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs">
						<X className="w-4 h-4 mr-1" />
						Clear All
					</Button>
				)}
			</div>

			{/* Expand/Collapse Toggle */}
			<div className="lg:hidden">
				<Button
					variant="outline"
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full justify-between mb-4"
				>
					<span>Filter Products</span>
					<ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
				</Button>
			</div>

			{/* Filter Content */}
			<div className={cn("space-y-6", isExpanded ? "block" : "hidden lg:block")}>
				{/* Search Bar */}
				<div>
					<label className="block text-sm font-medium text-[var(--selfridges-text-secondary)] mb-2">
						Search
					</label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--selfridges-text-muted)]" />
						<input
							type="text"
							placeholder="Search models..."
							value={filters.search}
							onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
							className="w-full pl-10 pr-4 py-3 border border-[var(--selfridges-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--vero-gold-accent)]/20 focus:border-[var(--vero-gold-accent)] transition-all duration-200"
						/>
					</div>
				</div>

				{/* Categories */}
				<div>
					<label className="block text-sm font-medium text-[var(--selfridges-text-secondary)] mb-3">
						Category
					</label>
					<div className="flex flex-wrap gap-2">
						{filterOptions.categories.map((category) => {
							const configCategory = config.categories.find((c) => c.slug === category.name);
							return (
								<Button
									key={category.name}
									variant={filters.category === category.name ? "default" : "outline"}
									size="sm"
									onClick={() =>
										onFiltersChange({
											...filters,
											category: filters.category === category.name ? "" : category.name,
										})
									}
									className="text-xs"
								>
									{configCategory?.name || category.name}
									<Badge variant="secondary" className="ml-2 text-xs">
										{category.count}
									</Badge>
								</Button>
							);
						})}
					</div>
				</div>

				{/* Brands */}
				<div>
					<label className="block text-sm font-medium text-[var(--selfridges-text-secondary)] mb-3">
						Brand
					</label>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
						{filterOptions.brands.map((brand) => (
							<Button
								key={brand.name}
								variant={filters.brand === brand.name ? "default" : "outline"}
								size="sm"
								onClick={() =>
									onFiltersChange({ ...filters, brand: filters.brand === brand.name ? "" : brand.name })
								}
								className="text-xs justify-start"
							>
								{brand.name}
								<Badge variant="secondary" className="ml-auto text-xs">
									{brand.count}
								</Badge>
							</Button>
						))}
					</div>
				</div>

				{/* Price Range */}
				<div>
					<label className="block text-sm font-medium text-[var(--selfridges-text-secondary)] mb-3">
						Price Range
					</label>
					<div className="grid grid-cols-2 gap-2">
						{filterOptions.priceRanges.map((range) => (
							<Button
								key={`${range.min}-${range.max}`}
								variant={
									filters.priceRange &&
									filters.priceRange.min === range.min &&
									filters.priceRange.max === range.max
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() =>
									onFiltersChange({
										...filters,
										priceRange:
											filters.priceRange &&
											filters.priceRange.min === range.min &&
											filters.priceRange.max === range.max
												? null
												: range,
									})
								}
								className="text-xs"
							>
								{range.label}
							</Button>
						))}
					</div>
				</div>

				{/* Sort Options */}
				<div>
					<label className="block text-sm font-medium text-[var(--selfridges-text-secondary)] mb-3">
						Sort By
					</label>
					<select
						value={filters.sortBy}
						onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
						className="w-full py-3 px-4 border border-[var(--selfridges-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--vero-gold-accent)]/20 focus:border-[var(--vero-gold-accent)] transition-all duration-200 bg-white"
					>
						<option value="name-asc">Name (A-Z)</option>
						<option value="name-desc">Name (Z-A)</option>
						<option value="price-asc">Price (Low to High)</option>
						<option value="price-desc">Price (High to Low)</option>
						<option value="brand">Brand</option>
					</select>
				</div>
			</div>
		</div>
	);
}
