"use server";

import type { Cart } from "commerce-kit";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import type Stripe from "stripe";
import { env } from "@/env.mjs";
import { getStripeClient } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

const DEFAULT_CURRENCY = (env.STRIPE_CURRENCY ?? "USD").toUpperCase();

interface DbCartItem {
	id: string;
	product_id: string;
	quantity: number;
	created_at: string;
	updated_at: string;
	session_id: string;
	user_id: string | null;
}

const createEmptyCart = (sessionId: string): Cart => ({
	id: sessionId,
	items: [],
	total: 0,
	currency: DEFAULT_CURRENCY,
});

const getStripeSession = (): Stripe => {
	try {
		return getStripeClient();
	} catch (error) {
		console.error("Stripe client initialisation failed:", error);
		throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment.");
	}
};

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

async function resolveStripeProductWithPrice(item: DbCartItem, stripe: Stripe) {
	const product = await stripe.products.retrieve(item.product_id, {
		expand: ["default_price"],
	});

	let price: Stripe.Price | null = null;

	if (product.default_price && typeof product.default_price !== "string") {
		price = product.default_price;
	} else if (typeof product.default_price === "string") {
		price = await stripe.prices.retrieve(product.default_price);
	} else {
		const prices = await stripe.prices.list({
			product: item.product_id,
			active: true,
			limit: 1,
		});

		price = prices.data[0] ?? null;
	}

	if (!price || typeof price.unit_amount !== "number") {
		throw new Error(`Product ${product.id} is missing a valid price in Stripe.`);
	}

	return { product, price };
}

// Helper to transform DB cart items to Cart type
async function transformCart(sessionId: string, items: DbCartItem[], stripe: Stripe): Promise<Cart> {
	if (items.length === 0) {
		return createEmptyCart(sessionId);
	}

	const stripeItems = await Promise.all(
		items.map(async (item) => {
			try {
				const { product, price } = await resolveStripeProductWithPrice(item, stripe);
				return {
					cartItem: {
						id: item.id,
						productId: item.product_id,
						variantId: price.id,
						quantity: item.quantity,
						price: price.unit_amount!,
						product: {
							id: product.id,
							name: product.name,
							description: product.description ?? undefined,
							images: product.images ?? [],
							metadata: product.metadata ?? {},
						},
					},
					currency: price.currency.toUpperCase(),
				};
			} catch (error) {
				console.error(`Failed to load Stripe product ${item.product_id}:`, error);
				throw error;
			}
		}),
	);

	const currencies = new Set(stripeItems.map((entry) => entry.currency));
	if (currencies.size > 1) {
		console.warn("Cart contains items with multiple currencies, defaulting to first currency.", {
			currencies: Array.from(currencies),
		});
	}

	const cartItems = stripeItems.map((entry) => entry.cartItem);
	const currency = stripeItems[0]?.currency ?? DEFAULT_CURRENCY;
	const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return {
		id: sessionId,
		items: cartItems,
		total,
		currency,
	};
}

export async function getCartAction(): Promise<Cart | null> {
	try {
		const sessionId = await getCartSessionId();
		const { data: items, error } = await supabase
			.from("cart_items")
			.select("*")
			.eq("session_id", sessionId)
			.order("created_at", { ascending: true });

		if (error) {
			console.error("Error loading cart items:", error);
			return null;
		}

		if (!items || items.length === 0) {
			return null;
		}

		const stripe = getStripeSession();
		return transformCart(sessionId, items, stripe);
	} catch (error) {
		console.error("Error getting cart:", error);
		return null;
	}
}

export async function addToCartAction(variantId: string, quantity: number): Promise<Cart> {
	const sessionId = await getCartSessionId();

	try {
		const { data: existingItem, error: selectError } = await supabase
			.from("cart_items")
			.select("*")
			.match({ session_id: sessionId, product_id: variantId })
			.maybeSingle();

		if (selectError) {
			throw selectError;
		}

		if (existingItem) {
			const { error } = await supabase
				.from("cart_items")
				.update({
					quantity: existingItem.quantity + quantity,
					updated_at: new Date().toISOString(),
				})
				.eq("id", existingItem.id);

			if (error) {
				throw error;
			}
		} else {
			const { error } = await supabase.from("cart_items").insert({
				session_id: sessionId,
				product_id: variantId,
				quantity,
			});

			if (error) {
				throw error;
			}
		}

		const cart = await getCartAction();
		return cart ?? createEmptyCart(sessionId);
	} catch (error) {
		console.error("Error adding to cart:", error);
		throw error;
	}
}

export async function updateCartItemAction(variantId: string, quantity: number): Promise<Cart> {
	const sessionId = await getCartSessionId();

	try {
		if (quantity <= 0) {
			const { error } = await supabase
				.from("cart_items")
				.delete()
				.match({ session_id: sessionId, product_id: variantId });

			if (error) {
				throw error;
			}
		} else {
			const { error } = await supabase
				.from("cart_items")
				.update({
					quantity,
					updated_at: new Date().toISOString(),
				})
				.match({ session_id: sessionId, product_id: variantId });

			if (error) {
				throw error;
			}
		}

		const cart = await getCartAction();
		return cart ?? createEmptyCart(sessionId);
	} catch (error) {
		console.error("Error updating cart item:", error);
		throw error;
	}
}

export async function removeFromCartAction(variantId: string): Promise<Cart> {
	const sessionId = await getCartSessionId();

	try {
		const { error } = await supabase
			.from("cart_items")
			.delete()
			.match({ session_id: sessionId, product_id: variantId });

		if (error) {
			throw error;
		}

		const cart = await getCartAction();
		return cart ?? createEmptyCart(sessionId);
	} catch (error) {
		console.error("Error removing from cart:", error);
		throw error;
	}
}

export async function getCartItemCount(): Promise<number> {
	try {
		const sessionId = await getCartSessionId();
		const { data: items, error } = await supabase
			.from("cart_items")
			.select("quantity")
			.eq("session_id", sessionId);

		if (error) {
			throw error;
		}

		return items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
	} catch (error) {
		console.error("Error getting cart item count:", error);
		return 0;
	}
}

export async function clearCartAction(): Promise<void> {
	try {
		const sessionId = await getCartSessionId();
		const { error } = await supabase.from("cart_items").delete().eq("session_id", sessionId);
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error("Error clearing cart:", error);
		throw error;
	}
}

export async function cleanupExpiredCarts(): Promise<void> {
	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const { error } = await supabase
			.from("cart_items")
			.delete()
			.is("user_id", null)
			.lt("created_at", thirtyDaysAgo.toISOString());

		if (error) {
			throw error;
		}
	} catch (error) {
		console.error("Error cleaning up expired carts:", error);
		throw error;
	}
}
