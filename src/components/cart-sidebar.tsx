"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { logger } from "@/lib/logger";
import { formatMoney } from "@/lib/utils";

interface CartSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
	const { cart, itemCount, optimisticUpdate, optimisticRemove } = useCart();
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	async function handleUpdateQuantity(productId: string, quantity: number) {
		try {
			await optimisticUpdate(productId, quantity);
		} catch (error) {
			logger.error("Failed to update cart quantity", { productId, quantity, error });
		}
	}

	async function handleRemoveItem(productId: string) {
		try {
			await optimisticRemove(productId);
		} catch (error) {
			logger.error("Failed to remove cart item", { productId, error });
		}
	}

	async function handleCheckout() {
		if (isCheckingOut) return;

		setIsCheckingOut(true);
		try {
			// Import the checkout action dynamically to avoid bundling it in client
			const { createCheckoutSession } = await import("@/actions/checkout-actions");
			// createCheckoutSession() uses redirect() which will handle navigation
			await createCheckoutSession();
		} catch (error) {
			logger.error("Checkout failed", { error });
			alert("Checkout failed. Please try again or contact support.");
			// Could show a toast notification here in the future
			// For now, the error is already logged in the server action
		} finally {
			setIsCheckingOut(false);
		}
	}

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay with blur and fade animation */}
			<div
				className={`fixed inset-0 z-40 h-screen w-screen backdrop-blur-sm bg-black/30 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={onClose}
			/>

			{/* Sidebar with slide-in animation */}
			<div
				className={`fixed right-0 top-0 z-50 h-screen w-full xs:w-[340px] sm:w-[380px] md:w-[420px] max-w-full bg-white border-l-2 border-[#dfbc3f]/30 shadow-2xl shadow-[#dfbc3f]/20 transition-all duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-[#C4A962]/30 p-4 xs:p-5 sm:p-6 bg-gradient-to-b from-[#FDFBF7] to-white">
						<div className="flex items-center gap-2 xs:gap-3">
							<ShoppingBag className="h-4 w-4 xs:h-5 xs:w-5 text-[#C4A962]" />
							<h2 className="text-base xs:text-lg font-light uppercase tracking-wider text-[#111827]">
								Cart <span className="text-[#C4A962]">({itemCount})</span>
							</h2>
						</div>
						<button
							onClick={onClose}
							className="rounded-full p-2 hover:bg-[#C4A962]/20 text-[#C4A962] transition-colors"
							aria-label="Close cart"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Content - Mobile optimized */}
					<div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
						{!cart || !cart.items || cart.items.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
								<ShoppingBag className="h-16 w-16 text-[#C4A962]/30" />
								<div>
									<h3 className="font-light text-[#111827] text-lg">Your cart is empty</h3>
									<p className="text-sm text-[#6B7280] mt-2">Start shopping to add premium models</p>
								</div>
							</div>
						) : (
							<div className="p-3 xs:p-4 space-y-3 xs:space-y-4">
								{cart.items.map((item, index) => {
									// Product info is now directly available in item.product
									const product = item.product;
									const price = item.price;
									// Use productId as the primary identifier for cart operations
									const itemId = item.productId || item.variantId || item.id;

									return (
										<div
											key={item.id}
											className="flex items-start gap-2 xs:gap-3 border-b border-[#dfbc3f]/20 pb-3 xs:pb-4 animate-fade-in"
											style={{ animationDelay: `${index * 50}ms` }}
										>
											{/* Product Image */}
											<div className="flex-shrink-0 w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-[#F8F9FA] border-2 border-[#dfbc3f]/30 rounded-lg overflow-hidden">
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
														<ShoppingBag className="h-6 w-6 text-[#C4A962]/30" />
													</div>
												)}
											</div>

											{/* Product Info */}
											<div className="flex-1 min-w-0">
												<h3 className="font-light text-xs xs:text-sm text-[#111827] leading-snug">
													{product?.name || `Product ${item.productId}`}
												</h3>
												<p className="text-xs xs:text-sm vero-text-gradient font-semibold mt-0.5 xs:mt-1">
													{formatMoney({
														amount: price, // Already in cents from Stripe
														currency: cart.currency || "aed",
														locale: "en-US",
													})}
												</p>
											</div>

											{/* Quantity Controls */}
											<div className="flex flex-col items-end gap-2">
												<button
													onClick={() => handleRemoveItem(itemId)}
													className="text-red-500 hover:text-red-600 p-1 transition-colors"
													aria-label="Remove item"
													title="Remove from cart"
												>
													<X className="h-4 w-4" />
												</button>
												<div className="flex items-center gap-1 bg-[#dfbc3f]/10 border-2 border-[#dfbc3f]/30 rounded-full px-2 py-1">
													<button
														onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
														className="rounded-full p-1 hover:bg-[#dfbc3f]/30 text-[#dfbc3f] transition-all duration-200 hover:scale-110 active:scale-95"
														disabled={item.quantity <= 1}
														aria-label="Decrease quantity"
													>
														<Minus className="h-3 w-3" />
													</button>
													<span className="min-w-[1.5rem] text-center text-sm font-bold text-[#111827]">
														{item.quantity}
													</span>
													<button
														onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
														className="rounded-full p-1 hover:bg-[#dfbc3f]/30 text-[#dfbc3f] transition-all duration-200 hover:scale-110 active:scale-95"
														aria-label="Increase quantity"
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
						<div className="border-t-2 border-[#dfbc3f]/30 p-4 xs:p-5 sm:p-6 space-y-3 xs:space-y-4 bg-gradient-to-t from-[#fef9e7] to-white">
							<div className="flex items-center justify-between">
								<span className="text-xs xs:text-sm uppercase tracking-wider text-[#6B7280]">Total:</span>
								<span className="text-xl xs:text-2xl font-semibold vero-text-gradient">
									{formatMoney({
										amount: cart.total || 0, // Already in fils (smallest unit)
										currency: cart.currency || "aed",
										locale: "en-US",
									})}
								</span>
							</div>
							<button
								onClick={handleCheckout}
								disabled={isCheckingOut}
								className="vero-button w-full rounded-lg px-6 py-4 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isCheckingOut ? (
									<>
										<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
												fill="none"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Processing...
									</>
								) : (
									"Proceed to Checkout"
								)}
							</button>
							<p className="text-[10px] xs:text-xs text-center text-[#6B7280]">
								Secure checkout powered by Stripe
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
