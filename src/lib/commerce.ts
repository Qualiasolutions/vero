// Commerce SDK configuration - using Stripe provider directly
import { Commerce } from "commerce-kit/stripe";

// Configure Stripe provider for commerce operations
// Zero-config: reads STRIPE_SECRET_KEY and STRIPE_CURRENCY from environment
export const commerce = new Commerce();

export default commerce;
