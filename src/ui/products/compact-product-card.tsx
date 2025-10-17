"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CompactProductCardProps {
	product: {
		id: string;
		name: string;
		slug: string;
		price: number;
		images: string[];
		metadata?: {
			originalPrice?: string;
			onSale?: string;
			preorder?: string;
			brand?: string;
			releaseDate?: string;
			category?: string;
		};
	};
	currency?: string;
}

export function CompactProductCard({ product, currency = "€" }: CompactProductCardProps) {
	const isOnSale = product.metadata?.onSale === "true";
	const isPreorder = product.metadata?.preorder === "true";
	const originalPrice = product.metadata?.originalPrice
		? parseFloat(product.metadata.originalPrice)
		: null;

	// Determine badge based on product metadata
	const getBadge = () => {
		const category = product.metadata?.category?.toLowerCase();

		if (isOnSale) {
			return { text: "SALE", color: "bg-red-500 text-white" };
		}
		if (isPreorder && product.metadata?.releaseDate) {
			return { text: "PRE-ORDER", color: "bg-blue-500 text-white" };
		}
		if (category?.includes("rare") || product.name.toLowerCase().includes("rare")) {
			return { text: "RARE", color: "bg-amber-500 text-white" };
		}
		if (category?.includes("limited") || product.name.toLowerCase().includes("limited")) {
			return { text: "LIMITED", color: "bg-purple-500 text-white" };
		}
		if (category?.includes("new")) {
			return { text: "NEW", color: "bg-green-500 text-white" };
		}
		return null;
	};

	const badge = getBadge();
	const imageUrl = product.images[0] || "/placeholder-car.jpg";

	return (
		<Link href={`/product/${product.slug}`} className="group block">
			<div className="bg-white border border-gray-200/60 rounded-md overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#D4AF37]/30">
				<div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
					{/* Badge */}
					{badge && (
						<div className="absolute top-2 left-2 z-10">
							<div className={cn(
								"px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm",
								badge.color
							)}>
								{badge.text}
							</div>
						</div>
					)}

					{/* Product Image */}
					<Image
						src={imageUrl}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				</div>

				<div className="p-3 space-y-1.5">
					{/* Brand */}
					{product.metadata?.brand && (
						<div className="text-[10px] text-[#D4AF37]/70 uppercase tracking-wider font-medium">
							{product.metadata.brand}
						</div>
					)}

					{/* Product Name */}
					<h3 className="font-light text-xs leading-tight line-clamp-2 text-[#212529] group-hover:text-[#D4AF37] transition-colors duration-300">
						{product.name}
					</h3>

					{/* Pricing */}
					<div className="flex items-baseline gap-1.5 pt-0.5">
						{isOnSale && originalPrice && originalPrice > product.price ? (
							<>
								<span className="text-base font-semibold text-[#D4AF37]">
									{currency}{product.price.toFixed(2)}
								</span>
								<span className="text-[10px] text-gray-400 line-through">
									{currency}{originalPrice.toFixed(2)}
								</span>
							</>
						) : (
							<span className="text-base font-semibold text-[#D4AF37]">
								{currency}{product.price.toFixed(2)}
							</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
