import type Stripe from "stripe";

// Base coming soon product interface
export interface ComingSoonProduct {
	id: string;
	name: string;
	description?: string;
	image?: string;
	brand?: string;
	model?: string;
	scale?: string;
	year?: number;
	material?: string;
	expectedAvailabilityDate?: Date;
	availabilityStatus?: "announced" | "pre-order" | "coming-soon" | "limited";
	preOrderLimit?: number;
	currentPreOrders?: number;
	depositRequired?: boolean;
	depositPercentage?: number;
	preOrderDescription?: string;
	price?: number;
	currency?: string;
	metadata?: Record<string, string>;
}

// Design variation types for ads
export type AdDesignType = "minimalist" | "detailed" | "countdown" | "premium" | "technical" | "announcement";

// Extended product info from Stripe + Supabase
export interface ExtendedComingSoonProduct extends ComingSoonProduct {
	stripeProductId: string;
	supabaseRecord?: {
		id: string;
		isPreorder: boolean;
		expectedAvailabilityDate: string;
		availabilityStatus: string;
		preOrderLimit: number | null;
		currentPreOrders: number;
		depositRequired: boolean;
		depositPercentage: string | null;
		preOrderDescription: string | null;
	};
	stripeProduct?: Stripe.Product;
	stripePrice?: Stripe.Price;
}

// Props for individual ad components
export interface ComingSoonAdProps {
	product: ExtendedComingSoonProduct;
	designType: AdDesignType;
	onPreorderClick?: (productId: string) => void;
}

// Props for ad rotator component
export interface AdRotatorProps {
	products: ExtendedComingSoonProduct[];
	autoRotate?: boolean;
	rotationInterval?: number;
	onAdClick?: (product: ExtendedComingSoonProduct) => void;
}
