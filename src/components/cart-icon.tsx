"use client";

import { ShoppingBag } from "lucide-react";
import { CartSidebar } from "@/components/cart-sidebar";
import { useCart } from "@/context/cart-context";

export function CartIcon() {
	const { isCartOpen, openCart, closeCart, itemCount } = useCart();

	return (
		<>
			<button
				onClick={openCart}
				className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#B8941F]/10 transition-all duration-300 group"
				aria-label={`Open cart (${itemCount} items)`}
			>
				<ShoppingBag className="h-5 w-5 text-[#6C757D] group-hover:text-[#B8941F] transition-colors duration-300" strokeWidth={1.5} />
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
