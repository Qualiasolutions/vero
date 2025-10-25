import { NextResponse } from "next/server";
import { getCartAction } from "@/actions/cart-actions";
import { env } from "@/env.mjs";
import { logger } from "@/lib/logger";
import { getStripeClient } from "@/lib/stripe";

export async function GET() {
	try {
		const stripe = getStripeClient();
		const cart = await getCartAction();

		if (!cart || cart.items.length === 0) {
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		// Create line items
		const lineItems = cart.items.map((item) => ({
			price_data: {
				currency: cart.currency,
				product_data: {
					name: item.product?.name || "Product",
					images: item.product?.images || [],
				},
				unit_amount: item.price,
			},
			quantity: item.quantity,
		}));

		const baseUrl =
			env.NEXT_PUBLIC_URL ||
			(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

		// Debug environment
		logger.info("Stripe checkout environment", {
			nextPublicUrl: env.NEXT_PUBLIC_URL,
			vercelUrl: process.env.VERCEL_URL,
			baseUrl,
			successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		});

		// Try to create Stripe session
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

		return NextResponse.json({
			success: true,
			sessionId: session.id,
			cart: {
				currency: cart.currency,
				total: cart.total,
				itemCount: cart.items.length,
				items: cart.items.map((i) => ({
					name: i.product?.name,
					price: i.price,
					quantity: i.quantity,
				})),
			},
			lineItems: lineItems.map((li) => ({
				currency: li.price_data.currency,
				unit_amount: li.price_data.unit_amount,
				quantity: li.quantity,
			})),
		});
	} catch (error) {
		const errorObject =
			typeof error === "object" && error !== null ? (error as Record<string, unknown>) : undefined;

		// Return error details as JSON so we can see them
		const errorDetails = {
			message: error instanceof Error ? error.message : "Unknown error",
			type: error instanceof Error ? error.constructor.name : undefined,
			code: typeof errorObject?.code === "string" ? errorObject.code : undefined,
			statusCode: typeof errorObject?.statusCode === "number" ? errorObject.statusCode : undefined,
			raw: errorObject && "raw" in errorObject ? errorObject.raw : undefined,
			requestId: typeof errorObject?.requestId === "string" ? errorObject.requestId : undefined,
			// Full error object
			full: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
		};

		return NextResponse.json(
			{
				error: "Checkout session creation failed",
				details: errorDetails,
			},
			{ status: 500 },
		);
	}
}
