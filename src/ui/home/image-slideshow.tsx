"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
	{
		src: "https://i.ibb.co/Z6H98VGZ/Untitled-design-1.png",
		alt: "Premium Die-Cast Collection 1",
	},
	{
		src: "https://i.ibb.co/jkrPXZxV/Untitled-design-2.png",
		alt: "Premium Die-Cast Collection 2",
	},
	{
		src: "https://i.ibb.co/Z6chcJyV/Untitled-design-3.png",
		alt: "Premium Die-Cast Collection 3",
	},
];

export function ImageSlideshow() {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-white to-[#FDFBF7]">
			<div className="max-w-[1400px] mx-auto">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-light text-[#111827] uppercase tracking-wider mb-4">
						Our Premium <span className="vero-elegant-text">Collection</span>
					</h2>
					<p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
						Discover the finest die-cast models from legendary manufacturers
					</p>
				</div>

				{/* Slideshow Container */}
				<div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden group">
					{/* Slides */}
					{slides.map((slide, index) => (
						<div
							key={index}
							className={`absolute inset-0 transition-opacity duration-1000 ${
								index === currentSlide ? "opacity-100" : "opacity-0"
							}`}
						>
							<Image
								src={slide.src}
								alt={slide.alt}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 90vw"
								priority={index === 0}
							/>
							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
						</div>
					))}

					{/* Navigation Dots */}
					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
						{slides.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentSlide(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentSlide ? "bg-[#C4A962] w-8" : "bg-white/50 hover:bg-white/80"
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>

					{/* Previous/Next Buttons */}
					<button
						onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
						className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
						aria-label="Previous slide"
					>
						<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
						className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
						aria-label="Next slide"
					>
						<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		</section>
	);
}
