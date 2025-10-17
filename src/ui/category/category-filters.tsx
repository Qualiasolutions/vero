"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFiltersProps {
	onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
	priceRange: string;
	availability: string[];
	sortBy: string;
}

export function CategoryFilters({ onFilterChange }: CategoryFiltersProps) {
	const [isPriceOpen, setIsPriceOpen] = useState(true);
	const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
	const [filters, setFilters] = useState<FilterState>({
		priceRange: "all",
		availability: [],
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

	return (
		<aside className="w-full lg:w-64 space-y-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold tracking-wide uppercase text-gray-900 flex items-center gap-2">
					<SlidersHorizontal className="h-5 w-5 text-[#D4AF37]" />
					Filters
				</h2>
			</div>

			{/* Sort By */}
			<div className="space-y-3">
				<label className="text-sm font-medium text-gray-700 uppercase tracking-wide">Sort By</label>
				<Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate({ sortBy: value })}>
					<SelectTrigger className="w-full">
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

			{/* Price Range */}
			<Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
				<CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-gray-200 hover:border-[#D4AF37] transition-colors">
					<span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Price Range</span>
					<ChevronDown
						className={`h-4 w-4 text-gray-500 transition-transform ${isPriceOpen ? "rotate-180" : ""}`}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-4 space-y-3">
					<Select
						value={filters.priceRange}
						onValueChange={(value) => handleFilterUpdate({ priceRange: value })}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Prices</SelectItem>
							<SelectItem value="0-50">Under $50</SelectItem>
							<SelectItem value="50-100">$50 - $100</SelectItem>
							<SelectItem value="100-200">$100 - $200</SelectItem>
							<SelectItem value="200+">$200+</SelectItem>
						</SelectContent>
					</Select>
				</CollapsibleContent>
			</Collapsible>

			{/* Availability */}
			<Collapsible open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
				<CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b border-gray-200 hover:border-[#D4AF37] transition-colors">
					<span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Availability</span>
					<ChevronDown
						className={`h-4 w-4 text-gray-500 transition-transform ${isAvailabilityOpen ? "rotate-180" : ""}`}
					/>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-4 space-y-3">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="in-stock"
							checked={filters.availability.includes("in-stock")}
							onCheckedChange={(checked) => handleAvailabilityToggle("in-stock", checked as boolean)}
						/>
						<label htmlFor="in-stock" className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
							In Stock
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="pre-order"
							checked={filters.availability.includes("pre-order")}
							onCheckedChange={(checked) => handleAvailabilityToggle("pre-order", checked as boolean)}
						/>
						<label htmlFor="pre-order" className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
							Pre-Order
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="limited"
							checked={filters.availability.includes("limited")}
							onCheckedChange={(checked) => handleAvailabilityToggle("limited", checked as boolean)}
						/>
						<label htmlFor="limited" className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
							Limited Edition
						</label>
					</div>
				</CollapsibleContent>
			</Collapsible>

			{/* Clear Filters */}
			<Button
				variant="outline"
				className="w-full mt-4"
				onClick={() =>
					handleFilterUpdate({
						priceRange: "all",
						availability: [],
						sortBy: "featured",
					})
				}
			>
				Clear All Filters
			</Button>
		</aside>
	);
}
