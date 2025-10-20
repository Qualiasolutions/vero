import { ArrowRight, Grid3x3, LayoutGrid, Search, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import { ProductList } from "@/ui/products/product-list";

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: "All Models - Veromodels",
		description: "Browse our complete collection of premium 1:18 scale diecast model cars",
		alternates: { canonical: `${publicUrl}/products` },
	};
};

export default async function AllProductsPage() {
	let products: any[] = [];

	try {
		const result = await getProducts(100);
		products = result.data || [];
		console.log(`✅ Loaded ${products.length} products from Stripe on /products`);
	} catch (error) {
		console.error("Error loading products:", error);
		products = [];
	}

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section with Background Image */}
			<section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
				{/* Background Image with Parallax Effect */}
				<div className="absolute inset-0">
					<Image
						src="https://i.ibb.co/Z6H98VGZ/Untitled-design-1.png"
						alt="Premium Die-Cast Collection"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					{/* Gradient Overlays for Better Text Readability */}
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
				</div>

				{/* Hero Content */}
				<div className="relative z-10 h-full flex flex-col items-center justify-center px-6 lg:px-12">
					{/* Premium Badge */}
					<div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full px-6 py-2.5 backdrop-blur-md mb-6 animate-fade-in">
						<Star className="w-5 h-5 text-[#D4AF37]" fill="#D4AF37" />
						<span className="text-sm font-semibold text-white tracking-wide uppercase">
							Complete Collection
						</span>
						<Star className="w-5 h-5 text-[#D4AF37]" fill="#D4AF37" />
					</div>

					{/* Main Heading */}
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white text-center mb-4 tracking-tight">
						Explore <span className="vero-elegant-text">All Models</span>
					</h1>

					{/* Subtitle */}
					<p className="text-lg md:text-xl text-white/90 text-center max-w-3xl mb-8 leading-relaxed">
						Discover our exclusive collection of premium 1:18 scale die-cast models from legendary brands
						worldwide
					</p>

					{/* Stats Bar */}
					<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-1">
								{products.length}+
							</div>
							<div className="text-sm text-white/80 uppercase tracking-wide">Premium Models</div>
						</div>
						<div className="hidden md:block w-px h-12 bg-white/20" />
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-1">50+</div>
							<div className="text-sm text-white/80 uppercase tracking-wide">Top Brands</div>
						</div>
						<div className="hidden md:block w-px h-12 bg-white/20" />
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-1">100%</div>
							<div className="text-sm text-white/80 uppercase tracking-wide">Authentic</div>
						</div>
					</div>

					{/* CTA Button */}
					<a
						href="#collection"
						className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/50 group"
					>
						<LayoutGrid className="w-5 h-5" />
						<span className="uppercase tracking-wide">Browse Collection</span>
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</a>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-10 left-10 w-32 h-32 border border-[#D4AF37]/30 rounded-full blur-sm animate-float hidden lg:block" />
				<div className="absolute bottom-10 right-10 w-24 h-24 border border-[#D4AF37]/30 rounded-full blur-sm animate-float delay-1000 hidden lg:block" />
			</section>

			{/* Feature Highlights Bar */}
			<section className="w-full border-y border-[#D4AF37]/20 bg-gradient-to-r from-white via-[#FDFBF7] to-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6C757]/10 rounded-full flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#212529]">Limited Editions</p>
								<p className="text-xs text-[#6C757D]">Rare & Exclusive</p>
							</div>
						</div>

						<div className="hidden md:block w-px h-10 bg-[#D4AF37]/20" />

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6C757]/10 rounded-full flex items-center justify-center">
								<Grid3x3 className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#212529]">All Categories</p>
								<p className="text-xs text-[#6C757D]">Complete Range</p>
							</div>
						</div>

						<div className="hidden md:block w-px h-10 bg-[#D4AF37]/20" />

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6C757]/10 rounded-full flex items-center justify-center">
								<Search className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#212529]">Easy Search</p>
								<p className="text-xs text-[#6C757D]">Find Your Model</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Product Grid Section */}
			<section id="collection" className="w-full bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white py-12">
				<div className="container mx-auto px-4">
					{/* Section Header */}
					<div className="text-center mb-8">
						<h2 className="text-2xl md:text-3xl font-light text-[#212529] uppercase tracking-wider mb-3">
							Our Complete <span className="vero-text-gradient">Collection</span>
						</h2>
						<p className="text-[#6C757D] max-w-2xl mx-auto">
							{products.length} premium die-cast models crafted with precision and authenticity
						</p>
					</div>

					{/* Product List */}
					<ProductList products={products} />
				</div>
			</section>
		</main>
	);
}
