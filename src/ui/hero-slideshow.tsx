"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Slide {
	id: number;
	image: string;
	title: string;
	subtitle: string;
	cta: {
		text: string;
		href: string;
	};
}

const slides: Slide[] = [
	{
		id: 1,
		image: "https://i.ibb.co/fGNyxD4G/Generated-Image-October-09-2025-3-07-PM-1.png",
		title: "Premium Collection",
		subtitle: "Discover exquisite 1:18 scale die-cast masterpieces",
		cta: {
			text: "Shop Now",
			href: "/products",
		},
	},
	{
		id: 2,
		image: "https://i.ibb.co/Q7dwWyb4/Generated-Image-October-09-2025-3-08-PM.png",
		title: "Limited Editions",
		subtitle: "Rare collectibles from exclusive releases",
		cta: {
			text: "Explore Collection",
			href: "/category/limited-edition",
		},
	},
	{
		id: 3,
		image: "https://i.ibb.co/G4rtyXc0/Generated-Image-October-09-2025-3-13-PM.png",
		title: "Pre-Order Now",
		subtitle: "Reserve upcoming releases before they sell out",
		cta: {
			text: "View Pre-Orders",
			href: "/category/pre-order",
		},
	},
];

export function HeroSlideshow() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	// Auto-play slideshow
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [isPlaying]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
	};

	return (
		<section className="relative w-full h-[280px] md:h-[350px] overflow-hidden bg-[#0A0A0A]">
			{/* Slides */}
			{slides.map((slide, index) => (
				<div
					key={slide.id}
					className={cn(
						"absolute inset-0 transition-opacity duration-1000",
						index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
					)}
				>
					{/* Background Image */}
					<Image
						src={slide.image}
						alt={slide.title}
						fill
						className="object-cover"
						priority={index === 0}
						sizes="100vw"
					/>

					{/* Dark Overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

					{/* Content */}
					<div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 xl:px-12">
						<div className="max-w-xl">
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase tracking-widest mb-2 animate-fade-in">
								{slide.title}
							</h2>
							<p className="text-sm md:text-base text-[#F5E6D3] font-light mb-4 animate-fade-in">
								{slide.subtitle}
							</p>
							<Link
								href={slide.cta.href}
								className="vero-button has-ripple px-5 py-2.5 text-sm rounded-lg inline-block text-center shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 animate-fade-in"
							>
								{slide.cta.text}
							</Link>
						</div>
					</div>
				</div>
			))}

			{/* Left Side Navigation Buttons */}
			<div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
				{/* Previous Button */}
				<button
					onClick={prevSlide}
					className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 shadow-lg"
					aria-label="Previous slide"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				{/* Play/Pause Button */}
				<button
					onClick={() => setIsPlaying(!isPlaying)}
					className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 shadow-lg"
					aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
				>
					{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
				</button>

				{/* Next Button */}
				<button
					onClick={nextSlide}
					className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 shadow-lg"
					aria-label="Next slide"
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>

			{/* Dot Indicators - Bottom Center */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{slides.map((slide, index) => (
					<button
						key={slide.id}
						onClick={() => goToSlide(index)}
						className={cn(
							"w-3 h-3 rounded-full transition-all duration-300",
							index === currentSlide ? "bg-[#D4AF37] w-8" : "bg-white/40 hover:bg-white/60",
						)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
