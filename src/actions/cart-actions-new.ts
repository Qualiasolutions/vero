"use server";

import type { Cart } from "commerce-kit";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
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

interface DbCartItem {
	id: string;
	product_id: string;
	quantity: number;
	created_at: string;
	updated_at: string;
	session_id: string;
	user_id: string | null;
}

// Helper to transform DB cart items to Cart type
async function transformCart(items: DbCartItem[]): Promise<Cart> {
	// Default currency fallback
	let cartCurrency = "eur";

	const cartItems = await Promise.all(
		items.map(async (item) => {
			try {
				// Fetch product from Stripe
				const product = await stripe.products.retrieve(item.product_id);

				// Fetch prices for this product (handles both default_price and standalone prices)
				let price: Stripe.Price | null = null;

				// Try to get default_price if it exists
				if (product.default_price) {
					if (typeof product.default_price === "string") {
						price = await stripe.prices.retrieve(product.default_price);
					} else {
						price = product.default_price as Stripe.Price;
					}
				} else {
					// If no default_price, fetch the first active price for this product
					const prices = await stripe.prices.list({
						product: item.product_id,
						active: true,
						limit: 1,
					});

					if (prices.data.length > 0) {
						price = prices.data[0] || null;
					}
				}

				// Validate that we got a valid price
				if (!price || typeof price.unit_amount !== "number") {
					console.error(
						`❌ STRIPE PRICING ERROR: Product ${item.product_id} has no valid price. Price object:`,
						price,
					);
					throw new Error(
						`Product ${product.name || item.product_id} is missing price information in Stripe. Please check Stripe Dashboard.`,
					);
				}

				return {
					id: item.id,
					productId: item.product_id,
					variantId: item.product_id,
					quantity: item.quantity,
					price: price.unit_amount,
					currency: price.currency, // Store on item for extraction
					product: {
						id: product.id,
						name: product.name,
						description: product.description || undefined,
						images: product.images || [],
						metadata: product.metadata || {},
					},
				};
			} catch (error) {
				// Enhanced error logging with more context
				console.error(`❌ CRITICAL STRIPE ERROR: Failed to fetch product ${item.product_id}`);
				console.error("Error details:", error);
				console.error("This usually means:");
				console.error("  1. Stripe API keys are invalid or missing");
				console.error("  2. Product doesn't exist in Stripe");
				console.error("  3. Network/API connectivity issue");

				// Don't silently fail - this will break checkout
				throw new Error(
					`Unable to load product pricing for ${item.product_id}. ${
						error instanceof Error ? error.message : "Unknown error"
					}`,
				);
			}
		}),
	);

	// Price is already in smallest currency unit (cents/fils/etc), so total is also in smallest unit
	// No need to divide by 100 - that's only for display formatting
	const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Extract currency from first item (all items should have same currency)
	if (cartItems.length > 0 && (cartItems[0] as any).currency) {
		cartCurrency = (cartItems[0] as any).currency;
		console.log("✓ Extracted currency from first cart item:", cartCurrency);
	} else {
		console.log("⚠️ No currency found on first cart item, using default:", cartCurrency);
		console.log("   First cart item:", JSON.stringify(cartItems[0], null, 2));
	}

	return {
		id: items[0]?.id || "empty",
		items: cartItems,
		total,
		currency: cartCurrency,
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
				currency: "aed",
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
				currency: "aed",
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
				currency: "aed",
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
