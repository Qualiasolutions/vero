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
	const [isPriceOpen, setIsPriceOpen] = useState(false);
	const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
	const [isBrandOpen, setIsBrandOpen] = useState(false);
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
		<aside className="w-full lg:w-64 space-y-3 sm:space-y-4">
			{/* Header - Elegant Design */}
			<div className="bg-gradient-to-br from-[#dfbc3f]/5 to-white rounded-xl p-4 sm:p-5 border-2 border-[#dfbc3f]/20 shadow-sm">
				<div className="flex items-center justify-between">
					<h2 className="text-base sm:text-lg font-semibold tracking-wider uppercase text-[var(--selfridges-text-primary)] flex items-center gap-2">
						<div className="p-2 rounded-lg bg-[#dfbc3f]/10">
							<SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-[#dfbc3f]" />
						</div>
						Filters
						{activeFilterCount > 0 && (
							<span className="ml-2 bg-gradient-to-r from-[#dfbc3f] to-[#c4a535] text-black text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
								{activeFilterCount}
							</span>
						)}
					</h2>
				</div>
			</div>

			{/* Sort By - Modern */}
			<div className="bg-white rounded-xl p-4 sm:p-5 space-y-3 border-2 border-[#dfbc3f]/15 hover:border-[#dfbc3f]/30 transition-all duration-300 shadow-sm">
				<label className="text-sm sm:text-base font-semibold text-[var(--selfridges-text-primary)] uppercase tracking-wider flex items-center gap-2">
					Sort By
				</label>
				<Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate({ sortBy: value })}>
					<SelectTrigger className="w-full h-10 sm:h-11 text-sm border-2 border-[#dfbc3f]/20 hover:border-[#dfbc3f] transition-colors rounded-lg">
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

			{/* Price Range - Modern */}
			<div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-[#dfbc3f]/15 hover:border-[#dfbc3f]/30 transition-all duration-300 shadow-sm">
				<Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-sm sm:text-base font-semibold text-[var(--selfridges-text-primary)] uppercase tracking-wider">
							Price Range
						</span>
						<ChevronDown
							className={`h-4 w-4 sm:h-5 sm:w-5 text-[#dfbc3f] transition-transform duration-300 ${isPriceOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-4 space-y-3">
						<Select
							value={filters.priceRange}
							onValueChange={(value) => handleFilterUpdate({ priceRange: value })}
						>
							<SelectTrigger className="w-full h-10 sm:h-11 text-sm border-2 border-[#dfbc3f]/20 hover:border-[#dfbc3f] transition-colors rounded-lg">
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

			{/* Brand Filter - Compact with Scrollable */}
			<div className="vero-card rounded-lg p-3 sm:p-4 border border-[#C4A962]/15 hover:border-[#C4A962]/30 transition-all duration-300">
				<Collapsible open={isBrandOpen} onOpenChange={setIsBrandOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-xs sm:text-sm font-semibold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
							Brand
							{filters.brands.length > 0 && (
								<span className="bg-[#C4A962] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
									{filters.brands.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-3 w-3 sm:h-4 sm:w-4 text-[#C4A962] transition-transform duration-300 ${isBrandOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-3 space-y-2 max-h-32 sm:max-h-48 overflow-y-auto custom-scrollbar">
						{StoreConfig.brands.map((brand) => (
							<div key={brand} className="flex items-center space-x-2 group/item">
								<Checkbox
									id={`brand-${brand}`}
									checked={filters.brands.includes(brand)}
									onCheckedChange={(checked) => handleBrandToggle(brand, checked as boolean)}
									className="border-[#C4A962]/30 data-[state=checked]:bg-[#C4A962] data-[state=checked]:border-[#C4A962]"
								/>
								<label
									htmlFor={`brand-${brand}`}
									className="text-xs sm:text-sm text-[#6B7280] cursor-pointer hover:text-[#C4A962] transition-colors flex-1"
								>
									{brand}
								</label>
							</div>
						))}
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Scale Filter - Compact */}
			<div className="vero-card rounded-lg p-3 sm:p-4 border border-[#C4A962]/15 hover:border-[#C4A962]/30 transition-all duration-300">
				<Collapsible open={isScaleOpen} onOpenChange={setIsScaleOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-xs sm:text-sm font-semibold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
							Scale
							{filters.scales.length > 0 && (
								<span className="bg-[#C4A962] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
									{filters.scales.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-3 w-3 sm:h-4 sm:w-4 text-[#C4A962] transition-transform duration-300 ${isScaleOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-3 space-y-2">
						{SCALE_OPTIONS.map((scale) => (
							<div key={scale} className="flex items-center space-x-2 group/item">
								<Checkbox
									id={`scale-${scale}`}
									checked={filters.scales.includes(scale)}
									onCheckedChange={(checked) => handleScaleToggle(scale, checked as boolean)}
									className="border-[#C4A962]/30 data-[state=checked]:bg-[#C4A962] data-[state=checked]:border-[#C4A962]"
								/>
								<label
									htmlFor={`scale-${scale}`}
									className="text-xs sm:text-sm text-[#6B7280] cursor-pointer hover:text-[#C4A962] transition-colors"
								>
									{scale}
								</label>
							</div>
						))}
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Year Range Filter - Compact */}
			<div className="vero-card rounded-lg p-3 sm:p-4 border border-[#C4A962]/15 hover:border-[#C4A962]/30 transition-all duration-300">
				<Collapsible open={isYearOpen} onOpenChange={setIsYearOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-xs sm:text-sm font-semibold text-[#111827] uppercase tracking-wider">
							Model Year
						</span>
						<ChevronDown
							className={`h-3 w-3 sm:h-4 sm:w-4 text-[#C4A962] transition-transform duration-300 ${isYearOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-3 space-y-2">
						<Select
							value={filters.yearRange}
							onValueChange={(value) => handleFilterUpdate({ yearRange: value })}
						>
							<SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm border-[#C4A962]/20 hover:border-[#C4A962] transition-colors">
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

			{/* Availability - Compact */}
			<div className="vero-card rounded-lg p-3 sm:p-4 border border-[#C4A962]/15 hover:border-[#C4A962]/30 transition-all duration-300">
				<Collapsible open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full group">
						<span className="text-xs sm:text-sm font-semibold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
							Availability
							{filters.availability.length > 0 && (
								<span className="bg-[#C4A962] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
									{filters.availability.length}
								</span>
							)}
						</span>
						<ChevronDown
							className={`h-3 w-3 sm:h-4 sm:w-4 text-[#C4A962] transition-transform duration-300 ${isAvailabilityOpen ? "rotate-180" : ""}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="pt-3 space-y-2">
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="in-stock"
								checked={filters.availability.includes("in-stock")}
								onCheckedChange={(checked) => handleAvailabilityToggle("in-stock", checked as boolean)}
								className="border-[#C4A962]/30 data-[state=checked]:bg-[#C4A962] data-[state=checked]:border-[#C4A962]"
							/>
							<label
								htmlFor="in-stock"
								className="text-xs sm:text-sm text-[#6B7280] cursor-pointer hover:text-[#C4A962] transition-colors"
							>
								In Stock
							</label>
						</div>
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="pre-order"
								checked={filters.availability.includes("pre-order")}
								onCheckedChange={(checked) => handleAvailabilityToggle("pre-order", checked as boolean)}
								className="border-[#C4A962]/30 data-[state=checked]:bg-[#C4A962] data-[state=checked]:border-[#C4A962]"
							/>
							<label
								htmlFor="pre-order"
								className="text-xs sm:text-sm text-[#6B7280] cursor-pointer hover:text-[#C4A962] transition-colors"
							>
								Pre-Order
							</label>
						</div>
						<div className="flex items-center space-x-2 group/item">
							<Checkbox
								id="limited"
								checked={filters.availability.includes("limited")}
								onCheckedChange={(checked) => handleAvailabilityToggle("limited", checked as boolean)}
								className="border-[#C4A962]/30 data-[state=checked]:bg-[#C4A962] data-[state=checked]:border-[#C4A962]"
							/>
							<label
								htmlFor="limited"
								className="text-xs sm:text-sm text-[#6B7280] cursor-pointer hover:text-[#C4A962] transition-colors"
							>
								Limited Edition
							</label>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Clear Filters - Compact Button */}
			{activeFilterCount > 0 && (
				<Button
					variant="outline"
					className="w-full h-9 sm:h-10 border-2 border-[#C4A962] text-[#C4A962] hover:bg-[#C4A962] hover:text-white transition-all duration-300 font-semibold uppercase tracking-wider text-xs sm:text-sm hover:scale-105 hover:shadow-lg hover:shadow-[#C4A962]/20"
					onClick={clearAllFilters}
				>
					<X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
					Clear All
				</Button>
			)}
		</aside>
	);
}
