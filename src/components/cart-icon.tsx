"use client";

import { ShoppingBag } from "lucide-react";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/context/cart-context";

type CartIconVariant = "icon" | "pill";

interface CartIconProps {
	variant?: CartIconVariant;
	showLabel?: boolean;
}

export function CartIcon({ variant = "icon", showLabel = false }: CartIconProps) {
	const { isCartOpen, openCart, closeCart, itemCount } = useCart();

	const baseClasses =
		variant === "pill"
			? "group relative inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 text-sm font-semibold text-[#212529] shadow-sm transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20"
			: "group relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#B8941F]/10 transition-all duration-300";

	const iconClasses =
		variant === "pill"
			? "h-5 w-5 text-[#6C757D] transition-colors duration-300 group-hover:text-[#B8941F]"
			: "h-5 w-5 text-[#6C757D] transition-colors duration-300 group-hover:text-[#B8941F]";

	return (
		<>
			<button
				onClick={openCart}
				className={baseClasses}
				aria-label={`Open cart (${itemCount} items)`}
				type="button"
			>
				<ShoppingBag className={iconClasses} strokeWidth={1.5} />
				{showLabel && (
					<span className="hidden lg:inline text-sm font-medium group-hover:text-[#B8941F]">Cart</span>
				)}
				{itemCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#B8941F] to-[#8B7015] text-[10px] font-semibold text-white shadow-lg">
						{itemCount > 99 ? "99+" : itemCount}
					</span>
				)}
			</button>

			<CartSidebar isOpen={isCartOpen} onClose={closeCart} />
		</>
	);
}
