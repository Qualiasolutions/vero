"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
	const videoRef = useRef<HTMLVideoElement>(null);

	const videoSrc = "/Generated File October 19, 2025 - 2_39PM.mp4";

	useEffect(() => {
		// Ensure video plays smoothly
		if (videoRef.current) {
			videoRef.current.play().catch((error) => {
				console.error("Video autoplay failed:", error);
			});
		}
	}, []);

	return (
		<div className="relative aspect-video rounded-lg overflow-hidden">
			<video
				ref={videoRef}
				muted
				playsInline
				autoPlay
				loop
				className="absolute inset-0 w-full h-full object-cover"
			>
				<source src={videoSrc} type="video/mp4" />
			</video>

			{/* Car Title Overlay */}
			<div className="absolute bottom-4 left-4 right-4 z-10">
				<div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-[#D4AF37]/20">
					<h3 className="text-white font-semibold text-sm md:text-base vero-elegant-text">
						Premium Collection
					</h3>
				</div>
			</div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
		</div>
	);
}
