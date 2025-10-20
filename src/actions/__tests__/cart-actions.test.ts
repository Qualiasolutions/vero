import { describe, it, expect, beforeEach, vi } from "vitest";
import {
	getCartAction,
	addToCartAction,
	updateCartItemAction,
	removeFromCartAction,
	clearCartAction,
	getCartItemCount,
} from "../cart-actions";
import type { Cart } from "commerce-kit";

// Mock cart cookies
vi.mock("@/lib/cart-cookies", () => ({
	getCartId: vi.fn(),
	setCartId: vi.fn(),
	clearCartId: vi.fn(),
}));

// Mock commerce kit
vi.mock("@/lib/commerce", () => ({
	commerce: {
		cart: {
			get: vi.fn(),
			add: vi.fn(),
			update: vi.fn(),
			remove: vi.fn(),
			clear: vi.fn(),
		},
	},
}));

describe("Cart Actions", () => {
	const mockCart: Cart = {
		id: "cart_123",
		items: [
			{
				id: "item_1",
				productId: "prod_1",
				variantId: "var_1",
				quantity: 2,
				price: 10000, // AED 100.00 in fils
				product: {
					id: "prod_1",
					name: "Test Product",
					slug: "test-product",
					price: 10000,
					images: [],
					metadata: {},
				},
			},
		],
		totalAmount: 20000,
		metadata: {},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getCartAction", () => {
		it("should return null if no cart ID exists", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			(getCartId as any).mockResolvedValue(null);

			const result = await getCartAction();

			expect(result).toBeNull();
		});

		it("should fetch and return cart with structuredClone", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.get as any).mockResolvedValue(mockCart);

			const result = await getCartAction();

			expect(result).toEqual(mockCart);
			expect(commerce.cart.get).toHaveBeenCalledWith({ cartId: "cart_123" });
		});

		it("should handle errors gracefully", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.get as any).mockRejectedValue(new Error("Cart not found"));

			const result = await getCartAction();

			expect(result).toBeNull();
		});
	});

	describe("addToCartAction", () => {
		it("should create new cart when no cart ID exists", async () => {
			const { getCartId, setCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue(null);
			(commerce.cart.add as any).mockResolvedValue(mockCart);

			const result = await addToCartAction("var_1", 1);

			expect(result).toEqual(mockCart);
			expect(setCartId).toHaveBeenCalledWith("cart_123");
			expect(commerce.cart.add).toHaveBeenCalledWith({
				cartId: undefined,
				variantId: "var_1",
				quantity: 1,
			});
		});

		it("should add item to existing cart", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.add as any).mockResolvedValue(mockCart);

			const result = await addToCartAction("var_2", 3);

			expect(result).toEqual(mockCart);
			expect(commerce.cart.add).toHaveBeenCalledWith({
				cartId: "cart_123",
				variantId: "var_2",
				quantity: 3,
			});
		});

		it("should throw error on failure", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.add as any).mockRejectedValue(new Error("Add failed"));

			await expect(addToCartAction("var_1", 1)).rejects.toThrow("Add failed");
		});
	});

	describe("updateCartItemAction", () => {
		it("should return null if no cart ID exists", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			(getCartId as any).mockResolvedValue(null);

			const result = await updateCartItemAction("var_1", 5);

			expect(result).toBeNull();
		});

		it("should update cart item quantity", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.update as any).mockResolvedValue(mockCart);

			const result = await updateCartItemAction("var_1", 5);

			expect(result).toEqual(mockCart);
			expect(commerce.cart.update).toHaveBeenCalledWith({
				cartId: "cart_123",
				variantId: "var_1",
				quantity: 5,
			});
		});
	});

	describe("removeFromCartAction", () => {
		it("should return null if no cart ID exists", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			(getCartId as any).mockResolvedValue(null);

			const result = await removeFromCartAction("var_1");

			expect(result).toBeNull();
		});

		it("should remove item from cart", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.remove as any).mockResolvedValue({ ...mockCart, items: [] });

			const result = await removeFromCartAction("var_1");

			expect(commerce.cart.remove).toHaveBeenCalledWith({
				cartId: "cart_123",
				variantId: "var_1",
			});
		});
	});

	describe("clearCartAction", () => {
		it("should do nothing if no cart ID exists", async () => {
			const { getCartId, clearCartId } = await import("@/lib/cart-cookies");
			(getCartId as any).mockResolvedValue(null);

			await clearCartAction();

			expect(clearCartId).not.toHaveBeenCalled();
		});

		it("should clear cart and remove cart ID", async () => {
			const { getCartId, clearCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.clear as any).mockResolvedValue(undefined);

			await clearCartAction();

			expect(commerce.cart.clear).toHaveBeenCalledWith({ cartId: "cart_123" });
			expect(clearCartId).toHaveBeenCalled();
		});
	});

	describe("getCartItemCount", () => {
		it("should return 0 for empty cart", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			(getCartId as any).mockResolvedValue(null);

			const count = await getCartItemCount();

			expect(count).toBe(0);
		});

		it("should calculate total item count", async () => {
			const { getCartId } = await import("@/lib/cart-cookies");
			const { commerce } = await import("@/lib/commerce");

			const multiItemCart = {
				...mockCart,
				items: [
					{ ...mockCart.items[0], quantity: 2 },
					{ ...mockCart.items[0], id: "item_2", quantity: 3 },
				],
			};

			(getCartId as any).mockResolvedValue("cart_123");
			(commerce.cart.get as any).mockResolvedValue(multiItemCart);

			const count = await getCartItemCount();

			expect(count).toBe(5); // 2 + 3
		});
	});
});
