import { Award, Eye, Package, Shield, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import { AddToCart } from "@/components/add-to-cart";
import { FavoriteHeartIcon } from "@/components/favorite-heart-icon";
import { publicUrl } from "@/env.mjs";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";
import { HeroSection } from "@/ui/home/hero-section";
import { ImageSlideshow } from "@/ui/home/image-slideshow";
import { InfoBillboard } from "@/ui/home/info-billboard";
import { ParallaxSection } from "@/ui/home/parallax-section";
import { Badge } from "@/ui/shadcn/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/shadcn/marquee";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
	title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
	description:
		"Discover exclusive die-cast model cars from top brands. Pre-order limited editions and rare collectibles.",
};

export default async function Home() {
	// Fetch featured products for homepage
	const allProductsResult = await getProducts(20);
	const allProducts = allProductsResult.data || [];

	// Featured products to showcase
	const featuredProductNames = [
		"Premium Classixxs MAN TGX XXL Blue Metallic",
		"KYOSHO Lamborghini Countach LP400 Red 1974",
		"IXO TOYOTA CALICA GT-FOUR",
		"PARAGON MODELS BMW X4 XDRIVE 3.5d F83 2014",
		"RANGE ROVER SPORT SV EDITION TWO GREY 2024 GT Spirit 1:18",
		"AutoArt ALFA ROMEO 4C GLOSS BLACK",
	];

	// Find featured products in order
	const featuredProducts = featuredProductNames
		.map((name) => allProducts.find((p) => p.name.toLowerCase().includes(name.toLowerCase())))
		.filter(Boolean); // Remove any undefined results

	return (
		<div className="bg-[var(--selfridges-background)] relative">
			{/* Content */}
			<div className="relative">
				{/* Hero Section */}
				<HeroSection />

				{/* Info Billboard - Live Stats */}
				<InfoBillboard />

				{/* Image Slideshow */}
				<ImageSlideshow />

				{/* Why Choose Us Section */}
				<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-[var(--selfridges-bg-secondary)] to-[var(--selfridges-background)] border-y border-[var(--vero-gold-accent)]/20">
					<div className="w-full">
						{/* Section Header */}
						<div className="text-center mb-12">
							<h3 className="text-3xl md:text-4xl font-light text-[var(--selfridges-text-primary)] uppercase tracking-wider mb-3">
								Why Collectors Choose Veromodels
							</h3>
							<p className="text-[var(--selfridges-text-muted)] text-lg max-w-2xl mx-auto">
								Premium quality, authenticity, and exceptional service for every collector
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Award className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Authenticity Guaranteed
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Every model is officially licensed and comes with certificates of authenticity from verified
									manufacturers
								</p>
							</div>

							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Package className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Secure Packaging
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Double-boxed with protective foam to ensure safe delivery of your precious collectible items
								</p>
							</div>

							<div className="group text-center p-8 bg-[var(--selfridges-bg-secondary)] rounded-2xl border border-[var(--vero-gold-accent)]/20 hover:border-[var(--vero-gold-accent)] hover:shadow-2xl hover:shadow-[var(--vero-gold-accent)]/10 transition-all duration-300 hover:-translate-y-2">
								<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--vero-gold-accent)]/10 to-[var(--vero-gold-accent-light)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<Shield className="w-10 h-10 text-[var(--vero-gold-accent)]" />
								</div>
								<h4 className="text-xl font-semibold text-[var(--selfridges-text-primary)] mb-3">
									Quality Assurance
								</h4>
								<p className="text-[var(--selfridges-text-muted)] leading-relaxed">
									Inspected and verified before shipment with premium 1:18 scale craftsmanship and attention
									to detail
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Brand Showcase - Animated Marquee */}
				<section className="relative border-t border-[var(--vero-gold-accent)]/20 py-12 overflow-hidden bg-[var(--selfridges-background)]">
					{/* Background Image */}
					<div className="absolute inset-0 z-0">
						<Image
							src="https://i.ibb.co/8D9g5bJm/Untitled-design-1.png"
							alt="Background"
							fill
							className="object-cover opacity-10"
							sizes="100vw"
						/>
					</div>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-[var(--selfridges-bg-secondary)] via-[var(--selfridges-background)]/95 to-[var(--selfridges-background)]/95 z-0" />

					<div className="relative z-10 w-full px-6 lg:px-12 xl:px-16">
						<h3 className="text-center text-lg md:text-xl font-light vero-text-gradient uppercase tracking-widest mb-8">
							Premium Brands We Carry
						</h3>
						<Marquee className="py-4">
							<MarqueeFade side="left" />
							<MarqueeFade side="right" />
							<MarqueeContent speed={40}>
								{StoreConfig.brands.map((brand, idx) => (
									<MarqueeItem key={`${brand}-${idx}`} className="mx-12 flex items-center justify-center">
										<div className="text-lg md:text-xl font-light text-[var(--selfridges-text-muted)] hover:text-[var(--vero-gold-accent)] transition-all duration-300 hover:scale-110 cursor-default uppercase tracking-wider">
											{brand}
										</div>
									</MarqueeItem>
								))}
							</MarqueeContent>
						</Marquee>
					</div>
				</section>

				{/* Parallax Section */}
				<ParallaxSection />

				{/* Newsletter CTA */}
				<section className="w-full px-6 lg:px-12 xl:px-16 py-8 bg-[var(--selfridges-bg-secondary)] border-t border-[var(--selfridges-border-light)]">
					<div className="w-full text-center">
						<h3 className="text-xl md:text-2xl font-semibold text-[var(--selfridges-text-primary)] mb-2">
							Get Exclusive Updates & Early Access
						</h3>
						<p className="text-sm text-[var(--selfridges-text-muted)] mb-4">
							Subscribe to our newsletter for new releases, special offers, and collector tips
						</p>
						<Link
							href="/newsletter"
							className="inline-flex items-center gap-2 bg-[var(--selfridges-black)] hover:bg-[var(--selfridges-gray-medium)] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-300 uppercase tracking-wide"
						>
							Subscribe Now
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
