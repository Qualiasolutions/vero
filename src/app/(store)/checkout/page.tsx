"use client";

import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
	const { cart } = useCart();

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-[#FDFBF7]/50 to-white">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-4xl font-light text-[#111827] uppercase tracking-wider mb-3">
							Secure Checkout
						</h1>
						<p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
							Complete your order with our secure payment system
						</p>
					</div>

					{cart ? (
						<CheckoutForm cart={cart} />
					) : (
						<div className="text-center py-12">
							<p className="text-[#6B7280]">Your cart is empty</p>
							<Link href="/products" className="vero-button inline-block mt-4">
								Continue Shopping
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
