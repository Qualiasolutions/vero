"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { getCartAction, clearCartAction } from "./cart-actions-new";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

export async function createCheckoutSession() {
	try {
		const cart = await getCartAction();

		if (!cart || cart.items.length === 0) {
			redirect("/cart");
		}

		// Create Stripe line items from cart
		const lineItems = cart.items.map((item) => ({
			price_data: {
				currency: "eur",
				product_data: {
					name: item.product?.name || "Product",
					images: item.product?.images || [],
				},
				unit_amount: item.price,
			},
			quantity: item.quantity,
		}));

		// Create Stripe Checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
			metadata: {
				cart_items: JSON.stringify(cart.items.map((i) => ({ id: i.productId, quantity: i.quantity }))),
			},
		});

		// Redirect to Stripe Checkout
		redirect(session.url!);
	} catch (error) {
		console.error("Error creating checkout session:", error);
		throw error;
	}
}

export async function createOrderFromCheckout(sessionId: string) {
	try {
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
				total_amount: session.amount_total! / 100, // Convert from cents
				currency: session.currency || "eur",
				status: "pending",
			})
			.select()
			.single();

		if (error || !order) {
			throw new Error("Failed to create order");
		}

		// Create order items
		for (const item of cartItems) {
			await supabase.from("order_items").insert({
				order_id: order.id,
				product_id: item.id,
				quantity: item.quantity,
				price_at_time: 0, // TODO: Get actual price from Stripe
			});
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
