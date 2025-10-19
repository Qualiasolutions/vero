import { Award, Car, Globe, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "About Us - Our Story",
	description: "Learn about Veromodels - your destination for premium diecast car models and collectibles.",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A]">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 left-20 w-96 h-96 border border-[#D4AF37] rounded-full animate-float" />
					<div className="absolute bottom-20 right-20 w-64 h-64 border border-[#D4AF37] rounded-full animate-float delay-1000" />
				</div>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />

				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					<div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-6 py-2 backdrop-blur-sm mb-8">
						<span className="text-sm font-medium text-[#E6C757]">Est. 2024 • Premium Die-Cast Models</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-light mb-6 text-white tracking-tight">
						Our <span className="vero-elegant-text">Story</span>
					</h1>
					<p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
						Born from passion. Driven by excellence. Celebrating automotive artistry.
					</p>
				</div>
			</section>

			{/* Brand Story Section */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="grid md:grid-cols-2 gap-16 items-center">
					<div className="space-y-6">
						<h2 className="text-4xl md:text-5xl font-light text-[#212529] mb-4">
							The Dream in Every <span className="vero-elegant-text">Garage</span>
						</h2>
						<div className="space-y-4 text-[#6C757D] text-lg leading-relaxed">
							<p>
								Veromodels was born from a passion for cars and the belief that every enthusiast should have
								the chance to own their dream cars — because not everyone can fit a Ferrari in their garage,
								but they can in scale.
							</p>
							<p>
								For some, that means discovering the perfect gift that surprises and delights. For others,
								it's about unlocking a lifelong hobby that brings joy and pride with every model collected.
								And for seasoned collectors, Veromodels is the trusted destination for both the latest
								releases and rare, hard-to-find treasures.
							</p>
							<p className="text-[#D4AF37] font-medium">
								We stand for more than just selling models — we celebrate the craftsmanship, heritage, and
								emotion that cars embody. Each piece is a reminder of dreams achieved, memories cherished, and
								passions shared.
							</p>
						</div>
					</div>

					<div className="relative h-[500px] rounded-2xl overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-[#0A0A0A]/30 z-10 group-hover:from-[#D4AF37]/20 transition-all" />
						<Image
							src="https://i.ibb.co/b52z9FPV/Untitled-design-3.png"
							alt="Veromodels Collection"
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-700"
						/>
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="border-y border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDFBF7] py-20">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<h2 className="text-4xl md:text-5xl font-light text-[#212529] mb-8">
						Our <span className="vero-elegant-text">Mission</span>
					</h2>
					<p className="text-xl text-[#6C757D] leading-relaxed max-w-4xl mx-auto">
						Our mission is to make it possible for every enthusiast to own a garage of dream cars in scale —
						from first-time gift buyers to lifelong collectors. Since few of us can own every supercar or
						classic in real life, Veromodels offers the next best thing: authentic and detailed die-cast
						models. We bring together{" "}
						<span className="text-[#D4AF37] font-semibold">luxury, authenticity, exclusivity</span> and{" "}
						<span className="text-[#D4AF37] font-semibold">nostalgia</span> so every customer can experience
						the thrill of saying, "Yes, I own that car" - even if it fits on a shelf instead of a driveway.
					</p>
				</div>
			</section>

			{/* Values Grid */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<h2 className="text-4xl md:text-5xl font-light text-center text-[#212529] mb-16">
					What We Stand <span className="vero-elegant-text">For</span>
				</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{[
						{
							icon: Car,
							title: "Authenticity",
							description:
								"Every model is a faithful recreation of automotive excellence, capturing every detail that makes these cars legendary.",
						},
						{
							icon: Heart,
							title: "Passion",
							description:
								"We're collectors and enthusiasts first. We understand the emotion behind every model in your collection.",
						},
						{
							icon: Award,
							title: "Quality",
							description:
								"From AUTOart to BBR, we partner with the world's finest manufacturers to ensure museum-quality pieces.",
						},
						{
							icon: Globe,
							title: "Exclusivity",
							description:
								"Access rare finds and limited editions through our global network of suppliers and collectors.",
						},
					].map((value, index) => (
						<div
							key={index}
							className="group text-center p-8 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2"
						>
							<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
								<value.icon className="w-10 h-10 text-[#D4AF37]" />
							</div>
							<h3 className="text-xl font-bold text-[#D4AF37] mb-4 uppercase tracking-wider">
								{value.title}
							</h3>
							<p className="text-[#6C757D] leading-relaxed">{value.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-5xl mx-auto px-6 py-20 text-center">
				<div className="relative rounded-2xl overflow-hidden p-12 md:p-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A]">
					{/* Decorative Elements */}
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-10 right-10 w-48 h-48 border border-[#D4AF37] rounded-full" />
						<div className="absolute bottom-10 left-10 w-32 h-32 border border-[#E6C757] rounded-full" />
					</div>

					<div className="relative z-10">
						<h2 className="text-3xl md:text-4xl font-light text-white mb-4">
							Start Your Collection <span className="vero-elegant-text">Today</span>
						</h2>
						<p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
							From first-time buyers to seasoned collectors, discover your next dream car in our curated
							collection.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/#categories"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
							>
								Browse Collection
							</Link>
							<Link
								href="/contact"
								className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
							>
								Contact Us
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
