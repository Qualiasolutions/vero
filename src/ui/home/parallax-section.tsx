"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ParallaxSection() {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
			{/* Parallax Background Image */}
			<div
				className="absolute inset-0 will-change-transform"
				style={{
					transform: `translateY(${scrollY * 0.4}px)`,
				}}
			>
				<Image
					src="https://i.ibb.co/fGNyxD4G/Generated-Image-October-09-2025-3-07-PM-1.png"
					alt="Veromodels Collection"
					fill
					className="object-cover scale-110"
					sizes="100vw"
					priority
				/>
				{/* Enhanced Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-white/90" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10" />
			</div>

			{/* Content */}
			<div className="relative z-10 h-full flex items-center justify-center">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide drop-shadow-2xl">
						Elevate Your <span className="vero-elegant-text">Collection</span>
					</h2>
					<p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl mx-auto mb-8 drop-shadow-lg">
						Discover exclusive die-cast models from the world's most prestigious manufacturers. Limited
						editions, rare collectibles, and pre-order releases.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/products"
							className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50 uppercase tracking-wide"
						>
							Explore Collection
						</Link>
						<Link
							href="/about"
							className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/50 hover:border-[#D4AF37] transition-all duration-300 uppercase tracking-wide"
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
