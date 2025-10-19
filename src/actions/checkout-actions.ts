"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { auth } from "@/lib/auth-new";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

const SITE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function createCheckoutSession() {
	try {
		const user = await auth();
		const cartId = await getCurrentCartId();

		if (!cartId) {
			throw new Error("No cart found");
		}

		// Get cart with items
		const cart = await prisma.cart.findUnique({
			where: { id: cartId },
			include: { items: true },
		});

		if (!cart || cart.items.length === 0) {
			throw new Error("Cart is empty");
		}

		// Prepare line items for Stripe
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = await Promise.all(
			cart.items.map(async (item: any) => {
				// Get price from Stripe to ensure it's valid
				const price = await stripe.prices.retrieve(item.variantId);

				return {
					price: price.id,
					quantity: item.quantity,
				};
			}),
		);

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${SITE_URL}/cart`,
			customer_email: user?.email,
			metadata: {
				cartId: cart.id,
				userId: user?.id || "guest",
			},
			shipping_address_collection: {
				allowed_countries: ["US", "CA", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH"],
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 999, // €9.99
							currency: process.env.STRIPE_CURRENCY || "eur",
						},
						display_name: "Standard Shipping",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 5,
							},
							maximum: {
								unit: "business_day",
								value: 10,
							},
						},
					},
				},
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 1999, // €19.99
							currency: process.env.STRIPE_CURRENCY || "eur",
						},
						display_name: "Express Shipping",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 2,
							},
							maximum: {
								unit: "business_day",
								value: 5,
							},
						},
					},
				},
			],
		});

		if (!session.url) {
			throw new Error("Failed to create checkout session");
		}

		// Redirect to Stripe checkout
		redirect(session.url);
	} catch (error) {
		console.error("Checkout error:", error);
		throw new Error("Failed to create checkout session");
	}
}

// Helper to get current cart ID
async function getCurrentCartId(): Promise<string | null> {
	const user = await auth();

	if (user) {
		const cart = await prisma.cart.findUnique({
			where: { userId: user.id },
		});
		return cart?.id || null;
	}

	// For guest users, get from cookie
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("yns_cart_id")?.value;

	if (sessionId) {
		const cart = await prisma.cart.findUnique({
			where: { sessionId },
		});
		return cart?.id || null;
	}

	return null;
}

// Get checkout session status
export async function getCheckoutSession(sessionId: string) {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["payment_intent", "customer"],
		});

		return {
			success: session.payment_status === "paid",
			customerEmail: session.customer_details?.email,
			amount: session.amount_total,
			currency: session.currency,
		};
	} catch (error) {
		console.error("Error retrieving checkout session:", error);
		return null;
	}
}

// Create order from successful checkout
export async function createOrderFromCheckout(sessionId: string) {
	try {
		// Check if order already exists
		const existingOrder = await prisma.order.findUnique({
			where: { stripeSessionId: sessionId },
		});

		if (existingOrder) {
			return existingOrder;
		}

		// Get session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["line_items", "customer"],
		});

		if (session.payment_status !== "paid") {
			throw new Error("Payment not completed");
		}

		// Get cart
		const cartId = session.metadata?.cartId;
		if (!cartId) {
			throw new Error("Cart ID not found in session");
		}

		const cart = await prisma.cart.findUnique({
			where: { id: cartId },
			include: { items: true },
		});

		if (!cart) {
			throw new Error("Cart not found");
		}

		// Create order
		const order = await prisma.order.create({
			data: {
				userId: session.metadata?.userId !== "guest" ? session.metadata?.userId : null,
				email: session.customer_details?.email || "",
				stripeSessionId: sessionId,
				stripePaymentId: session.payment_intent as string,
				total: session.amount_total || 0,
				currency: session.currency || "eur",
				status: "PROCESSING",
				items: cart.items,
				shippingAddress:
					(session as any).shipping_details || (session.customer_details?.address as any) || {},
				billingAddress: (session.customer_details?.address as any) || {},
				metadata: {
					shipping: session.total_details?.amount_shipping || 0,
					customerName: session.customer_details?.name,
				},
			},
		});

		// Clear the cart
		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		// TODO: Send order confirmation email

		return order;
	} catch (error) {
		console.error("Error creating order:", error);
		throw error;
	}
}

// Get user orders
export async function getUserOrders() {
	const user = await auth();
	if (!user) {
		return [];
	}

	const orders = await prisma.order.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: "desc" },
	});

	return orders;
}

// Get order by ID
export async function getOrder(orderId: string) {
	const user = await auth();

	const order = await prisma.order.findUnique({
		where: { id: orderId },
	});

	// Check authorization
	if (!order || (order.userId && order.userId !== user?.id)) {
		return null;
	}

	return order;
}
