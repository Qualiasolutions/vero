import { ArrowRight, Award, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative w-full min-h-[85vh] bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-20 left-20 w-96 h-96 border border-[#D4AF37] rounded-full animate-float" />
				<div className="absolute bottom-20 right-20 w-64 h-64 border border-[#D4AF37] rounded-full animate-float delay-1000" />
				<div className="absolute top-1/2 left-1/3 w-48 h-48 border border-[#E6C757] rounded-full animate-float delay-2000" />
			</div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />

			<div className="relative z-10 max-w-[1600px] mx-auto px-4 py-16 lg:py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="text-white space-y-8">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 backdrop-blur-sm">
							<Star className="w-4 h-4 text-[#D4AF37]" fill="#D4AF37" />
							<span className="text-sm font-medium text-[#E6C757]">Premium 1:18 Scale Die-Cast Models</span>
						</div>

						{/* Main Heading */}
						<div className="space-y-4">
							<h1 className="text-5xl lg:text-7xl font-light tracking-tight">
								Collect The
								<span className="block mt-2 vero-elegant-text">Extraordinary</span>
							</h1>
							<p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-xl">
								Discover exclusive die-cast model cars from legendary brands. Limited editions, rare
								collectibles, and pre-order releases.
							</p>
						</div>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								href="#categories"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50"
							>
								Shop Collection
								<ArrowRight className="w-5 h-5" />
							</Link>
							<Link
								href="/category/new-arrivals"
								className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
							>
								New Arrivals
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
							<div>
								<div className="text-3xl font-bold text-[#D4AF37]">500+</div>
								<div className="text-sm text-white/60 mt-1">Premium Models</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-[#D4AF37]">50+</div>
								<div className="text-sm text-white/60 mt-1">Top Brands</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-[#D4AF37]">10K+</div>
								<div className="text-sm text-white/60 mt-1">Happy Collectors</div>
							</div>
						</div>
					</div>

					{/* Right Content - Featured Product Showcase */}
					<div className="relative">
						{/* Main Product Card */}
						<div className="relative vero-glass-dark rounded-2xl p-8 backdrop-blur-xl">
							{/* Featured Badge */}
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#E6C757] text-black font-bold text-sm px-6 py-2 rounded-full shadow-lg">
								FEATURED THIS WEEK
							</div>

							{/* Product Image */}
							<div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 mb-6 group">
								<Image
									src="https://i.ibb.co/c1KJ2Lm/image-2.webp"
									alt="Featured Model"
									fill
									className="object-contain p-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
									sizes="(max-width: 768px) 100vw, 50vw"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
							</div>

							{/* Product Info */}
							<div className="space-y-4">
								<div>
									<h3 className="text-2xl font-bold text-white mb-2">Ferrari F40 - Rosso Corsa</h3>
									<p className="text-white/60 text-sm">Limited Edition 1:18 Scale Model</p>
								</div>

								{/* Features */}
								<div className="flex flex-wrap gap-2">
									<div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/90">
										<Award className="w-3.5 h-3.5 text-[#D4AF37]" />
										Authentic
									</div>
									<div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/90">
										<Package className="w-3.5 h-3.5 text-[#D4AF37]" />
										Free Shipping
									</div>
									<div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/90">
										<Star className="w-3.5 h-3.5 text-[#D4AF37]" fill="#D4AF37" />
										Limited
									</div>
								</div>

								{/* Price & CTA */}
								<div className="flex items-center justify-between pt-4 border-t border-white/10">
									<div>
										<div className="text-sm text-white/60">Starting at</div>
										<div className="text-3xl font-bold text-[#D4AF37]">€89.99</div>
									</div>
									<Link
										href="/product/ferrari-f40-rosso-corsa"
										className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition-all duration-300 hover:scale-105"
									>
										View Details
										<ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>
						</div>

						{/* Floating Elements */}
						<div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#E6C757] rounded-full blur-3xl opacity-30 animate-pulse" />
						<div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#E6C757] to-[#D4AF37] rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
				<div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
					<div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mx-auto animate-pulse" />
				</div>
			</div>
		</section>
	);
}
