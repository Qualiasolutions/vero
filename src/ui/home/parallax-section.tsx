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
				className="absolute inset-0"
				style={{
					transform: `translateY(${scrollY * 0.5}px)`,
				}}
			>
				<Image
					src="https://i.ibb.co/d4pc3pfB/Generated-Image-October-09-2025-3-08-PM.png"
					alt="Veromodels Collection"
					fill
					className="object-cover scale-110"
					sizes="100vw"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
			</div>

			{/* Content */}
			<div className="relative z-10 h-full flex items-center justify-center">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wide">
						Elevate Your <span className="vero-elegant-text">Collection</span>
					</h2>
					<p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
						Discover exclusive die-cast models from the world's most prestigious manufacturers. Limited
						editions, rare collectibles, and pre-order releases.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/products"
							className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50"
						>
							Explore Collection
						</Link>
						<Link
							href="/about"
							className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
