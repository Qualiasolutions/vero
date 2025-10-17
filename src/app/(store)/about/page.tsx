import { Award, Car, Globe, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "About Us - Our Story",
	description: "Learn about Veromodels - your destination for premium diecast car models and collectibles.",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-yellow-900/30">
				<div className="absolute inset-0 bg-gradient-to-b from-black via-yellow-950/10 to-black" />
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6bTAgMjhjMC00LjQxOCAzLjU4Mi04IDgtOHM4IDMuNTgyIDggOC0zLjU4MiA4LTggOC04LTMuNTgyLTgtOHptLTI4IDBjMC00LjQxOCAzLjU4Mi04IDgtOHM4IDMuNTgyIDggOC0zLjU4MiA4LTggOC04LTMuNTgyLTgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					<h1 className="text-5xl md:text-7xl font-bold mb-6 vero-text-gradient tracking-tight">Our Story</h1>
					<p className="text-xl md:text-2xl text-yellow-400/80 max-w-3xl mx-auto font-light leading-relaxed">
						Born from passion. Driven by excellence. Celebrating automotive artistry.
					</p>
				</div>
			</section>

			{/* Brand Story Section */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="grid md:grid-cols-2 gap-16 items-center">
					<div className="space-y-6">
						<h2 className="text-4xl font-bold vero-text-gradient">The Dream in Every Garage</h2>
						<div className="space-y-4 text-yellow-400/70 text-lg leading-relaxed">
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
							<p>
								We stand for more than just selling models — we celebrate the craftsmanship, heritage, and
								emotion that cars embody. Each piece is a reminder of dreams achieved, memories cherished, and
								passions shared.
							</p>
						</div>
					</div>

					<div className="relative h-[500px] rounded-lg overflow-hidden vero-card">
						<div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-black/60 z-10" />
						<Image
							src="https://i.ibb.co/b52z9FPV/Untitled-design-3.png"
							alt="Veromodels Collection"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="border-y border-yellow-900/30 bg-gradient-to-b from-black via-yellow-950/5 to-black py-20">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<h2 className="text-4xl font-bold vero-text-gradient mb-8">Our Mission</h2>
					<p className="text-xl text-yellow-400/80 leading-relaxed max-w-4xl mx-auto">
						Our mission is to make it possible for every enthusiast to own a garage of dream cars in scale —
						from first-time gift buyers to lifelong collectors. Since few of us can own every supercar or
						classic in real life, Veromodels offers the next best thing: authentic and detailed die-cast
						models. We bring together{" "}
						<span className="vero-text-gradient font-semibold">luxury, authenticity, exclusivity</span> and{" "}
						<span className="vero-text-gradient font-semibold">nostalgia</span> so every customer can
						experience the thrill of saying, "Yes, I own that car" - even if it fits on a shelf instead of a
						driveway.
					</p>
				</div>
			</section>

			{/* Values Grid */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<h2 className="text-4xl font-bold text-center vero-text-gradient mb-16">What We Stand For</h2>

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
							className="vero-card p-8 text-center group hover:scale-105 transition-transform duration-300"
						>
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 mb-6 group-hover:from-yellow-400/30 group-hover:to-yellow-600/30 transition-colors">
								<value.icon className="w-8 h-8 text-yellow-400" />
							</div>
							<h3 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-wider">
								{value.title}
							</h3>
							<p className="text-yellow-400/70 leading-relaxed">{value.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-5xl mx-auto px-6 py-20 text-center">
				<div className="vero-card p-12 md:p-16">
					<h2 className="text-3xl md:text-4xl font-bold vero-text-gradient mb-6">
						Start Your Collection Today
					</h2>
					<p className="text-xl text-yellow-400/70 mb-10 max-w-2xl mx-auto">
						From first-time buyers to seasoned collectors, discover your next dream car in our curated
						collection.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/products" className="vero-button px-8 py-4 rounded-none inline-block">
							Browse Collection
						</Link>
						<Link
							href="/order-your-diecast"
							className="vero-button-outline px-8 py-4 rounded-none inline-block"
						>
							Custom Request
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
