"use server";

import type { Cart } from "commerce-kit";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// Get or create cart session ID
async function getCartSessionId(): Promise<string> {
	const cookieStore = await cookies();
	let sessionId = cookieStore.get("yns_cart_id")?.value;

	if (!sessionId) {
		sessionId = nanoid();
		cookieStore.set("yns_cart_id", sessionId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});
	}

	return sessionId;
}

// Helper to transform DB cart items to Cart type
async function transformCart(items: any[]): Promise<Cart> {
	const cartItems = await Promise.all(
		items.map(async (item) => {
			try {
				// Fetch product from Stripe
				const product = await stripe.products.retrieve(item.product_id, {
					expand: ["default_price"],
				});

				const price = product.default_price as Stripe.Price;

				return {
					id: item.id,
					productId: item.product_id,
					variantId: item.product_id,
					quantity: item.quantity,
					price: typeof price.unit_amount === "number" ? price.unit_amount : 0,
					product: {
						id: product.id,
						name: product.name,
						description: product.description || undefined,
						images: product.images || [],
						metadata: product.metadata || {},
					},
				};
			} catch (error) {
				console.error(`Error fetching product ${item.product_id}:`, error);
				// Return item with minimal data if Stripe fetch fails
				return {
					id: item.id,
					productId: item.product_id,
					variantId: item.product_id,
					quantity: item.quantity,
					price: 0,
				};
			}
		}),
	);

	const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);

	return {
		id: items[0]?.id || "empty",
		items: cartItems,
		total,
		currency: "EUR",
	};
}

export async function getCartAction(): Promise<Cart | null> {
	try {
		const sessionId = await getCartSessionId();

		// Get cart items for this session
		const { data: items } = await supabase
			.from("cart_items")
			.select("*")
			.eq("session_id", sessionId)
			.order("created_at", { ascending: true });

		if (!items || items.length === 0) {
			return null;
		}

		return transformCart(items);
	} catch (error) {
		console.error("Error getting cart:", error);
		return null;
	}
}

export async function addToCartAction(variantId: string, quantity: number): Promise<Cart> {
	try {
		const sessionId = await getCartSessionId();

		// Check if item already exists in cart
		const { data: existingItem } = await supabase
			.from("cart_items")
			.select("*")
			.eq("session_id", sessionId)
			.eq("product_id", variantId)
			.single();

		if (existingItem) {
			// Update quantity
			await supabase
				.from("cart_items")
				.update({
					quantity: existingItem.quantity + quantity,
					updated_at: new Date().toISOString(),
				})
				.eq("id", existingItem.id);
		} else {
			// Add new item
			await supabase.from("cart_items").insert({
				session_id: sessionId,
				product_id: variantId,
				quantity,
			});
		}

		// Return updated cart
		const cart = await getCartAction();
		return (
			cart || {
				id: "empty",
				items: [],
				total: 0,
				currency: "EUR",
			}
		);
	} catch (error) {
		console.error("Error adding to cart:", error);
		throw error;
	}
}

export async function updateCartItemAction(variantId: string, quantity: number): Promise<Cart> {
	try {
		const sessionId = await getCartSessionId();

		if (quantity <= 0) {
			// Remove item if quantity is 0 or less
			await supabase.from("cart_items").delete().eq("session_id", sessionId).eq("product_id", variantId);
		} else {
			// Update quantity
			await supabase
				.from("cart_items")
				.update({
					quantity,
					updated_at: new Date().toISOString(),
				})
				.eq("session_id", sessionId)
				.eq("product_id", variantId);
		}

		// Return updated cart
		const cart = await getCartAction();
		return (
			cart || {
				id: "empty",
				items: [],
				total: 0,
				currency: "EUR",
			}
		);
	} catch (error) {
		console.error("Error updating cart item:", error);
		throw error;
	}
}

export async function removeFromCartAction(variantId: string): Promise<Cart> {
	try {
		const sessionId = await getCartSessionId();

		await supabase.from("cart_items").delete().eq("session_id", sessionId).eq("product_id", variantId);

		// Return updated cart
		const cart = await getCartAction();
		return (
			cart || {
				id: "empty",
				items: [],
				total: 0,
				currency: "EUR",
			}
		);
	} catch (error) {
		console.error("Error removing from cart:", error);
		throw error;
	}
}

export async function getCartItemCount(): Promise<number> {
	try {
		const sessionId = await getCartSessionId();

		const { data: items } = await supabase.from("cart_items").select("quantity").eq("session_id", sessionId);

		if (!items || items.length === 0) {
			return 0;
		}

		return items.reduce((sum, item) => sum + item.quantity, 0);
	} catch (error) {
		console.error("Error getting cart item count:", error);
		return 0;
	}
}

export async function clearCartAction(): Promise<void> {
	try {
		const sessionId = await getCartSessionId();
		await supabase.from("cart_items").delete().eq("session_id", sessionId);
	} catch (error) {
		console.error("Error clearing cart:", error);
	}
}

export async function cleanupExpiredCarts(): Promise<void> {
	try {
		// Delete cart items older than 30 days with no user_id (guest carts)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		await supabase
			.from("cart_items")
			.delete()
			.is("user_id", null)
			.lt("created_at", thirtyDaysAgo.toISOString());
	} catch (error) {
		console.error("Error cleaning up expired carts:", error);
	}
}
