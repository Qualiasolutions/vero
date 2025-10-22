"use server";

import { redirect } from "next/navigation";
import { env } from "@/env.mjs";
import { getStripeClient } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { clearCartAction, getCartAction } from "./cart-actions";

export async function createCheckoutSession() {
	try {
		const stripe = getStripeClient();
		const cart = await getCartAction();

		if (!cart || cart.items.length === 0) {
			console.error("❌ CHECKOUT ERROR: Cart is empty");
			redirect("/cart");
		}

		// Validate cart has valid prices
		const invalidItems = cart.items.filter((item) => !item.price || item.price === 0);
		if (invalidItems.length > 0) {
			console.error("❌ CHECKOUT ERROR: Cart contains items with invalid prices:");
			console.error(
				invalidItems.map((item) => ({
					productId: item.productId,
					name: item.product?.name,
					price: item.price,
				})),
			);
			throw new Error(
				`Cannot proceed to checkout: ${invalidItems.length} item(s) have invalid pricing. Please remove these items and try again.`,
			);
		}

		// Debug: Log cart details
		console.log("🛒 Cart currency:", cart.currency);
		console.log("🛒 Cart items:", JSON.stringify(cart.items, null, 2));

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

		console.log("💳 Creating Stripe checkout session with", lineItems.length, "items");
		console.log("💳 Line items:", JSON.stringify(lineItems, null, 2));
		console.log(
			"   Total amount:",
			cart.total,
			(cart.currency || "unknown").toUpperCase(),
			"(",
			lineItems.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0),
			"smallest units)",
		);

		// Create Stripe Checkout session
		// Use NEXT_PUBLIC_URL if available, fallback to VERCEL_URL (auto-set by Vercel)
		const baseUrl =
			env.NEXT_PUBLIC_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

		console.log("🔍 About to create Stripe session with currency:", cart.currency);
		console.log(
			"🔍 Line items currency check:",
			lineItems.map((i) => i.price_data.currency),
		);

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

		console.log("✅ Stripe checkout session created:", session.id);

		// Redirect to Stripe Checkout
		redirect(session.url!);
	} catch (error) {
		console.error("❌ CRITICAL CHECKOUT ERROR:");
		console.error(error);

		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}

		// Log Stripe-specific error details if available
		if (typeof error === "object" && error !== null) {
			console.error("Full error object:", JSON.stringify(error, null, 2));
		}

		throw error;
	}
}

export async function createOrderFromCheckout(sessionId: string) {
	try {
		const stripe = getStripeClient();
		// Retrieve the Stripe session
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			throw new Error("Payment not completed");
		}

		// Get cart items from metadata
		const cartItems = JSON.parse(session.metadata?.cart_items || "[]") as Array<{
			id: string;
			quantity: number;
		}>;

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

		// Create order items
		for (const item of cartItems) {
			const { error: orderItemError } = await supabase.from("order_items").insert({
				order_id: order.id,
				product_id: item.id,
				quantity: item.quantity,
				price_at_time: 0, // TODO: Get actual price from Stripe
			});

			if (orderItemError) {
				throw orderItemError;
			}
		}

		// Clear the cart
		await clearCartAction();

		return order;
	} catch (error) {
		console.error("Error creating order from checkout:", error);
		throw error;
	}
}

// Alias for backward compatibility
export const completeCheckout = createOrderFromCheckout;
