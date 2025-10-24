// Commerce SDK configuration - using Stripe provider directly
import { Commerce } from "commerce-kit/stripe";

// Configure Stripe provider for commerce operations
// Only initialize if we're on the server side
const isServer = typeof window === "undefined";

export const commerce = isServer ? new Commerce() : null;

export default commerce;
