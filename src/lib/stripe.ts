import Stripe from "stripe";
import { env } from "@/env.mjs";
import { logger } from "@/lib/logger";

declare global {
	// eslint-disable-next-line no-var
	var __stripeClient: Stripe | undefined;
}

const globalStripe = globalThis as typeof globalThis & { __stripeClient?: Stripe };

const createStripeClient = (): Stripe => {
	const secretKey = env.STRIPE_SECRET_KEY;

	if (!secretKey) {
		// Provide more detailed error information
		const isDevelopment = process.env.NODE_ENV === "development";
		const isProduction = process.env.NODE_ENV === "production";

		logger.error("Stripe configuration error", null, {
			isDevelopment,
			isProduction,
			hasSecretKey: !!secretKey,
			nodeEnv: process.env.NODE_ENV,
		});

		throw new Error(
			`Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your environment. ` +
				`Current environment: ${process.env.NODE_ENV || "unknown"}`,
		);
	}

	// Log successful configuration (only in development)
	if (process.env.NODE_ENV === "development") {
		logger.debug("Stripe client initialized successfully");
	}

	return new Stripe(secretKey, {
		apiVersion: "2025-08-27.basil",
	});
};

/**
 * Lazily instantiated singleton Stripe client.
 * Cached on the global object to avoid re-instantiation during hot reloads.
 */
export const getStripeClient = (): Stripe => {
	if (!globalStripe.__stripeClient) {
		globalStripe.__stripeClient = createStripeClient();
	}

	return globalStripe.__stripeClient;
};

export type StripeClient = ReturnType<typeof getStripeClient>;
