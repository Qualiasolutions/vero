import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

export const CART_COOKIE = "yns_cart_id";

export async function getCartId(): Promise<string | null> {
	try {
		const cookiesValue = await cookies();
		const cartId = cookiesValue.get(CART_COOKIE)?.value;
		return cartId || null;
	} catch (error) {
		logger.error("Failed to get cart ID from cookies", { error });
		return null;
	}
}

export async function setCartId(cartId: string): Promise<void> {
	try {
		(await cookies()).set(CART_COOKIE, cartId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});
	} catch (error) {
		logger.error("Failed to set cart ID cookie", { error, cartId });
	}
}

export async function clearCartId(): Promise<void> {
	try {
		(await cookies()).set(CART_COOKIE, "", {
			maxAge: 0,
		});
	} catch (error) {
		logger.error("Failed to clear cart ID cookie", { error });
	}
}
