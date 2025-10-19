import { ArrowRight, Award, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative w-full bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-10 left-20 w-64 h-64 border border-[#D4AF37] rounded-full animate-float" />
				<div className="absolute bottom-10 right-20 w-48 h-48 border border-[#D4AF37] rounded-full animate-float delay-1000" />
			</div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />

			<div className="relative z-10 w-full px-6 lg:px-12 xl:px-16 py-6 lg:py-8">
				<div className="grid lg:grid-cols-2 gap-6 items-center max-w-[1800px] mx-auto">
					{/* Left Content */}
					<div className="text-white space-y-4">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 backdrop-blur-sm">
							<Star className="w-4 h-4 text-[#D4AF37]" fill="#D4AF37" />
							<span className="text-sm font-medium text-[#E6C757]">Premium 1:18 Scale Die-Cast Models</span>
						</div>

						{/* Main Heading */}
						<div className="space-y-2">
							<h1 className="text-3xl lg:text-5xl font-light tracking-tight">
								Collect The
								<span className="block mt-1 vero-elegant-text">Extraordinary</span>
							</h1>
							<p className="text-base lg:text-lg text-white/80 leading-relaxed max-w-xl">
								Discover exclusive die-cast model cars from legendary brands. Limited editions, rare
								collectibles, and pre-order releases.
							</p>
						</div>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row gap-2">
							<Link
								href="#categories"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50 text-sm"
							>
								Shop Collection
								<ArrowRight className="w-4 h-4" />
							</Link>
							<Link
								href="/category/new-arrivals"
								className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg border-2 border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm text-sm"
							>
								New Arrivals
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
							<div>
								<div className="text-xl lg:text-2xl font-bold text-[#D4AF37]">500+</div>
								<div className="text-xs text-white/60 mt-0.5">Premium Models</div>
							</div>
							<div>
								<div className="text-xl lg:text-2xl font-bold text-[#D4AF37]">50+</div>
								<div className="text-xs text-white/60 mt-0.5">Top Brands</div>
							</div>
							<div>
								<div className="text-xl lg:text-2xl font-bold text-[#D4AF37]">10K+</div>
								<div className="text-xs text-white/60 mt-0.5">Happy Collectors</div>
							</div>
						</div>
					</div>

					{/* Right Content - Video Showcase */}
					<div className="relative hidden lg:block">
						{/* Video Container */}
						<div className="relative vero-glass-dark rounded-xl overflow-hidden backdrop-blur-xl border border-[#D4AF37]/20">
							{/* Featured Badge */}
							<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#D4AF37] to-[#E6C757] text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-lg">
								PREMIUM COLLECTION
							</div>

							{/* Video */}
							<div className="relative aspect-video rounded-lg overflow-hidden">
								<video
									autoPlay
									loop
									muted
									playsInline
									className="w-full h-full object-cover"
								>
									<source src="/homepage-video-1.mp4" type="video/mp4" />
									Your browser does not support the video tag.
								</video>
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
							</div>
						</div>

						{/* Floating Elements */}
						<div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#E6C757] rounded-full blur-3xl opacity-30 animate-pulse" />
						<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#E6C757] to-[#D4AF37] rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
					</div>
				</div>
			</div>
		</section>
	);
}
