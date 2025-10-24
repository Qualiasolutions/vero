import { beforeEach, describe, expect, it, vi } from "vitest";
import { addToCartAction, clearCartAction, getCartAction } from "@/actions/cart-actions";
import { createCheckoutSession } from "@/actions/checkout-actions";

// Mock dependencies
vi.mock("@/lib/cart-cookies", () => ({
	getCartId: vi.fn(),
	setCartId: vi.fn(),
	clearCartId: vi.fn(),
}));

vi.mock("@/lib/commerce", () => ({
	commerce: {
		cart: {
			get: vi.fn(),
			add: vi.fn(),
			clear: vi.fn(),
		},
	},
}));

vi.mock("stripe", () => ({
	default: vi.fn(() => ({
		checkout: {
			sessions: {
				create: vi.fn(),
				retrieve: vi.fn(),
			},
		},
	})),
}));

vi.mock("@/lib/supabase", () => ({
	supabase: {
		from: vi.fn(() => ({
			insert: vi.fn(() => ({
				select: vi.fn(() => ({
					single: vi.fn(),
				})),
			})),
		})),
	},
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn((url: string) => {
		throw new Error(`REDIRECT:${url}`);
	}),
}));

describe("Checkout Flow Integration Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Complete Purchase Flow", () => {
		it("should handle full checkout process: add to cart → checkout → clear cart", async () => {
			const { getCartId, setCartId, clearCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			const mockCart = {
				id: "cart_123",
				items: [
					{
						id: "item_1",
						productId: "prod_ferrari",
						variantId: "var_ferrari",
						quantity: 1,
						price: 39900,
						product: {
							id: "prod_ferrari",
							name: "Ferrari F40 Model",
							slug: "ferrari-f40",
							price: 39900,
							images: ["https://example.com/ferrari.jpg"],
							metadata: {},
						},
					},
				],
				totalAmount: 39900,
				metadata: {},
			};

			// Step 1: Add item to cart
			getCartIdMock.mockResolvedValue(null);
			commerceMock.cart.add.mockResolvedValue(mockCart);

			const cart = await addToCartAction("var_ferrari", 1);
			expect(cart).toEqual(mockCart);
			expect(setCartId).toHaveBeenCalledWith("cart_123");

			// Step 2: Get cart for checkout
			getCartIdMock.mockResolvedValue("cart_123");
			commerceMock.cart.get.mockResolvedValue(mockCart);

			const checkoutCart = await getCartAction();
			expect(checkoutCart).toEqual(mockCart);
			expect(checkoutCart?.items.length).toBe(1);

			// Step 3: Clear cart after successful checkout
			await clearCartAction();
			expect(clearCartId).toHaveBeenCalled();
		});

		it("should handle multiple items in checkout", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			const multiItemCart = {
				id: "cart_456",
				items: [
					{
						id: "item_1",
						productId: "prod_1",
						variantId: "var_1",
						quantity: 2,
						price: 39900,
						product: {
							id: "prod_1",
							name: "Product 1",
							slug: "product-1",
							price: 39900,
							images: [],
							metadata: {},
						},
					},
					{
						id: "item_2",
						productId: "prod_2",
						variantId: "var_2",
						quantity: 1,
						price: 59900,
						product: {
							id: "prod_2",
							name: "Product 2",
							slug: "product-2",
							price: 59900,
							images: [],
							metadata: {},
						},
					},
				],
				totalAmount: 139700, // (399 * 2) + 599
				metadata: {},
			};

			getCartIdMock.mockResolvedValue("cart_456");
			commerceMock.cart.get.mockResolvedValue(multiItemCart);

			const cart = await getCartAction();

			expect(cart?.items.length).toBe(2);
			expect(cart?.totalAmount).toBe(139700);
		});

		it("should prevent checkout with empty cart", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const getCartIdMock = vi.mocked(getCartId);

			getCartIdMock.mockResolvedValue(null);

			await expect(async () => {
				await createCheckoutSession();
			}).rejects.toThrow("REDIRECT:/cart");
		});
	});

	describe("Cart State Management", () => {
		it("should maintain cart state across page refreshes", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			const persistentCart = {
				id: "cart_persistent",
				items: [
					{
						id: "item_1",
						productId: "prod_1",
						variantId: "var_1",
						quantity: 1,
						price: 10000,
						product: {
							id: "prod_1",
							name: "Persistent Product",
							slug: "persistent",
							price: 10000,
							images: [],
							metadata: {},
						},
					},
				],
				totalAmount: 10000,
				metadata: {},
			};

			getCartIdMock.mockResolvedValue("cart_persistent");
			commerceMock.cart.get.mockResolvedValue(persistentCart);

			// Simulate multiple page loads
			const cart1 = await getCartAction();
			const cart2 = await getCartAction();
			const cart3 = await getCartAction();

			expect(cart1).toEqual(persistentCart);
			expect(cart2).toEqual(persistentCart);
			expect(cart3).toEqual(persistentCart);
			expect(commerce.cart.get).toHaveBeenCalledTimes(3);
		});
	});

	describe("Error Handling in Checkout Flow", () => {
		it("should handle cart retrieval errors gracefully", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			getCartIdMock.mockResolvedValue("cart_error");
			commerceMock.cart.get.mockRejectedValue(new Error("Network error"));

			const cart = await getCartAction();

			expect(cart).toBeNull();
		});

		it("should rollback on add to cart failure", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			getCartIdMock.mockResolvedValue("cart_123");
			commerceMock.cart.add.mockRejectedValue(new Error("Add failed"));

			await expect(addToCartAction("var_invalid", 1)).rejects.toThrow("Add failed");
		});
	});

	describe("Price Calculations", () => {
		it("should correctly calculate cart total for multiple quantities", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");
			const getCartIdMock = vi.mocked(getCartId);
			const commerceMock = vi.mocked(commerce, true);

			const cart = {
				id: "cart_calc",
				items: [
					{
						id: "item_1",
						productId: "prod_1",
						variantId: "var_1",
						quantity: 3,
						price: 10000,
						product: {
							id: "prod_1",
							name: "Product",
							slug: "product",
							price: 10000,
							images: [],
							metadata: {},
						},
					},
				],
				totalAmount: 30000, // 3 * 100.00 AED
				metadata: {},
			};

			getCartIdMock.mockResolvedValue("cart_calc");
			commerceMock.cart.get.mockResolvedValue(cart);

			const result = await getCartAction();

			expect(result?.totalAmount).toBe(30000);
			expect(result?.items[0].quantity).toBe(3);
		});
	});
});
