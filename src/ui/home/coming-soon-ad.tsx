import { Calendar, Clock, Gift, Info, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComingSoonAdProps } from "@/types/products";

export function ComingSoonAd({ product, designType, onPreorderClick }: ComingSoonAdProps) {
	const formatPrice = (amount?: number, currency?: string) => {
		if (!amount) return "Price TBA";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency || "USD",
			minimumFractionDigits: 0,
		}).format(amount / 100);
	};

	const formatDate = (date?: Date) => {
		if (!date) return "Coming Soon";
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			year: "numeric",
		}).format(date);
	};

	const calculateDaysUntil = (date?: Date) => {
		if (!date) return null;
		const now = new Date();
		const diff = date.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	// Minimalist Design
	const MinimalistDesign = () => (
		<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#C4A962]/30 hover:border-[#C4A962] transition-all duration-300">
			{product.image && (
				<div className="relative h-48 w-full overflow-hidden">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
				</div>
			)}
			<div className="p-4 space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-xs font-bold text-[#C4A962] uppercase tracking-wider">Coming Soon</span>
					{product.expectedAvailabilityDate && (
						<span className="text-xs text-white/60">{formatDate(product.expectedAvailabilityDate)}</span>
					)}
				</div>
				<h3 className="text-white font-light text-sm leading-tight line-clamp-2">{product.name}</h3>
				<div className="flex items-center justify-between pt-2">
					<span className="text-xs text-white/80">{product.scale}</span>
					{product.price && (
						<span className="text-xs font-semibold text-[#C4A962]">
							{formatPrice(product.price, product.currency)}
						</span>
					)}
				</div>
			</div>
		</div>
	);

	// Detailed Design
	const DetailedDesign = () => (
		<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#C4A962]/10 to-[#0A0A0A] border border-[#C4A962]/40 hover:border-[#C4A962] transition-all duration-300">
			<div className="absolute top-2 right-2 z-10">
				<div className="bg-[#C4A962] text-black px-2 py-1 rounded-full">
					<span className="text-xs font-bold uppercase">Pre-Order</span>
				</div>
			</div>
			{product.image && (
				<div className="relative h-32 w-full overflow-hidden">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
				</div>
			)}
			<div className="p-4 space-y-3">
				<h3 className="text-white font-light text-sm leading-tight line-clamp-2">{product.name}</h3>
				<div className="space-y-2 text-xs text-white/70">
					<div className="flex items-center gap-2">
						<span>Scale:</span>
						<span className="text-white">{product.scale}</span>
					</div>
					{product.brand && (
						<div className="flex items-center gap-2">
							<span>Brand:</span>
							<span className="text-white">{product.brand}</span>
						</div>
					)}
					{product.year && (
						<div className="flex items-center gap-2">
							<span>Year:</span>
							<span className="text-white">{product.year}</span>
						</div>
					)}
				</div>
				{product.depositRequired && product.depositPercentage && (
					<div className="bg-[#C4A962]/20 border border-[#C4A962]/30 rounded p-2">
						<p className="text-xs text-[#C4A962]">Deposit required: {product.depositPercentage}%</p>
					</div>
				)}
				<div className="flex items-center justify-between pt-2">
					<span className="text-xs text-white/60">
						{product.expectedAvailabilityDate
							? `Expected: ${formatDate(product.expectedAvailabilityDate)}`
							: "Coming Soon"}
					</span>
					{product.price && (
						<span className="text-sm font-bold text-[#C4A962]">
							{formatPrice(product.price, product.currency)}
						</span>
					)}
				</div>
			</div>
		</div>
	);

	// Countdown Design
	const CountdownDesign = () => {
		const daysUntil = calculateDaysUntil(product.expectedAvailabilityDate);
		return (
			<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#8B1538] to-[#2A2A2A] border border-[#8B1538]/50 hover:border-[#8B1538] transition-all duration-300">
				<div className="absolute inset-0 bg-black/20" />
				<div className="relative p-6 space-y-4">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 mb-3">
							<Clock className="w-4 h-4 text-[#8B1538]" />
							<span className="text-xs font-bold text-[#8B1538] uppercase tracking-wider">Countdown</span>
						</div>
						{daysUntil && daysUntil > 0 ? (
							<div className="text-3xl font-bold text-white mb-2">{daysUntil}</div>
						) : (
							<div className="text-lg font-bold text-white mb-2">Coming Soon</div>
						)}
						<div className="text-xs text-white/80 uppercase tracking-wider">
							{daysUntil && daysUntil > 0 ? "Days Until Release" : "Release Date TBA"}
						</div>
					</div>
					<div className="space-y-2">
						<h3 className="text-white font-light text-sm text-center line-clamp-2">{product.name}</h3>
						{product.expectedAvailabilityDate && (
							<div className="flex items-center justify-center gap-2 text-xs text-white/60">
								<Calendar className="w-3 h-3" />
								<span>{formatDate(product.expectedAvailabilityDate)}</span>
							</div>
						)}
					</div>
					{product.preOrderLimit && (
						<div className="text-center">
							<p className="text-xs text-white/70">
								Limited to <span className="text-[#8B1538] font-bold">{product.preOrderLimit}</span> pieces
							</p>
						</div>
					)}
				</div>
			</div>
		);
	};

	// Premium Design
	const PremiumDesign = () => (
		<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#D4AF37] via-[#B8941F] to-[#8B6914] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all duration-300">
			<div className="absolute inset-0 bg-black/30" />
			{product.image && (
				<div className="absolute inset-0">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
					/>
				</div>
			)}
			<div className="relative p-6 space-y-4">
				<div className="text-center">
					<Star className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
					<span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
						Premium Collection
					</span>
				</div>
				<h3 className="text-white font-light text-xs text-center leading-relaxed px-2 line-clamp-3">
					{product.name}
				</h3>
				<div className="text-center">
					<div className="text-lg font-light text-white mb-1">
						{product.price ? formatPrice(product.price, product.currency) : "Price TBA"}
					</div>
					<div className="text-xs text-white/80 uppercase tracking-wider">
						{product.scale} • {product.brand || "Premium"}
					</div>
				</div>
				{product.expectedAvailabilityDate && (
					<div className="text-center">
						<p className="text-xs text-white/70 italic">
							Available {formatDate(product.expectedAvailabilityDate)}
						</p>
					</div>
				)}
			</div>
		</div>
	);

	// Technical Design
	const TechnicalDesign = () => (
		<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#2A2A2A] to-[#0A0A0A] border border-[#C4A962]/20 hover:border-[#C4A962] transition-all duration-300">
			<div className="absolute top-3 left-3">
				<div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
					<span className="text-xs font-mono text-[#C4A962]">TECH SPECS</span>
				</div>
			</div>
			<div className="p-4 space-y-3">
				<h3 className="text-white font-light text-xs font-mono leading-tight line-clamp-2">{product.name}</h3>
				<div className="space-y-1 text-xs font-mono">
					<div className="flex justify-between text-white/60">
						<span>SCALE:</span>
						<span className="text-[#C4A962]">{product.scale}</span>
					</div>
					{product.brand && (
						<div className="flex justify-between text-white/60">
							<span>BRAND:</span>
							<span className="text-white">{product.brand.toUpperCase()}</span>
						</div>
					)}
					{product.year && (
						<div className="flex justify-between text-white/60">
							<span>YEAR:</span>
							<span className="text-white">{product.year}</span>
						</div>
					)}
					{product.price && (
						<div className="flex justify-between text-white/60">
							<span>PRICE:</span>
							<span className="text-[#C4A962]">{formatPrice(product.price, product.currency)}</span>
						</div>
					)}
				</div>
				{product.expectedAvailabilityDate && (
					<div className="border-t border-[#C4A962]/20 pt-2">
						<div className="flex items-center gap-2 text-xs text-white/60">
							<Info className="w-3 h-3" />
							<span>ETA: {formatDate(product.expectedAvailabilityDate)}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	// Announcement Design
	const AnnouncementDesign = () => (
		<div className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#0A0A0A] via-[#C4A962]/10 to-[#0A0A0A] border-2 border-[#C4A962] hover:border-[#D4B673] transition-all duration-300">
			<div className="absolute top-2 left-2 right-2">
				<div className="bg-[#C4A962] text-black px-3 py-1 rounded-full text-center">
					<div className="flex items-center justify-center gap-1">
						<Zap className="w-3 h-3" />
						<span className="text-xs font-bold uppercase">New Announcement</span>
					</div>
				</div>
			</div>
			<div className="p-4 space-y-3 pt-8">
				<div className="text-center space-y-2">
					<Gift className="w-8 h-8 text-[#C4A962] mx-auto" />
					<h3 className="text-white font-light text-sm leading-tight line-clamp-2">{product.name}</h3>
				</div>
				{product.preOrderDescription && (
					<p className="text-xs text-white/70 text-center italic line-clamp-2">
						"{product.preOrderDescription}"
					</p>
				)}
				<div className="text-center space-y-1">
					{product.expectedAvailabilityDate && (
						<p className="text-xs text-[#C4A962] font-semibold">
							Coming {formatDate(product.expectedAvailabilityDate)}
						</p>
					)}
					{product.preOrderLimit && (
						<p className="text-xs text-white/60">Limited Edition: {product.preOrderLimit} pieces</p>
					)}
				</div>
			</div>
		</div>
	);

	// Render the appropriate design
	const renderDesign = () => {
		switch (designType) {
			case "minimalist":
				return <MinimalistDesign />;
			case "detailed":
				return <DetailedDesign />;
			case "countdown":
				return <CountdownDesign />;
			case "premium":
				return <PremiumDesign />;
			case "technical":
				return <TechnicalDesign />;
			case "announcement":
				return <AnnouncementDesign />;
			default:
				return <MinimalistDesign />;
		}
	};

	const handleAdClick = () => {
		if (onPreorderClick) {
			onPreorderClick(product.stripeProductId);
		}
	};

	return (
		<Link href={`/product/${product.stripeProductId}`} onClick={handleAdClick}>
			{renderDesign()}
		</Link>
	);
}
