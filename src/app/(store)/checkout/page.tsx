import { ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { getCartAction } from "@/actions/cart-actions-new";
import { createCheckoutSession } from "@/actions/checkout-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CheckoutPage() {
	const cart = await getCartAction();

	if (!cart || cart.items.length === 0) {
		redirect("/cart");
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-light mb-8 text-[#212529] uppercase tracking-wider">Checkout</h1>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Order Summary */}
				<Card className="border-[#D4AF37]/20">
					<CardHeader>
						<CardTitle className="text-xl font-light uppercase tracking-wide">Order Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{cart.items.map((item) => (
								<div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#D4AF37]/20">
									{item.product?.images?.[0] && (
										<img
											src={item.product.images[0]}
											alt={item.product.name || "Product"}
											className="w-16 h-16 object-cover rounded-md"
										/>
									)}
									<div className="flex-1">
										<p className="font-medium text-[#212529]">
											{item.product?.name || `Product ${item.productId}`}
										</p>
										<p className="text-sm text-[#6C757D]">Quantity: {item.quantity}</p>
									</div>
									<p className="font-semibold text-[#D4AF37]">
										€{((item.price * item.quantity) / 100).toFixed(2)}
									</p>
								</div>
							))}

							<div className="pt-4">
								<div className="flex justify-between items-center mb-2">
									<span className="text-[#6C757D]">Subtotal:</span>
									<span className="font-medium">€{cart.total.toFixed(2)}</span>
								</div>
								<div className="flex justify-between items-center mb-2">
									<span className="text-[#6C757D]">Shipping:</span>
									<span className="text-sm text-[#6C757D]">Calculated at checkout</span>
								</div>
								<div className="flex justify-between items-center pt-4 border-t border-[#D4AF37]/20">
									<span className="text-lg font-medium">Total:</span>
									<span className="text-xl font-semibold text-[#D4AF37]">€{cart.total.toFixed(2)}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Checkout Form */}
				<Card className="border-[#D4AF37]/20">
					<CardHeader>
						<CardTitle className="text-xl font-light uppercase tracking-wide">Payment Details</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
								<p className="text-sm text-[#212529]">
									You will be redirected to Stripe's secure checkout page to complete your payment.
								</p>
							</div>

							<div className="space-y-2">
								<h3 className="font-medium text-[#212529]">Accepted Payment Methods:</h3>
								<div className="flex gap-2">
									<span className="text-xs px-2 py-1 bg-gray-100 rounded">Visa</span>
									<span className="text-xs px-2 py-1 bg-gray-100 rounded">Mastercard</span>
									<span className="text-xs px-2 py-1 bg-gray-100 rounded">American Express</span>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="font-medium text-[#212529]">Shipping Information:</h3>
								<p className="text-sm text-[#6C757D]">
									You will enter your shipping address on the next page.
								</p>
							</div>

							<form action={createCheckoutSession}>
								<Button type="submit" className="w-full vero-button py-4 text-base" size="lg">
									<ShoppingBag className="mr-2 h-5 w-5" />
									Proceed to Payment
								</Button>
							</form>

							<div className="flex items-center justify-center gap-2 text-xs text-[#6C757D]">
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								<span>Secure checkout powered by Stripe</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
