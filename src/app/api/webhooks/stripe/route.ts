import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrderFromCheckout } from "@/actions/checkout-actions";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
	const body = await req.text();
	const headersList = await headers();
	const sig = headersList.get("stripe-signature")!;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;

				// Create order from successful checkout
				await createOrderFromCheckout(session.id);

				// TODO: Send order confirmation email
				console.log("Order created for session:", session.id);
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
					await prisma.order.update({
						where: { id: order.id },
						data: {
							status: "CANCELLED",
							metadata: {
								...order.metadata as any,
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
				console.log("Subscription event:", event.type);
				break;
			}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Error processing webhook:", error);
		return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
	}
}

// Disable body parsing for webhooks
export const config = {
	api: {
		bodyParser: false,
	},
};