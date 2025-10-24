import Stripe from "stripe";
import { env } from "@/env.mjs";

declare global {
	// eslint-disable-next-line no-var
	var __stripeClient: Stripe | undefined;
}

const globalStripe = globalThis as typeof globalThis & { __stripeClient?: Stripe };

const createStripeClient = (): Stripe => {
	if (!env.STRIPE_SECRET_KEY) {
		throw new Error("Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your environment.");
	}

	return new Stripe(env.STRIPE_SECRET_KEY);
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
