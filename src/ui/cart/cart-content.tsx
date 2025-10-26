"use client";

import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";

export function CartContent() {
	const { cart, optimisticUpdate, optimisticRemove } = useCart();
	const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
	const router = useRouter();

	const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		setProcessingItems((prev) => new Set(prev).add(itemId));
		try {
			await optimisticUpdate(itemId, newQuantity);
		} finally {
			setProcessingItems((prev) => {
				const next = new Set(prev);
				next.delete(itemId);
				return next;
			});
		}
	};

	const handleRemoveItem = async (itemId: string) => {
		setProcessingItems((prev) => new Set(prev).add(itemId));
		try {
			await optimisticRemove(itemId);
		} finally {
			setProcessingItems((prev) => {
				const next = new Set(prev);
				next.delete(itemId);
				return next;
			});
		}
	};

	const handleCheckout = async () => {
		setIsCheckoutLoading(true);
		router.push("/checkout");
	};

	if (!cart || !cart.items || cart.items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24">
				<div className="mb-6 p-10 rounded-2xl bg-gradient-to-br from-[#dfbc3f]/10 to-[#dfbc3f]/5 border-2 border-[#dfbc3f]/20">
					<ShoppingBag className="h-20 w-20 text-[#dfbc3f]" />
				</div>
				<h2 className="text-2xl md:text-3xl font-light text-[var(--selfridges-text-primary)] mb-4 uppercase tracking-wider">
					Your Cart is Empty
				</h2>
				<p className="text-base text-[var(--selfridges-text-muted)] mb-8 max-w-md leading-relaxed">
					Add some premium 1:18 scale diecast models to your cart and start building your collection!
				</p>
				<Link
					href="/products"
					className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#dfbc3f] to-[#c4a535] text-black font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
				>
					<ShoppingBag className="h-5 w-5" />
					Browse Products
				</Link>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			{/* Cart Items */}
			<div className="space-y-4 mb-8">
				{cart.items.map((item) => {
					const product = item.product;
					const price = item.price || 0;
					const isProcessing = processingItems.has(item.id);

					return (
						<div
							key={item.id}
							className="flex gap-4 p-4 sm:p-6 border-2 border-[#dfbc3f]/10 rounded-xl bg-gradient-to-br from-white to-[#dfbc3f]/5 hover:border-[#dfbc3f]/30 transition-all duration-300"
						>
							{/* Product Image */}
							<div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-[#dfbc3f]/20 rounded-xl overflow-hidden">
								{product?.images?.[0] ? (
									<Image
										src={product.images[0]}
										alt={product.name || "Product"}
										width={128}
										height={128}
										className="w-full h-full object-contain p-2"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-[#dfbc3f]/5">
										<ShoppingBag className="w-8 h-8 text-[#dfbc3f]/30" />
									</div>
								)}
							</div>

							{/* Product Info */}
							<div className="flex-1 min-w-0 flex flex-col justify-between">
								<div>
									<h3 className="text-base sm:text-lg font-semibold text-[var(--selfridges-text-primary)] mb-2 line-clamp-2">
										{product?.name || `Product ${item.productId}`}
									</h3>
									<p className="text-lg sm:text-xl font-bold text-[#dfbc3f] mb-4">
										{formatMoney({
											amount: price,
											currency: cart.currency || "aed",
											locale: "en-US",
										})}
									</p>
								</div>

								{/* Quantity Controls & Remove */}
								<div className="flex items-center gap-3">
									<div className="flex items-center border-2 border-[#dfbc3f]/30 rounded-lg overflow-hidden">
										<button
											type="button"
											onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
											disabled={isProcessing || item.quantity <= 1}
											className="px-3 py-2 bg-white hover:bg-[#dfbc3f]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											<Minus className="w-4 h-4 text-[#dfbc3f]" />
										</button>
										<span className="px-4 py-2 bg-white text-sm font-semibold text-[var(--selfridges-text-primary)] min-w-[3rem] text-center">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
											disabled={isProcessing}
											className="px-3 py-2 bg-white hover:bg-[#dfbc3f]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											<Plus className="w-4 h-4 text-[#dfbc3f]" />
										</button>
									</div>

									<button
										type="button"
										onClick={() => handleRemoveItem(item.id)}
										disabled={isProcessing}
										className="p-2 rounded-lg border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 transition-all disabled:opacity-50"
										title="Remove item"
									>
										{isProcessing ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<Trash2 className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Cart Summary */}
			<div className="border-t-2 border-[#dfbc3f]/20 pt-6">
				<div className="max-w-md ml-auto space-y-4">
					<div className="flex items-center justify-between text-base">
						<span className="text-[var(--selfridges-text-muted)] uppercase tracking-wide">Subtotal:</span>
						<span className="font-semibold text-[var(--selfridges-text-primary)]">
							{formatMoney({
								amount: cart.total || 0,
								currency: cart.currency || "aed",
								locale: "en-US",
							})}
						</span>
					</div>
					<div className="flex items-center justify-between text-lg">
						<span className="text-[var(--selfridges-text-primary)] font-semibold uppercase tracking-wide">
							Total:
						</span>
						<span className="text-2xl font-bold text-[#dfbc3f]">
							{formatMoney({
								amount: cart.total || 0,
								currency: cart.currency || "aed",
								locale: "en-US",
							})}
						</span>
					</div>

					<button
						type="button"
						onClick={handleCheckout}
						disabled={isCheckoutLoading}
						className="w-full py-4 rounded-xl bg-gradient-to-r from-[#dfbc3f] to-[#c4a535] text-black font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isCheckoutLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Processing...
							</>
						) : (
							<>
								Proceed to Checkout
								<ShoppingBag className="w-5 h-5" />
							</>
						)}
					</button>

					<p className="text-xs text-center text-[var(--selfridges-text-muted)] pt-2">
						Secure checkout powered by Stripe
					</p>
				</div>
			</div>
		</div>
	);
}
