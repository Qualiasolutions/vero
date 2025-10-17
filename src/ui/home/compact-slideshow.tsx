"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Slide {
	id: number;
	type: "image" | "video";
	src: string;
	title: string;
	subtitle?: string;
	link: string;
}

const slides: Slide[] = [
	{
		id: 1,
		type: "image",
		src: "https://i.ibb.co/fGNyxD4G/Generated-Image-October-09-2025-3-07-PM-1.png",
		title: "Premium Collection",
		subtitle: "1:18 Scale Masterpieces",
		link: "/products",
	},
	{
		id: 2,
		type: "image",
		src: "https://i.ibb.co/Q7dwWyb4/Generated-Image-October-09-2025-3-08-PM.png",
		title: "Limited Editions",
		subtitle: "Exclusive Releases",
		link: "/category/limited-edition",
	},
	{
		id: 3,
		type: "image",
		src: "https://i.ibb.co/G4rtyXc0/Generated-Image-October-09-2025-3-13-PM.png",
		title: "Pre-Order Now",
		subtitle: "Reserve Today",
		link: "/category/pre-order",
	},
];

export function CompactSlideshow() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPlaying] = useState(true);

	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);

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
		<section className="relative w-full h-[180px] md:h-[220px] overflow-hidden bg-[#0A0A0A] rounded-lg">
			{/* Slides */}
			{slides.map((slide, index) => (
				<Link
					key={slide.id}
					href={slide.link}
					className={cn(
						"absolute inset-0 transition-opacity duration-700",
						index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
					)}
				>
					{slide.type === "image" ? (
						<>
							<Image
								src={slide.src}
								alt={slide.title}
								fill
								className="object-cover"
								priority={index === 0}
								sizes="100vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
						</>
					) : (
						<video
							src={slide.src}
							className="absolute inset-0 w-full h-full object-cover"
							autoPlay
							muted
							loop
							playsInline
						/>
					)}

					{/* Content */}
					<div className="relative z-10 h-full flex items-center px-6">
						<div className="max-w-md">
							<h2 className="text-xl md:text-2xl font-semibold text-white uppercase tracking-wide mb-1">
								{slide.title}
							</h2>
							{slide.subtitle && (
								<p className="text-sm md:text-base text-[#F5E6D3] font-light">{slide.subtitle}</p>
							)}
						</div>
					</div>
				</Link>
			))}

			{/* Navigation Buttons */}
			<button
				onClick={(e) => {
					e.preventDefault();
					prevSlide();
				}}
				className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] transition-all"
				aria-label="Previous slide"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<button
				onClick={(e) => {
					e.preventDefault();
					nextSlide();
				}}
				className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] transition-all"
				aria-label="Next slide"
			>
				<ChevronRight className="h-4 w-4" />
			</button>

			{/* Dot Indicators */}
			<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
				{slides.map((slide, index) => (
					<button
						key={slide.id}
						onClick={(e) => {
							e.preventDefault();
							goToSlide(index);
						}}
						className={cn(
							"w-2 h-2 rounded-full transition-all duration-300",
							index === currentSlide ? "bg-[#D4AF37] w-6" : "bg-white/40 hover:bg-white/60",
						)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
}
