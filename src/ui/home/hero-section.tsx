import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
			{/* Video Background - All Devices */}
			<div className="absolute inset-0">
				<video muted playsInline autoPlay loop className="absolute inset-0 w-full h-full object-cover">
					<source src="/Generated File October 19, 2025 - 2_39PM.mp4" type="video/mp4" />
				</video>
			</div>

			{/* Dark Overlay for Video */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

			{/* Floating Elements */}
			<div className="absolute inset-0 opacity-5 lg:opacity-10">
				<div className="absolute top-20 left-20 w-64 h-64 border border-[var(--vero-gold-accent)] rounded-full animate-float" />
				<div className="absolute bottom-20 right-20 w-48 h-48 border border-[var(--vero-gold-accent)] rounded-full animate-float delay-1000" />
			</div>

			{/* Content */}
			<div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-16">
				<div className="text-center text-white space-y-4 sm:space-y-6 max-w-4xl mx-auto">
					{/* Main Heading */}
					<div className="space-y-2 sm:space-y-3">
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight">
							Collect The
							<span className="block mt-1 sm:mt-2 vero-elegant-text">Extraordinary</span>
						</h1>
						<p className="text-sm sm:text-base lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
							Discover exclusive die-cast model cars from legendary brands. Limited editions, rare
							collectibles, and pre-order releases.
						</p>
					</div>

					{/* CTAs - Compact & Side by Side */}
					<div className="flex flex-row gap-3 justify-center items-center pt-2">
						<Link
							href="#categories"
							className="inline-flex items-center justify-center gap-2 vero-button-gold text-xs sm:text-sm rounded-lg px-5 py-2.5 sm:px-6 sm:py-3 whitespace-nowrap"
						>
							Shop Now
							<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Link>
						<Link
							href="/category/new-arrivals"
							className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border-2 border-white/30 hover:border-[var(--vero-gold-accent)] transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm whitespace-nowrap"
						>
							New Arrivals
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
