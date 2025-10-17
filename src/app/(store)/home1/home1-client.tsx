"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/product-service";

interface Home1ClientProps {
	products: Product[];
}

export function Home1Client({ products }: Home1ClientProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Particle explosion effect
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const particles: {
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			life: number;
			color: string;
		}[] = [];

		const colors = ["#D4AF37", "#E6C757", "#B8941F", "#F5E6D3"];

		// Create initial particles
		for (let i = 0; i < 100; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 2,
				vy: (Math.random() - 0.5) * 2,
				size: Math.random() * 3 + 1,
				life: Math.random() * 100,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		let animationId: number;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((particle) => {
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.life -= 0.5;

				// Respawn particle
				if (particle.life <= 0) {
					particle.x = Math.random() * canvas.width;
					particle.y = Math.random() * canvas.height;
					particle.life = 100;
				}

				// Mouse attraction
				const dx = mousePosition.x - particle.x;
				const dy = mousePosition.y - particle.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 200) {
					particle.vx += dx * 0.0001;
					particle.vy += dy * 0.0001;
				}

				// Draw particle
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fillStyle = particle.color;
				ctx.globalAlpha = particle.life / 100;
				ctx.fill();
			});

			ctx.globalAlpha = 1;
			animationId = requestAnimationFrame(animate);
		};

		animate();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", handleResize);
		};
	}, [mousePosition]);

	// Track mouse position
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#1A1A1A] to-[#0A0A0A]">
			{/* Particle Canvas */}
			<canvas
				ref={canvasRef}
				className="fixed inset-0 pointer-events-none z-0"
				style={{ mixBlendMode: "screen" }}
			/>

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
				{/* Animated gradient orbs */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px] opacity-20 animate-float" />
					<div
						className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E6C757] rounded-full blur-[120px] opacity-20 animate-float"
						style={{ animationDelay: "2s" }}
					/>
				</div>

				{/* Hero Content */}
				<div className="relative z-10 text-center max-w-6xl mx-auto">
					<div className="space-y-8 animate-fade-in">
						{/* Explosive Title */}
						<h1 className="text-7xl md:text-9xl font-light tracking-tight text-white relative">
							<span className="inline-block animate-shimmer bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent bg-[length:200%_100%]">
								VERO
							</span>
							<br />
							<span className="text-5xl md:text-7xl block mt-4 text-[#D4AF37] vero-elegant-text">
								Premium Die-Cast Collection
							</span>
						</h1>

						{/* Tagline */}
						<p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide max-w-3xl mx-auto">
							Where Engineering Meets Artistry in 1:18 Scale Perfection
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
							<Link
								href="/"
								className="group relative px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white font-semibold text-lg rounded-lg overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#D4AF37]/50"
							>
								<span className="relative z-10 uppercase tracking-wider">Explore Collection</span>
								<div className="absolute inset-0 bg-gradient-to-r from-[#B8941F] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</Link>
							<Link
								href="/category/limited-editions"
								className="group px-12 py-5 border-2 border-[#D4AF37] text-[#D4AF37] font-semibold text-lg rounded-lg transition-all duration-500 hover:bg-[#D4AF37] hover:text-black hover:scale-110 hover:shadow-2xl hover:shadow-[#D4AF37]/30"
							>
								<span className="uppercase tracking-wider">Limited Editions</span>
							</Link>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center pt-2">
						<div className="w-1 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
					</div>
				</div>
			</section>

			{/* Featured Collection with 3D Cards */}
			<section className="relative z-10 py-24 px-4">
				<div className="container mx-auto max-w-7xl">
					{/* Section Header */}
					<div className="text-center mb-16 space-y-4">
						<h2 className="text-5xl md:text-6xl font-light text-white">
							<span className="vero-elegant-text">Featured Masterpieces</span>
						</h2>
						<p className="text-xl text-gray-400 font-light">
							Handpicked excellence from our premium collection
						</p>
					</div>

					{/* 3D Product Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{products.map((product, index) => (
							<Link
								key={product.id}
								href={`/product/${product.slug}`}
								className="group relative"
								style={{
									animationDelay: `${index * 100}ms`,
								}}
							>
								<div
									className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-2xl overflow-hidden border border-[#D4AF37]/20 transition-all duration-700 hover:border-[#D4AF37] hover:-translate-y-4 hover:rotate-1 hover:scale-105"
									style={{
										transformStyle: "preserve-3d",
										perspective: "1000px",
									}}
								>
									{/* Glow Effect */}
									<div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

									{/* Product Image */}
									<div className="relative aspect-[4/3] overflow-hidden bg-black/50">
										{product.images?.[0] && (
											<Image
												src={product.images[0]}
												alt={product.name}
												fill
												className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
											/>
										)}
										{/* Overlay Gradient */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
									</div>

									{/* Product Info */}
									<div className="relative p-6 space-y-3">
										<h3 className="text-xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300">
											{product.name}
										</h3>
										{product.description && (
											<p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
										)}
										<div className="flex items-center justify-between pt-4">
											<span className="text-2xl font-bold text-[#D4AF37]">
												€{product.price.toFixed(2)}
											</span>
											<span className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-semibold uppercase tracking-wide group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
												View
											</span>
										</div>
									</div>

									{/* Corner Accent */}
									<div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Parallax Stats Section */}
			<section className="relative z-10 py-24 px-4">
				<div className="container mx-auto max-w-7xl">
					<div className="vero-glass-dark rounded-3xl p-12 border border-[#D4AF37]/30">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
							<div className="space-y-4">
								<div className="text-6xl font-light text-[#D4AF37] vero-elegant-text">500+</div>
								<div className="text-xl text-gray-300 font-light">Premium Models</div>
							</div>
							<div className="space-y-4">
								<div className="text-6xl font-light text-[#D4AF37] vero-elegant-text">1:18</div>
								<div className="text-xl text-gray-300 font-light">Scale Perfection</div>
							</div>
							<div className="space-y-4">
								<div className="text-6xl font-light text-[#D4AF37] vero-elegant-text">100%</div>
								<div className="text-xl text-gray-300 font-light">Authentic Detail</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Luxury CTA Section */}
			<section className="relative z-10 py-32 px-4">
				<div className="container mx-auto max-w-5xl text-center">
					<div className="space-y-8">
						<h2 className="text-5xl md:text-7xl font-light text-white">
							<span className="vero-elegant-text">Start Your Collection</span>
						</h2>
						<p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto">
							Join the world's most discerning collectors in celebrating automotive excellence
						</p>
						<Link
							href="/"
							className="inline-block px-16 py-6 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white font-bold text-xl rounded-full uppercase tracking-widest transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#D4AF37]/50 mt-8"
						>
							Explore Now
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
