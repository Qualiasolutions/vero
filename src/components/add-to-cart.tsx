"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface AddToCartProps {
	variantId: string;
	quantity?: number;
	className?: string;
	children?: React.ReactNode;
	onSuccess?: () => void;
}

export function AddToCart({ variantId, quantity = 1, className = "", children, onSuccess }: AddToCartProps) {
	const { openCart, optimisticAdd } = useCart();

	const handleAddToCart = async () => {
		try {
			await optimisticAdd(variantId, quantity);
			onSuccess?.();
			openCart(); // Open cart sidebar after adding item
		} catch (_error) {
			// Error is already logged in context, could show error toast here
		}
	};

	return (
		<button
			onClick={handleAddToCart}
			className={`vero-button flex items-center justify-center gap-2 px-8 py-3 rounded-md uppercase tracking-wide ${className}`}
		>
			{children || (
				<>
					<Plus className="h-4 w-4" />
					Add to Cart
				</>
			)}
		</button>
	);
}
