/**
 * Stripe Health Check Utility
 * Validates Stripe configuration and provides helpful error messages
 */

import { env } from "@/env.mjs";
import { getStripeClient } from "@/lib/stripe";

export interface StripeHealthCheck {
	isValid: boolean;
	error?: string;
	details?: {
		hasSecretKey: boolean;
		hasPublishableKey: boolean;
		apiConnectivity?: boolean;
		accountId?: string;
	};
}

/**
 * Validates Stripe configuration
 * This should be called on app startup or when cart/checkout operations fail
 */
export async function validateStripeConfig(): Promise<StripeHealthCheck> {
	const hasSecretKey = !!env.STRIPE_SECRET_KEY;
	const hasPublishableKey = !!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

	// Check if keys exist
	if (!hasSecretKey) {
		return {
			isValid: false,
			error: "Missing STRIPE_SECRET_KEY environment variable",
			details: { hasSecretKey, hasPublishableKey },
		};
	}

	if (!hasPublishableKey) {
		return {
			isValid: false,
			error: "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable",
			details: { hasSecretKey, hasPublishableKey },
		};
	}

	// Check if secret key looks valid (starts with sk_test_ or sk_live_)
	const secretKey = env.STRIPE_SECRET_KEY!; // We already checked existence above
	if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
		return {
			isValid: false,
			error: "STRIPE_SECRET_KEY appears to be invalid (should start with sk_test_ or sk_live_)",
			details: { hasSecretKey, hasPublishableKey },
		};
	}

	// Try to make a simple API call to verify connectivity
	try {
		const stripe = getStripeClient();
		const account = await stripe.accounts.retrieve();

		return {
			isValid: true,
			details: {
				hasSecretKey,
				hasPublishableKey,
				apiConnectivity: true,
				accountId: account.id,
			},
		};
	} catch (error) {
		return {
			isValid: false,
			error: `Stripe API connectivity test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			details: {
				hasSecretKey,
				hasPublishableKey,
				apiConnectivity: false,
			},
		};
	}
}

/**
 * Logs Stripe configuration status
 * Useful for debugging in development/production
 */
export async function logStripeHealth(): Promise<void> {
	console.log("🔍 Checking Stripe configuration...");

	const health = await validateStripeConfig();

	if (health.isValid) {
		console.log("✅ Stripe configuration is valid");
		console.log("   Account ID:", health.details?.accountId);
	} else {
		console.error("❌ Stripe configuration error:", health.error);
		console.error("   Details:", health.details);
	}
}
