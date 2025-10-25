import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createOrderFromCheckout } from "@/actions/checkout-actions";
import { env } from "@/env.mjs";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { getStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	const body = await req.text();
	const headersList = await headers();
	const sig = headersList.get("stripe-signature")!;

	let event: Stripe.Event;
	const stripe = getStripeClient();
	const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

	if (!endpointSecret) {
		logger.error("Stripe webhook secret is not configured");
		return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
	}

	try {
		event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
	} catch (err) {
		logger.error("Webhook signature verification failed", err);
		return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;

				// Create order from successful checkout
				const order = await createOrderFromCheckout(session.id);

				// Send order confirmation email
				try {
					const stripe = getStripeClient();
					const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
						expand: ["line_items"],
					});

					const items =
						sessionWithLineItems.line_items?.data.map((item) => ({
							productId:
								typeof item.price?.product === "string"
									? item.price.product
									: item.price?.product?.id || "unknown",
							quantity: item.quantity || 1,
							priceAtTime: item.price?.unit_amount || 0,
						})) || [];

					await sendOrderConfirmationEmail({
						orderId: order.id,
						customerEmail:
							session.customer_details?.email || session.customer_email || "customer@example.com",
						totalAmount: session.amount_total || 0,
						currency: (session.currency || "usd").toUpperCase(),
						items,
					});

					logger.info("Order created and confirmation email sent", {
						orderId: order.id,
						sessionId: session.id,
					});
				} catch (emailError) {
					// Don't fail the webhook if email sending fails
					logger.error("Failed to send order confirmation email", emailError, {
						orderId: order.id,
						sessionId: session.id,
					});
				}
				break;
			}

			case "payment_intent.succeeded": {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;

				// Update order status if needed
				const supabase = await createClient();
				const { data: order } = await supabase
					.from("orders")
					.select("*")
					.eq("stripe_payment_intent_id", paymentIntent.id)
					.single();

				if (order && order.status === "pending") {
					await supabase.from("orders").update({ status: "processing" }).eq("id", order.id);

					logger.info("Order status updated to processing", {
						orderId: order.id,
						paymentIntentId: paymentIntent.id,
					});
				}
				break;
			}

			case "payment_intent.payment_failed": {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;

				// Update order status to cancelled
				const supabase = await createClient();
				const { data: order } = await supabase
					.from("orders")
					.select("*")
					.eq("stripe_payment_intent_id", paymentIntent.id)
					.single();

				if (order) {
					await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);

					logger.error("Payment failed for order", {
						orderId: order.id,
						paymentIntentId: paymentIntent.id,
						failureReason: paymentIntent.last_payment_error?.message,
					});
				}
				break;
			}

			// Note: Product and price sync removed - products are fetched directly from Stripe
			// No need to cache in database since Stripe is the source of truth

			case "product.created":
			case "product.updated":
			case "product.deleted":
			case "price.created":
			case "price.updated":
			case "price.deleted":
				// Products and prices are fetched directly from Stripe API
				// No database caching needed
				logger.info("Product/Price event received", { eventType: event.type });
				break;

			case "customer.subscription.created":
			case "customer.subscription.updated":
			case "customer.subscription.deleted": {
				// Handle subscription events if needed in future
				logger.info("Subscription event received", { eventType: event.type });
				break;
			}

			default:
				logger.debug("Unhandled webhook event type", { eventType: event.type });
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		logger.error("Error processing webhook", error);
		return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
	}
}

// Disable body parsing for webhooks
export const config = {
	api: {
		bodyParser: false,
	},
};
