"use client";

import { Eye, Package, Shield, ShoppingCart, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InfoBillboardClientProps {
	stats: {
		active_carts: number;
		total_collectors: number;
		carts_24h: number;
	};
}

export function InfoBillboardClient({ stats }: InfoBillboardClientProps) {
	const [currentPairIndex, setCurrentPairIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// Define all billboard items
	const allItems = [
		// Live Activity - 24h
		stats.carts_24h > 0 && {
			id: "activity",
			content: (
				<div className="flex items-center gap-2 flex-shrink-0">
					<div className="relative">
						<div className="w-2 h-2 rounded-full bg-[var(--vero-gold-accent)] animate-pulse" />
						<div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--vero-gold-accent)] animate-ping" />
					</div>
					<div className="flex items-center gap-1.5">
						<ShoppingCart className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
						<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">
							<span className="text-[var(--vero-gold-accent)]">{stats.carts_24h}</span> items added today
						</p>
					</div>
				</div>
			),
		},
		// Total Active Carts
		stats.active_carts > 0 && {
			id: "carts",
			content: (
				<div className="flex items-center gap-2 flex-shrink-0">
					<TrendingUp className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
					<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
						<span className="text-[var(--vero-gold-accent)] font-bold">{stats.active_carts}</span> cars in
						carts this week
					</p>
				</div>
			),
		},
		// Collectors Trust Badge
		{
			id: "collectors",
			content: (
				<div className="flex items-center gap-2 flex-shrink-0">
					<Users className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
					<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
						<span className="text-[var(--vero-gold-accent)] font-bold">{stats.total_collectors}</span>{" "}
						collectors trust us
					</p>
				</div>
			),
		},
		// Authentic Licensed
		{
			id: "authentic",
			content: (
				<div className="flex items-center gap-2 flex-shrink-0">
					<Shield className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
					<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">Authentic & Licensed</p>
				</div>
			),
		},
		// Free Shipping
		{
			id: "shipping",
			content: (
				<div className="flex items-center gap-2 flex-shrink-0">
					<Package className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
					<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
						Free Shipping AED 550+
					</p>
				</div>
			),
		},
		// Custom Orders CTA
		{
			id: "custom",
			content: (
				<Link
					href="/order-your-diecast"
					className="flex items-center gap-2 group flex-shrink-0 hover:scale-105 transition-transform"
				>
					<div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
						<Eye className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
					</div>
					<div>
						<p className="text-[10px] font-bold text-[var(--selfridges-text-primary)] uppercase tracking-wide">
							Can't Find It?
						</p>
						<p className="text-[9px] text-[var(--vero-gold-accent)] group-hover:underline">Order Custom →</p>
					</div>
				</Link>
			),
		},
	].filter(Boolean);

	// Rotate through pairs every 10 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentPairIndex((prev) => (prev + 1) % Math.ceil(allItems.length / 2));
				setIsAnimating(false);
			}, 300); // Fade out duration
		}, 10000);

		return () => clearInterval(interval);
	}, [allItems.length]);

	// Get current pair of items to display on mobile
	const currentPair = allItems.slice(currentPairIndex * 2, currentPairIndex * 2 + 2);

	return (
		<section className="w-full bg-gradient-to-r from-[var(--selfridges-bg-secondary)] via-[var(--selfridges-background)] to-[var(--selfridges-bg-secondary)] border-y border-[var(--vero-gold-accent)]/20 py-2.5">
			<div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
				{/* Mobile - Show 2 rotating items */}
				<div className="lg:hidden">
					<div
						className={`flex items-center justify-center gap-4 transition-opacity duration-300 ${
							isAnimating ? "opacity-0" : "opacity-100"
						}`}
					>
						{currentPair.map((item: { id: string; content: React.ReactNode }, index) => (
							<div key={`${item.id}-${currentPairIndex}`} className="flex-1 flex justify-center">
								{item.content}
								{index === 0 && currentPair.length > 1 && (
									<div className="mx-4 w-px h-6 bg-[var(--vero-gold-accent)]/20" />
								)}
							</div>
						))}
					</div>
				</div>

				{/* Desktop - Show all items */}
				<div className="hidden lg:flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
					{stats.carts_24h > 0 && (
						<>
							<div className="flex items-center gap-2 flex-shrink-0">
								<div className="relative">
									<div className="w-2 h-2 rounded-full bg-[var(--vero-gold-accent)] animate-pulse" />
									<div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--vero-gold-accent)] animate-ping" />
								</div>
								<div className="flex items-center gap-1.5">
									<ShoppingCart className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
									<p className="text-xs font-bold text-[var(--selfridges-text-primary)]">
										<span className="text-[var(--vero-gold-accent)]">{stats.carts_24h}</span> items added
										today
									</p>
								</div>
							</div>
							<div className="w-px h-6 bg-[var(--vero-gold-accent)]/20" />
						</>
					)}

					{stats.active_carts > 0 && (
						<>
							<div className="flex items-center gap-2 flex-shrink-0">
								<TrendingUp className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
								<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
									<span className="text-[var(--vero-gold-accent)] font-bold">{stats.active_carts}</span> cars
									in carts this week
								</p>
							</div>
							<div className="w-px h-6 bg-[var(--vero-gold-accent)]/20" />
						</>
					)}

					<div className="flex items-center gap-2 flex-shrink-0">
						<Users className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
						<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
							<span className="text-[var(--vero-gold-accent)] font-bold">{stats.total_collectors}</span>{" "}
							collectors trust us
						</p>
					</div>

					<div className="w-px h-6 bg-[var(--vero-gold-accent)]/20" />

					<div className="flex items-center gap-2 flex-shrink-0">
						<Shield className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
						<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
							Authentic & Licensed
						</p>
					</div>

					<div className="hidden xl:block w-px h-6 bg-[var(--vero-gold-accent)]/20" />

					<div className="hidden xl:flex items-center gap-2 flex-shrink-0">
						<Package className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
						<p className="text-xs font-semibold text-[var(--selfridges-text-primary)]">
							Free Shipping AED 550+
						</p>
					</div>

					<div className="hidden 2xl:block w-px h-6 bg-[var(--vero-gold-accent)]/20" />

					<Link
						href="/order-your-diecast"
						className="hidden 2xl:flex items-center gap-2 group flex-shrink-0 hover:scale-105 transition-transform"
					>
						<div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
							<Eye className="w-3.5 h-3.5 text-[var(--vero-gold-accent)]" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-[var(--selfridges-text-primary)] uppercase tracking-wide">
								Can't Find It?
							</p>
							<p className="text-[9px] text-[var(--vero-gold-accent)] group-hover:underline">
								Order Custom →
							</p>
						</div>
					</Link>
				</div>
			</div>
		</section>
	);
}
