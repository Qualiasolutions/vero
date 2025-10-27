"use server";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";
import { logger } from "@/lib/logger";
import { getStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { clearCartAction, getCartAction } from "./cart-actions";

export async function createCheckoutSession() {
	try {
		const stripe = getStripeClient();
		const cart = await getCartAction();

		if (!cart || cart.items.length === 0) {
			logger.error("Checkout attempted with empty cart");
			redirect("/cart");
		}

		// Validate cart has valid prices
		const invalidItems = cart.items.filter((item) => !item.price || item.price === 0);
		if (invalidItems.length > 0) {
			logger.error("Cart contains items with invalid prices", undefined, {
				invalidItems: invalidItems.map((item) => ({
					productId: item.productId,
					name: item.product?.name,
					price: item.price,
				})),
			});
			throw new Error(
				`Cannot proceed to checkout: ${invalidItems.length} item(s) have invalid pricing. Please remove these items and try again.`,
			);
		}

		// Debug: Log cart details
		logger.debug("Creating checkout session", {
			cartCurrency: cart.currency,
			itemCount: cart.items.length,
			total: cart.total,
		});

		// Create Stripe line items from cart
		const lineItems = cart.items.map((item) => ({
			price_data: {
				currency: cart.currency, // Use currency from cart (derived from Stripe products)
				product_data: {
					name: item.product?.name || "Product",
					images: item.product?.images || [],
				},
				unit_amount: item.price,
			},
			quantity: item.quantity,
		}));

		logger.checkoutEvent("creating_stripe_session", {
			lineItemsCount: lineItems.length,
			totalAmount: cart.total,
			currency: (cart.currency || "unknown").toUpperCase(),
		});

		// Create Stripe Checkout session
		// Use NEXT_PUBLIC_URL if available, fallback to VERCEL_URL (auto-set by Vercel)
		const baseUrl =
			env.NEXT_PUBLIC_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${baseUrl}/checkout/cancel`,
			metadata: {
				cart_items: JSON.stringify(cart.items.map((i) => ({ id: i.productId, quantity: i.quantity }))),
			},
		});

		logger.checkoutEvent("stripe_session_created", { sessionId: session.id });

		// Redirect to Stripe Checkout
		redirect(session.url!);
	} catch (error) {
		logger.error("Critical checkout error", error);

		throw error;
	}
}

export async function createOrderFromCheckout(sessionId: string) {
	try {
		const supabase = await createClient();
		const stripe = getStripeClient();
		// Retrieve the Stripe session with line items to get actual prices
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["line_items", "line_items.data.price", "customer"],
		});

		if (session.payment_status !== "paid") {
			throw new Error("Payment not completed");
		}

		// Get current user from Supabase
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		let userId: string | null = null;
		let userEmail: string | null = session.customer_details?.email || session.customer_email || null;

		// If user is authenticated, use their ID
		if (user && !userError) {
			userId = user.id;
			userEmail = user.email || null;

			// Ensure user exists in users table
			await ensureUserExists(user);
		} else if (userEmail) {
			// Handle guest checkout - try to find or create user by email
			userId = await findOrCreateUserByEmail(userEmail, session.customer_details?.name || undefined);
		}

		// Get cart items from metadata
		const cartItems = JSON.parse(session.metadata?.cart_items || "[]") as Array<{
			id: string;
			quantity: number;
		}>;

		// Create a map of product IDs to prices from the session line items
		const priceMap = new Map<string, number>();
		if (session.line_items?.data) {
			for (const lineItem of session.line_items.data) {
				const productId =
					typeof lineItem.price?.product === "string" ? lineItem.price.product : lineItem.price?.product?.id;
				if (productId && lineItem.price?.unit_amount) {
					priceMap.set(productId, lineItem.price.unit_amount);
				}
			}
		}

		// Prepare order data with user association
		const orderData: {
			stripe_checkout_session_id: string;
			stripe_payment_intent_id: string;
			total_amount: number;
			currency: string;
			status: string;
			user_id?: string;
			shipping_address?: unknown;
			billing_address?: unknown;
		} = {
			stripe_checkout_session_id: sessionId,
			stripe_payment_intent_id: session.payment_intent as string,
			total_amount: session.amount_total ?? 0,
			currency: (session.currency || env.STRIPE_CURRENCY || "usd").toUpperCase(),
			status: "pending",
		};

		// Add user_id if we have a user
		if (userId) {
			orderData.user_id = userId;
		}

		// Add customer details from Stripe
		if (session.customer_details) {
			// CustomerDetails doesn't have shipping/billing properties directly
			// These are typically in the session metadata or separate fields
			// For now, we'll skip this as it's not essential for order creation
		}

		// Create order in Supabase
		const { data: order, error } = await supabase.from("orders").insert(orderData).select().single();

		if (error || !order) {
			logger.error("Failed to create order", error, { sessionId, userId });
			throw new Error("Failed to create order");
		}

		// Create order items with actual prices from Stripe
		for (const item of cartItems) {
			const priceAtTime = priceMap.get(item.id) || 0;
			const { error: orderItemError } = await supabase.from("order_items").insert({
				order_id: order.id,
				product_id: item.id,
				quantity: item.quantity,
				price_at_time: priceAtTime,
			});

			if (orderItemError) {
				throw orderItemError;
			}
		}

		// Clear the cart
		await clearCartAction();

		return order;
	} catch (error) {
		logger.error("Error creating order from checkout", error, { sessionId });
		throw error;
	}
}

// Helper functions for user management
async function ensureUserExists(authUser: User): Promise<string> {
	const supabase = await createClient();

	// Check if user exists in users table
	const { data: existingUser } = await supabase
		.from("users")
		.select("id")
		.eq("email", authUser.email)
		.single();

	if (existingUser) {
		return existingUser.id;
	}

	// Create user record
	const { data: newUser, error } = await supabase
		.from("users")
		.insert({
			email: authUser.email,
			first_name: authUser.user_metadata?.full_name?.split(" ")[0] || "",
			last_name: authUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
			email_verified: authUser.email_confirmed_at !== null,
		})
		.select("id")
		.single();

	if (error || !newUser) {
		logger.error("Failed to create user record", error, { email: authUser.email });
		throw new Error("Failed to create user record");
	}

	return newUser.id;
}

async function findOrCreateUserByEmail(email: string, name?: string): Promise<string | null> {
	const supabase = await createClient();

	// Check if user exists in users table
	const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();

	if (existingUser) {
		return existingUser.id;
	}

	// Create user record for guest checkout
	const { data: newUser, error } = await supabase
		.from("users")
		.insert({
			email: email,
			first_name: name?.split(" ")[0] || "",
			last_name: name?.split(" ").slice(1).join(" ") || "",
			email_verified: true, // Assume guest checkout emails are valid
		})
		.select("id")
		.single();

	if (error || !newUser) {
		logger.error("Failed to create guest user record", error, { email });
		return null;
	}

	return newUser.id;
}

// Get orders for the current user
export async function getOrdersForUser() {
	const supabase = await createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		logger.debug("No authenticated user found for order retrieval");
		return [];
	}

	try {
		// First fetch orders with their items
		const { data: orders, error } = await supabase
			.from("orders")
			.select(`
				*,
				order_items (
					*
				)
			`)
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });

		if (error) {
			logger.error("Failed to fetch orders for user", error, { userId: user.id });
			return [];
		}

		if (!orders || orders.length === 0) {
			return [];
		}

		// Fetch product information from Stripe for all products in the orders
		const stripe = getStripeClient();
		const productIds = new Set<string>();

		// Collect all unique product IDs from all orders
		orders.forEach((order: any) => {
			order.order_items.forEach((item: any) => {
				productIds.add(item.product_id);
			});
		});

		// Fetch product information from Stripe
		const productsMap = new Map<string, any>();
		try {
			for (const productId of productIds) {
				try {
					const product = await stripe.products.retrieve(productId);
					productsMap.set(productId, {
						name: product.name,
						images: product.images || [],
						description: product.description || '',
					});
				} catch (productError) {
					logger.warn("Failed to fetch product from Stripe", { error: productError, productId });
					// Add a fallback product info
					productsMap.set(productId, {
						name: 'Unknown Product',
						images: [],
						description: 'Product information unavailable',
					});
				}
			}
		} catch (stripeError) {
			logger.error("Failed to fetch products from Stripe", stripeError);
			// Return orders without product info if Stripe fails
			return orders.map((order: any) => ({
				...order,
				order_items: order.order_items.map((item: any) => ({
					...item,
					product_info: {
						name: 'Unknown Product',
						images: [],
						description: 'Product information unavailable',
					},
				})),
			}));
		}

		// Combine order data with product information
		const ordersWithProductInfo = orders.map((order: any) => ({
			...order,
			order_items: order.order_items.map((item: any) => ({
				...item,
				product_info: productsMap.get(item.product_id) || {
					name: 'Unknown Product',
					images: [],
					description: 'Product information unavailable',
				},
			})),
		}));

		return ordersWithProductInfo;
	} catch (error) {
		logger.error("Error in getOrdersForUser", error, { userId: user.id });
		return [];
	}
}

// Alias for backward compatibility
export const completeCheckout = createOrderFromCheckout;
