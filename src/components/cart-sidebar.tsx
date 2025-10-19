"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";

interface CartSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
	const { cart, itemCount, optimisticUpdate, optimisticRemove } = useCart();

	async function handleUpdateQuantity(variantId: string, quantity: number) {
		try {
			await optimisticUpdate(variantId, quantity);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	async function handleRemoveItem(variantId: string) {
		try {
			await optimisticRemove(variantId);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	async function handleCheckout() {
		try {
			// Import the checkout action dynamically to avoid bundling it in client
			const { createCheckoutSession } = await import("@/actions/checkout-actions");
			await createCheckoutSession();
		} catch (error) {
			console.error("Checkout error:", error);
			// Could show error toast here
		}
	}

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay with blur */}
			<div
				className="fixed inset-0 z-40 h-screen w-screen backdrop-blur-sm bg-black/30 transition-opacity"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed right-0 top-0 z-50 h-screen w-full sm:w-96 max-w-full bg-white border-l-2 border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10 transition-transform">
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-[#D4AF37]/30 p-6 bg-gradient-to-b from-[#FDFBF7] to-white">
						<div className="flex items-center gap-3">
							<ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
							<h2 className="text-lg font-light uppercase tracking-wider text-[#212529]">
								Cart <span className="text-[#D4AF37]">({itemCount})</span>
							</h2>
						</div>
						<button
							onClick={onClose}
							className="rounded-full p-2 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-colors"
							aria-label="Close cart"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto bg-white">
						{!cart || !cart.items || cart.items.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
								<ShoppingBag className="h-16 w-16 text-[#D4AF37]/30" />
								<div>
									<h3 className="font-light text-[#212529] text-lg">Your cart is empty</h3>
									<p className="text-sm text-[#6C757D] mt-2">Start shopping to add premium models</p>
								</div>
							</div>
						) : (
							<div className="p-4 space-y-4">
								{cart.items.map((item) => {
									// Product info is now directly available in item.product
									const product = item.product;
									const price = item.price; // Already in dollars

									return (
										<div key={item.id} className="flex items-start gap-3 border-b border-[#D4AF37]/20 pb-4">
											{/* Product Image */}
											<div className="flex-shrink-0 w-20 h-20 bg-[#F8F9FA] border border-[#D4AF37]/20 rounded-lg overflow-hidden">
												{product?.images?.[0] ? (
													<Image
														src={product.images[0]}
														alt={product.name || "Product"}
														width={80}
														height={80}
														className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<ShoppingBag className="h-6 w-6 text-[#D4AF37]/30" />
													</div>
												)}
											</div>

											{/* Product Info */}
											<div className="flex-1 min-w-0">
												<h3 className="font-light text-sm text-[#212529] leading-snug">
													{product?.name || `Product ${item.productId}`}
												</h3>
												<p className="text-sm vero-text-gradient font-semibold mt-1">
													{formatMoney({
														amount: price, // Already in cents from Stripe
														currency: cart.currency || "USD",
														locale: "en-US",
													})}
												</p>
											</div>

											{/* Quantity Controls */}
											<div className="flex flex-col items-end gap-2">
												<button
													onClick={() => handleRemoveItem(item.variantId || item.productId)}
													className="text-red-500 hover:text-red-600 p-1 transition-colors"
													aria-label="Remove item"
												>
													<X className="h-4 w-4" />
												</button>
												<div className="flex items-center gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-2 py-1">
													<button
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity - 1)
														}
														className="rounded-full p-1 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-colors"
														disabled={item.quantity <= 1}
													>
														<Minus className="h-3 w-3" />
													</button>
													<span className="min-w-[1.5rem] text-center text-sm font-medium text-[#212529]">
														{item.quantity}
													</span>
													<button
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity + 1)
														}
														className="rounded-full p-1 hover:bg-[#D4AF37]/20 text-[#D4AF37] transition-colors"
													>
														<Plus className="h-3 w-3" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer with Total */}
					{cart && cart.items.length > 0 && (
						<div className="border-t border-[#D4AF37]/30 p-6 space-y-4 bg-gradient-to-t from-[#FDFBF7] to-white">
							<div className="flex items-center justify-between">
								<span className="text-sm uppercase tracking-wider text-[#6C757D]">Total:</span>
								<span className="text-2xl font-semibold vero-text-gradient">
									{formatMoney({
										amount: Math.round((cart.total || 0) * 100), // Convert to cents
										currency: cart.currency || "USD",
										locale: "en-US",
									})}
								</span>
							</div>
							<button
								onClick={handleCheckout}
								className="vero-button w-full rounded-lg px-6 py-4 uppercase tracking-wider"
							>
								Proceed to Checkout
							</button>
							<p className="text-xs text-center text-[#6C757D]">Secure checkout powered by Stripe</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
