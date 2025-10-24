import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createOrderFromCheckout } from "@/actions/checkout-actions";
import { env } from "@/env.mjs";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

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
				const order = await prisma.order.findUnique({
					where: { stripePaymentId: paymentIntent.id },
				});

				if (order && order.status === "PENDING") {
					await prisma.order.update({
						where: { id: order.id },
						data: { status: "PROCESSING" },
					});
				}
				break;
			}

			case "payment_intent.payment_failed": {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;

				// Update order status to cancelled
				const order = await prisma.order.findUnique({
					where: { stripePaymentId: paymentIntent.id },
				});

				if (order) {
					const existingMetadata =
						typeof order.metadata === "object" && order.metadata !== null && !Array.isArray(order.metadata)
							? (order.metadata as Record<string, unknown>)
							: {};

					await prisma.order.update({
						where: { id: order.id },
						data: {
							status: "CANCELLED",
							metadata: {
								...existingMetadata,
								failureReason: paymentIntent.last_payment_error?.message,
							},
						},
					});
				}
				break;
			}

			case "product.created":
			case "product.updated": {
				const product = event.data.object as Stripe.Product;

				// Sync product to database cache
				await prisma.product.upsert({
					where: { id: product.id },
					create: {
						id: product.id,
						name: product.name,
						slug: product.metadata.slug || product.id,
						description: product.description,
						images: product.images || [],
						metadata: product.metadata || {},
						active: product.active,
					},
					update: {
						name: product.name,
						slug: product.metadata.slug || product.id,
						description: product.description,
						images: product.images || [],
						metadata: product.metadata || {},
						active: product.active,
					},
				});
				break;
			}

			case "product.deleted": {
				const product = event.data.object as Stripe.Product;

				// Mark product as inactive
				await prisma.product.update({
					where: { id: product.id },
					data: { active: false },
				});
				break;
			}

			case "price.created":
			case "price.updated": {
				const price = event.data.object as Stripe.Price;

				// Sync price to database cache
				await prisma.price.upsert({
					where: { id: price.id },
					create: {
						id: price.id,
						productId: price.product as string,
						amount: price.unit_amount || 0,
						currency: price.currency,
						active: price.active,
						metadata: price.metadata || {},
					},
					update: {
						amount: price.unit_amount || 0,
						currency: price.currency,
						active: price.active,
						metadata: price.metadata || {},
					},
				});
				break;
			}

			case "price.deleted": {
				const price = event.data.object as Stripe.Price;

				// Mark price as inactive
				await prisma.price.update({
					where: { id: price.id },
					data: { active: false },
				});
				break;
			}

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
