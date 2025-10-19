"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoreConfig from "@/store.config";

interface CategoryFiltersProps {
	onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
	priceRange: string;
	availability: string[];
	brands: string[];
	scales: string[];
	yearRange: string;
	sortBy: string;
}

const SCALE_OPTIONS = ["1:18", "1:43", "1:64", "1:12", "1:24", "Other"];
const YEAR_RANGES = [
	{ label: "All Years", value: "all" },
	{ label: "2024-2025", value: "2024-2025" },
	{ label: "2020-2023", value: "2020-2023" },
	{ label: "2010-2019", value: "2010-2019" },
	{ label: "2000-2009", value: "2000-2009" },
	{ label: "Before 2000", value: "pre-2000" },
];

export function CategoryFilters({ onFilterChange }: CategoryFiltersProps) {
	const [isPriceOpen, setIsPriceOpen] = useState(true);
	const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
	const [isBrandOpen, setIsBrandOpen] = useState(true);
	const [isScaleOpen, setIsScaleOpen] = useState(false);
	const [isYearOpen, setIsYearOpen] = useState(false);
	const [filters, setFilters] = useState<FilterState>({
		priceRange: "all",
		availability: [],
		brands: [],
		scales: [],
		yearRange: "all",
		sortBy: "featured",
	});

	const handleFilterUpdate = (updates: Partial<FilterState>) => {
		const newFilters = { ...filters, ...updates };
		setFilters(newFilters);
		onFilterChange?.(newFilters);
	};

	const handleAvailabilityToggle = (value: string, checked: boolean) => {
		const newAvailability = checked
			? [...filters.availability, value]
			: filters.availability.filter((v) => v !== value);
		handleFilterUpdate({ availability: newAvailability });
	};

	const handleBrandToggle = (value: string, checked: boolean) => {
		const newBrands = checked ? [...filters.brands, value] : filters.brands.filter((v) => v !== value);
		handleFilterUpdate({ brands: newBrands });
	};

	const handleScaleToggle = (value: string, checked: boolean) => {
		const newScales = checked ? [...filters.scales, value] : filters.scales.filter((v) => v !== value);
		handleFilterUpdate({ scales: newScales });
	};

	const getActiveFilterCount = () => {
		let count = 0;
		if (filters.priceRange !== "all") count++;
		if (filters.availability.length > 0) count++;
		if (filters.brands.length > 0) count++;
		if (filters.scales.length > 0) count++;
		if (filters.yearRange !== "all") count++;
		return count;
	};

	const clearAllFilters = () => {
		handleFilterUpdate({
			priceRange: "all",
			availability: [],
			brands: [],
			scales: [],
			yearRange: "all",
			sortBy: "featured",
		});
	};

	const activeFilterCount = getActiveFilterCount();

	return (
		<aside className="w-full lg:w-64 space-y-5">
			{/* Header with Vero Styling */}
			<div className="vero-glass-card rounded-lg p-5 border border-[#D4AF37]/20">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold tracking-wider uppercase text-[#212529] flex items-center gap-2">
						<SlidersHorizontal className="h-5 w-5 text-[#D4AF37]" />
						Filters
						{activeFilterCount > 0 && (
							<span className="ml-2 bg-[#D4AF37] text-white text-xs px-2.5 py-1 rounded-full font-bold animate-fade-in">
								{activeFilterCount}
							</span>
						)}
					</h2>
				</div>
			</div>

			{/* Sort By - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 space-y-3 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<label className="text-sm font-semibold text-[#212529] uppercase tracking-wider flex items-center gap-2">
					Sort By
				</label>
				<Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate({ sortBy: value })}>
					<SelectTrigger className="w-full h-11 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="featured">Featured</SelectItem>
						<SelectItem value="price-low">Price: Low to High</SelectItem>
						<SelectItem value="price-high">Price: High to Low</SelectItem>
						<SelectItem value="newest">Newest First</SelectItem>
						<SelectItem value="name">Name: A-Z</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Price Range - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm font-semibold text-[#212529] uppercase tracking-wider">Price Range</span>
						<ChevronDown
							className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isPriceOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3">
						<Select
							value={filters.priceRange}
							onValueChange={(value) => handleFilterUpdate({ priceRange: value })}
						>
							<SelectTrigger className="w-full h-11 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Prices</SelectItem>
								<SelectItem value="0-75">Under AED 75</SelectItem>
								<SelectItem value="75-150">AED 75 - AED 150</SelectItem>
								<SelectItem value="150-250">AED 150 - AED 250</SelectItem>
								<SelectItem value="250-500">AED 250 - AED 500</SelectItem>
								<SelectItem value="500+">AED 500+</SelectItem>
							</SelectContent>
						</Select>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Brand Filter - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<Collapsible open={isBrandOpen} onOpenChange={setIsBrandOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm font-semibold text-[#212529] uppercase tracking-wider flex items-center gap-2">
							Brand
							{filters.brands.length > 0 && (
								<span className="bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full font-bold">
									{filters.brands.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isBrandOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
						{StoreConfig.brands.map((brand) => (
							<div key={brand} className="flex items-center space-x-2 group/item">
								<Checkbox
									id={`brand-${brand}`}
									checked={filters.brands.includes(brand)}
									onCheckedChange={(checked) => handleBrandToggle(brand, checked as boolean)}
									className="border-[#D4AF37]/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
								/>
								<label
									htmlFor={`brand-${brand}`}
									className="text-sm text-[#6C757D] cursor-pointer hover:text-[#D4AF37] transition-colors flex-1"
								>
									{brand}
								</label>
							</div>
						))}
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Scale Filter - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<Collapsible open={isScaleOpen} onOpenChange={setIsScaleOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm font-semibold text-[#212529] uppercase tracking-wider flex items-center gap-2">
							Scale
							{filters.scales.length > 0 && (
								<span className="bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full font-bold">
									{filters.scales.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isScaleOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3">
						{SCALE_OPTIONS.map((scale) => (
							<div key={scale} className="flex items-center space-x-2 group/item">
								<Checkbox
									id={`scale-${scale}`}
									checked={filters.scales.includes(scale)}
									onCheckedChange={(checked) => handleScaleToggle(scale, checked as boolean)}
									className="border-[#D4AF37]/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
								/>
								<label
									htmlFor={`scale-${scale}`}
									className="text-sm text-[#6C757D] cursor-pointer hover:text-[#D4AF37] transition-colors"
								>
									{scale}
								</label>
							</div>
						))}
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Year Range Filter - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<Collapsible open={isYearOpen} onOpenChange={setIsYearOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm font-semibold text-[#212529] uppercase tracking-wider">Model Year</span>
						<ChevronDown
							className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isYearOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3">
						<Select
							value={filters.yearRange}
							onValueChange={(value) => handleFilterUpdate({ yearRange: value })}
						>
							<SelectTrigger className="w-full h-11 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{YEAR_RANGES.map((range) => (
									<SelectItem key={range.value} value={range.value}>
										{range.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Availability - Enhanced Card */}
			<div className="vero-card rounded-lg p-5 border border-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300">
				<Collapsible open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm font-semibold text-[#212529] uppercase tracking-wider flex items-center gap-2">
							Availability
							{filters.availability.length > 0 && (
								<span className="bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full font-bold">
									{filters.availability.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isAvailabilityOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3">
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="in-stock"
								checked={filters.availability.includes("in-stock")}
								onCheckedChange={(checked) => handleAvailabilityToggle("in-stock", checked as boolean)}
								className="border-[#D4AF37]/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
							/>
							<label
								htmlFor="in-stock"
								className="text-sm text-[#6C757D] cursor-pointer hover:text-[#D4AF37] transition-colors"
							>
								In Stock
							</label>
						</div>
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="pre-order"
								checked={filters.availability.includes("pre-order")}
								onCheckedChange={(checked) => handleAvailabilityToggle("pre-order", checked as boolean)}
								className="border-[#D4AF37]/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
							/>
							<label
								htmlFor="pre-order"
								className="text-sm text-[#6C757D] cursor-pointer hover:text-[#D4AF37] transition-colors"
							>
								Pre-Order
							</label>
						</div>
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="limited"
								checked={filters.availability.includes("limited")}
								onCheckedChange={(checked) => handleAvailabilityToggle("limited", checked as boolean)}
								className="border-[#D4AF37]/30 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
							/>
							<label
								htmlFor="limited"
								className="text-sm text-[#6C757D] cursor-pointer hover:text-[#D4AF37] transition-colors"
							>
								Limited Edition
							</label>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Clear Filters - Enhanced Button */}
			{activeFilterCount > 0 && (
				<Button
					variant="outline"
					className="w-full h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider text-sm hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/20"
					onClick={clearAllFilters}
				>
					<X className="h-4 w-4 mr-2" />
					Clear All Filters
				</Button>
			)}
		</aside>
	);
}
