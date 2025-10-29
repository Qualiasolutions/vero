"use client";

import { useEffect, useState } from "react";
import type { AdDesignType, AdRotatorProps } from "@/types/products";
import { ComingSoonAd } from "./coming-soon-ad";

const adDesigns: AdDesignType[] = [
	"minimalist",
	"detailed",
	"countdown",
	"premium",
	"technical",
	"announcement",
];

export function AdRotator({
	products,
	autoRotate = true,
	rotationInterval = 5000,
	onAdClick,
}: AdRotatorProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// Get the current product and design
	const currentProduct = products[currentIndex];
	const currentDesign = adDesigns[currentIndex % adDesigns.length] as AdDesignType;

	// Auto-rotation logic
	useEffect(() => {
		if (!autoRotate || products.length <= 1) return;

		const interval = setInterval(() => {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
				setIsAnimating(false);
			}, 300); // Animation duration
		}, rotationInterval);

		return () => clearInterval(interval);
	}, [autoRotate, products.length, rotationInterval]);

	// Manual navigation
	const handleNext = () => {
		if (products.length <= 1) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
			setIsAnimating(false);
		}, 300);
	};

	const handlePrevious = () => {
		if (products.length <= 1) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
			setIsAnimating(false);
		}, 300);
	};

	const handleDotClick = (index: number) => {
		if (index === currentIndex) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex(index);
			setIsAnimating(false);
		}, 300);
	};

	if (products.length === 0) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded-lg border border-[#C4A962]/20">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 mx-auto bg-[#C4A962]/20 rounded-full flex items-center justify-center">
						<span className="text-[#C4A962] text-lg">🚗</span>
					</div>
					<p className="text-white/60 text-sm">Coming Soon Products</p>
					<p className="text-white/40 text-xs">Check back later for exciting new arrivals</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full space-y-4">
			{/* Main Ad Display */}
			<div
				className={`relative transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
			>
				{currentProduct && (
					<ComingSoonAd
						product={currentProduct}
						designType={currentDesign}
						onPreorderClick={() => {
							if (onAdClick) {
								onAdClick(currentProduct);
							}
						}}
					/>
				)}
			</div>

			{/* Navigation Controls */}
			{products.length > 1 && (
				<>
					{/* Previous/Next Buttons */}
					<button
						onClick={handlePrevious}
						className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all duration-200 opacity-70 hover:opacity-100"
						aria-label="Previous product"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onClick={handleNext}
						className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all duration-200 opacity-70 hover:opacity-100"
						aria-label="Next product"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>

					{/* Dots Indicator */}
					<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
						{products.map((_, index) => (
							<button
								key={index}
								onClick={() => handleDotClick(index)}
								className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
									index === currentIndex ? "bg-[#C4A962] w-4" : "bg-white/40 hover:bg-white/60"
								}`}
								aria-label={`Go to product ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}

			{/* Product Counter */}
			{products.length > 1 && (
				<div className="absolute top-3 right-3 z-20">
					<div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
						<span className="text-xs text-white/80 font-medium">
							{currentIndex + 1} / {products.length}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
