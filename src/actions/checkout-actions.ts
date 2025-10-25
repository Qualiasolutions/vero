"use server";

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
			expand: ["line_items", "line_items.data.price"],
		});

		if (session.payment_status !== "paid") {
			throw new Error("Payment not completed");
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

		// Create order in Supabase
		const { data: order, error } = await supabase
			.from("orders")
			.insert({
				stripe_checkout_session_id: sessionId,
				stripe_payment_intent_id: session.payment_intent as string,
				total_amount: session.amount_total ?? 0,
				currency: (session.currency || env.STRIPE_CURRENCY || "usd").toUpperCase(),
				status: "pending",
			})
			.select()
			.single();

		if (error || !order) {
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

// Alias for backward compatibility
export const completeCheckout = createOrderFromCheckout;
