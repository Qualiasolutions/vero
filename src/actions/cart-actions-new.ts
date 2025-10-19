"use server";

import type { Cart } from "commerce-kit";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth-new";
import { commerce } from "@/lib/commerce";
import { prisma } from "@/lib/prisma";

// Get or create cart for current user/session
async function getOrCreateCart(): Promise<string> {
	const user = await auth();
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("yns_cart_id")?.value || crypto.randomUUID();

	if (user) {
		// Get user cart
		let cart = await prisma.cart.findUnique({
			where: { userId: user.id },
		});

		if (!cart) {
			cart = await prisma.cart.create({
				data: { userId: user.id },
			});
		}

		return cart.id;
	} else {
		// Get or create guest cart
		let cart = await prisma.cart.findUnique({
			where: { sessionId },
		});

		if (!cart) {
			cart = await prisma.cart.create({
				data: {
					sessionId,
					expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
				},
			});

			// Set cookie for guest cart
			cookieStore.set("yns_cart_id", sessionId, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30, // 30 days
			});
		}

		return cart.id;
	}
}

// Convert database cart to Commerce Kit format
async function formatCart(cartId: string): Promise<Cart | null> {
	const cart = await prisma.cart.findUnique({
		where: { id: cartId },
		include: { items: true },
	});

	if (!cart) return null;

	// Fetch product details from Stripe for each item
	const items = await Promise.all(
		cart.items.map(async (item: any) => {
			try {
				const product = await commerce.product.get({ id: item.productId });

				// Get price from product (already in cents)
				let priceAmount = 0;
				if (product?.price) {
					priceAmount = product.price * 100; // Convert to cents
				}

				return {
					id: item.id,
					productId: item.productId,
					variantId: item.variantId,
					quantity: item.quantity,
					price: priceAmount,
					product: product
						? {
								id: product.id,
								name: product.name,
								images: product.images || [],
								metadata: {},
							}
						: undefined,
				};
			} catch (error) {
				console.error(`Error fetching product ${item.productId}:`, error);
				// Return item with cached metadata if Stripe fetch fails
				return {
					id: item.id,
					productId: item.productId,
					variantId: item.variantId,
					quantity: item.quantity,
					price: 0,
					product: item.metadata as any,
				};
			}
		}),
	);

	// Calculate total
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return {
		id: cart.id,
		items,
		total: total / 100, // Convert from cents
		currency: process.env.STRIPE_CURRENCY || "eur",
	};
}

// Get cart action
export async function getCartAction(): Promise<Cart | null> {
	try {
		const cartId = await getOrCreateCart();
		return await formatCart(cartId);
	} catch (error) {
		console.error("Error fetching cart:", error);
		return null;
	}
}

// Add to cart action
export async function addToCartAction(variantId: string, quantity = 1): Promise<Cart | null> {
	try {
		const cartId = await getOrCreateCart();

		// For now, we'll use the variantId as the product ID
		// In a full implementation, you'd need to map price IDs to product IDs
		const product = await commerce.product.get({ id: variantId }).catch(() => null);

		// Check if item already exists in cart
		const existingItem = await prisma.cartItem.findUnique({
			where: {
				cartId_variantId: {
					cartId,
					variantId,
				},
			},
		});

		if (existingItem) {
			// Update quantity
			await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: {
					quantity: existingItem.quantity + quantity,
				},
			});
		} else {
			// Add new item
			await prisma.cartItem.create({
				data: {
					cartId,
					productId: product?.id || variantId, // Use product ID if available, otherwise variantId
					variantId,
					quantity,
					metadata: product
						? {
								name: product.name,
								images: product.images,
							}
						: undefined,
				},
			});
		}

		// Update cart timestamp
		await prisma.cart.update({
			where: { id: cartId },
			data: { updatedAt: new Date() },
		});

		return await formatCart(cartId);
	} catch (error) {
		console.error("Error adding to cart:", error);
		throw error;
	}
}

// Update cart item action
export async function updateCartItemAction(variantId: string, quantity: number): Promise<Cart | null> {
	try {
		const cartId = await getOrCreateCart();

		if (quantity <= 0) {
			// Remove item if quantity is 0
			await prisma.cartItem.deleteMany({
				where: {
					cartId,
					variantId,
				},
			});
		} else {
			// Update quantity
			await prisma.cartItem.updateMany({
				where: {
					cartId,
					variantId,
				},
				data: { quantity },
			});
		}

		// Update cart timestamp
		await prisma.cart.update({
			where: { id: cartId },
			data: { updatedAt: new Date() },
		});

		return await formatCart(cartId);
	} catch (error) {
		console.error("Error updating cart item:", error);
		throw error;
	}
}

// Remove from cart action
export async function removeFromCartAction(variantId: string): Promise<Cart | null> {
	try {
		const cartId = await getOrCreateCart();

		await prisma.cartItem.deleteMany({
			where: {
				cartId,
				variantId,
			},
		});

		// Update cart timestamp
		await prisma.cart.update({
			where: { id: cartId },
			data: { updatedAt: new Date() },
		});

		return await formatCart(cartId);
	} catch (error) {
		console.error("Error removing from cart:", error);
		throw error;
	}
}

// Clear cart action
export async function clearCartAction(): Promise<void> {
	try {
		const cartId = await getOrCreateCart();

		await prisma.cartItem.deleteMany({
			where: { cartId },
		});

		// Update cart timestamp
		await prisma.cart.update({
			where: { id: cartId },
			data: { updatedAt: new Date() },
		});
	} catch (error) {
		console.error("Error clearing cart:", error);
		throw error;
	}
}

// Get cart item count
export async function getCartItemCount(): Promise<number> {
	try {
		const cartId = await getOrCreateCart();

		const result = await prisma.cartItem.aggregate({
			where: { cartId },
			_sum: { quantity: true },
		});

		return result._sum.quantity || 0;
	} catch (error) {
		console.error("Error getting cart item count:", error);
		return 0;
	}
}

// Clean up expired guest carts (run periodically)
export async function cleanupExpiredCarts() {
	try {
		const deleted = await prisma.cart.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});

		console.log(`Cleaned up ${deleted.count} expired carts`);
	} catch (error) {
		console.error("Error cleaning up carts:", error);
	}
}
