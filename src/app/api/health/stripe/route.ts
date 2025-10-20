import { NextResponse } from "next/server";
import { validateStripeConfig } from "@/lib/stripe-health";

/**
 * Stripe Health Check Endpoint
 * GET /api/health/stripe
 *
 * Returns Stripe configuration status
 * Useful for debugging and monitoring
 */
export async function GET() {
	try {
		const health = await validateStripeConfig();

		if (!health.isValid) {
			return NextResponse.json(
				{
					status: "error",
					message: health.error,
					details: health.details,
				},
				{ status: 503 }, // Service Unavailable
			);
		}

		return NextResponse.json({
			status: "ok",
			message: "Stripe is configured correctly",
			details: health.details,
		});
	} catch (error) {
		return NextResponse.json(
			{
				status: "error",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
