import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

interface CartRow {
	id: string;
	session_id: string;
	product_id: string;
	quantity: number;
	created_at: string;
	updated_at: string;
	user_id: string | null;
}

type SupabaseRow = Record<string, unknown>;
type SupabaseSelectResult = { data: SupabaseRow[]; error: null };
type SupabaseResponse<T> = Promise<{ data: T; error: null }>;
type Filter = (row: CartRow) => boolean;

interface CartQueryBuilder extends PromiseLike<SupabaseSelectResult> {
	select(columns: string): CartQueryBuilder;
	eq(column: string, value: unknown): CartQueryBuilder;
	match(criteria: Record<string, unknown>): CartQueryBuilder;
	order(column: string, options?: { ascending?: boolean }): SupabaseResponse<SupabaseRow[]>;
	maybeSingle(): SupabaseResponse<SupabaseRow | null>;
	update(values: Partial<CartRow>): {
		eq(column: string, value: unknown): SupabaseResponse<SupabaseRow[] | null>;
		match(criteria: Record<string, unknown>): SupabaseResponse<SupabaseRow[] | null>;
	};
	insert(values: Partial<CartRow> | Array<Partial<CartRow>>): SupabaseResponse<null>;
	delete(): {
		match(criteria: Record<string, unknown>): SupabaseResponse<null>;
		eq(column: string, value: unknown): SupabaseResponse<null>;
	};
}

type BuilderMethods = Omit<CartQueryBuilder, keyof PromiseLike<SupabaseSelectResult>>;

const SESSION_ID = "session_test";
const cartItemsStore: CartRow[] = [];
const cookieData = new Map<string, string>();

const mockStripe = {
	products: {
		retrieve: vi.fn(),
	},
	prices: {
		retrieve: vi.fn(),
		list: vi.fn(),
	},
};

const createCartItemsBuilder = (): CartQueryBuilder => {
	let filters: Filter[] = [];
	let selectedColumns: string | null = null;

	const applyFilters = () => cartItemsStore.filter((row) => filters.every((predicate) => predicate(row)));

	const mapRows = (rows: CartRow[]): SupabaseRow[] => {
		if (!selectedColumns || selectedColumns === "*") {
			return rows.map((row) => ({ ...row }) as SupabaseRow);
		}

		if (selectedColumns === "quantity") {
			return rows.map((row) => ({ quantity: row.quantity }));
		}

		const columns = selectedColumns.split(",").map((column) => column.trim());
		return rows.map((row) => {
			const mapped: SupabaseRow = {};
			const rowRecord = row as unknown as SupabaseRow;
			for (const column of columns) {
				mapped[column] = rowRecord[column];
			}
			return mapped;
		});
	};

	const buildResult = (): SupabaseSelectResult => ({
		data: mapRows(applyFilters()),
		error: null,
	});

	let proxyBuilder: CartQueryBuilder;

	const baseBuilder: BuilderMethods = {
		select(columns: string) {
			selectedColumns = columns === "*" ? null : columns;
			return proxyBuilder;
		},
		eq(column: string, value: unknown) {
			filters.push((row) => {
				const rowRecord = row as unknown as SupabaseRow;
				return rowRecord[column] === value;
			});
			return proxyBuilder;
		},
		match(criteria: Record<string, unknown>) {
			filters.push((row) => {
				const rowRecord = row as unknown as SupabaseRow;
				return Object.entries(criteria).every(([key, value]) => rowRecord[key] === value);
			});
			return proxyBuilder;
		},
		order(column: string, options?: { ascending?: boolean }) {
			const rows = applyFilters()
				.slice()
				.sort((a, b) => {
					const aRecord = a as unknown as SupabaseRow;
					const bRecord = b as unknown as SupabaseRow;
					const aValue = aRecord[column];
					const bValue = bRecord[column];

					if (aValue === bValue) return 0;
					const ascending = options?.ascending !== false;

					if (typeof aValue === "number" && typeof bValue === "number") {
						return ascending ? aValue - bValue : bValue - aValue;
					}

					const aString = String(aValue ?? "");
					const bString = String(bValue ?? "");
					return ascending ? aString.localeCompare(bString) : bString.localeCompare(aString);
				});

			return Promise.resolve({ data: mapRows(rows), error: null });
		},
		maybeSingle() {
			const [first] = mapRows(applyFilters());
			return Promise.resolve({ data: first ?? null, error: null });
		},
		update(values: Partial<CartRow>) {
			return {
				eq(column: string, value: unknown) {
					let updates = 0;
					for (const row of cartItemsStore) {
						const rowRecord = row as unknown as SupabaseRow;
						if (rowRecord[column] === value) {
							Object.assign(row, values);
							updates++;
						}
					}
					const data: SupabaseRow[] | null = updates > 0 ? [] : null;
					return Promise.resolve({ data, error: null });
				},
				match(criteria: Record<string, unknown>) {
					let updates = 0;
					for (const row of cartItemsStore) {
						const rowRecord = row as unknown as SupabaseRow;
						if (Object.entries(criteria).every(([key, value]) => rowRecord[key] === value)) {
							Object.assign(row, values);
							updates++;
						}
					}
					const data: SupabaseRow[] | null = updates > 0 ? [] : null;
					return Promise.resolve({ data, error: null });
				},
			};
		},
		insert(values: Partial<CartRow> | Array<Partial<CartRow>>) {
			const rows = Array.isArray(values) ? values : [values];
			for (const value of rows) {
				const now = new Date().toISOString();
				cartItemsStore.push({
					id: value.id ?? `item_${Math.random().toString(36).slice(2)}`,
					session_id: value.session_id as string,
					product_id: value.product_id as string,
					quantity: value.quantity as number,
					created_at: value.created_at ?? now,
					updated_at: value.updated_at ?? now,
					user_id: value.user_id ?? null,
				});
			}
			return Promise.resolve({ data: null, error: null });
		},
		delete() {
			return {
				match(criteria: Record<string, unknown>) {
					for (let index = cartItemsStore.length - 1; index >= 0; index--) {
						const rowRecord = cartItemsStore[index] as unknown as SupabaseRow;
						if (Object.entries(criteria).every(([key, value]) => rowRecord[key] === value)) {
							cartItemsStore.splice(index, 1);
						}
					}
					return Promise.resolve({ data: null, error: null });
				},
				eq(column: string, value: unknown) {
					for (let index = cartItemsStore.length - 1; index >= 0; index--) {
						const rowRecord = cartItemsStore[index] as unknown as SupabaseRow;
						if (rowRecord[column] === value) {
							cartItemsStore.splice(index, 1);
						}
					}
					return Promise.resolve({ data: null, error: null });
				},
			};
		},
	};

	proxyBuilder = new Proxy(baseBuilder, {
		get(target, property) {
			if (property === "then") {
				const promise = Promise.resolve(buildResult());
				return promise.then.bind(promise);
			}
			if (property === "catch") {
				const promise = Promise.resolve(buildResult());
				return promise.catch.bind(promise);
			}
			if (property === "finally") {
				const promise = Promise.resolve(buildResult());
				return promise.finally.bind(promise);
			}
			return Reflect.get(target, property);
		},
	}) as CartQueryBuilder;

	return proxyBuilder;
};

const supabaseMock = {
	from: vi.fn((table: string) => {
		if (table !== "cart_items") {
			throw new Error(`Unexpected table requested in test: ${table}`);
		}
		return createCartItemsBuilder();
	}),
};

vi.mock("@/env.mjs", () => ({
	env: {
		STRIPE_SECRET_KEY: "sk_test_key",
		STRIPE_CURRENCY: "AED",
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: undefined,
		NEXT_PUBLIC_URL: "http://localhost:3000",
	},
}));

vi.mock("@/lib/supabase", () => ({
	supabase: supabaseMock,
}));

vi.mock("@/lib/stripe", () => ({
	getStripeClient: vi.fn(() => mockStripe),
}));

vi.mock("next/headers", () => ({
	cookies: vi.fn(() => ({
		get(name: string) {
			const value = cookieData.get(name);
			return value ? { name, value } : undefined;
		},
		getAll() {
			return Array.from(cookieData.entries()).map(([name, value]) => ({ name, value }));
		},
		set(name: string, value: string) {
			cookieData.set(name, value);
		},
		delete(name: string) {
			cookieData.delete(name);
		},
	})),
}));

let cartActions: typeof import("../cart-actions");

beforeAll(async () => {
	cartActions = await import("../cart-actions");
});

beforeEach(() => {
	cartItemsStore.length = 0;
	cookieData.clear();
	cookieData.set("yns_cart_id", SESSION_ID);
	mockStripe.products.retrieve.mockReset();
	mockStripe.prices.retrieve.mockReset();
	mockStripe.prices.list.mockReset();

	mockStripe.products.retrieve.mockImplementation(async (productId: string) => ({
		id: productId,
		name: `Product ${productId}`,
		description: "A test product",
		images: ["https://example.com/image.jpg"],
		metadata: { slug: productId },
		default_price: {
			id: `price_${productId}`,
			currency: "aed",
			unit_amount: productId === "prod_1" ? 1500 : 3200,
		},
	}));

	mockStripe.prices.retrieve.mockResolvedValue(null);
	mockStripe.prices.list.mockResolvedValue({ data: [] });
});

describe("cart actions (Supabase + Stripe)", () => {
	it("returns enriched cart data from Stripe", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 2,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		const cart = await cartActions.getCartAction();

		expect(cart).not.toBeNull();
		expect(cart?.id).toBe(SESSION_ID);
		expect(cart?.currency).toBe("AED");
		expect(cart?.total).toBe(3000);
		expect(cart?.items).toHaveLength(1);
		expect(cart?.items[0]).toMatchObject({
			productId: "prod_1",
			variantId: "price_prod_1",
			quantity: 2,
			price: 1500,
		});
		expect(mockStripe.products.retrieve).toHaveBeenCalledWith("prod_1", { expand: ["default_price"] });
	});

	it("adds a new item to the cart and returns updated data", async () => {
		const cart = await cartActions.addToCartAction("prod_1", 1);

		expect(cart.items).toHaveLength(1);
		expect(cart.total).toBe(1500);
		expect(cart.items[0].quantity).toBe(1);
		expect(cartItemsStore).toHaveLength(1);
	});

	it("increments quantity when adding an existing item", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 1,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		const cart = await cartActions.addToCartAction("prod_1", 3);

		expect(cart.items[0].quantity).toBe(4);
		expect(cart.total).toBe(6000);
	});

	it("updates item quantity", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 2,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		const cart = await cartActions.updateCartItemAction("prod_1", 5);

		expect(cart.items[0].quantity).toBe(5);
		expect(cart.total).toBe(7500);
	});

	it("removes items when quantity is set to zero", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 2,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		const cart = await cartActions.updateCartItemAction("prod_1", 0);

		expect(cart.items).toHaveLength(0);
		expect(cart.total).toBe(0);
		expect(cartItemsStore).toHaveLength(0);
	});

	it("removes an item from the cart", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 2,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		const cart = await cartActions.removeFromCartAction("prod_1");

		expect(cart.items).toHaveLength(0);
		expect(cart.total).toBe(0);
		expect(cartItemsStore).toHaveLength(0);
	});

	it("returns total item count", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push(
			{
				id: "item_1",
				session_id: SESSION_ID,
				product_id: "prod_1",
				quantity: 2,
				created_at: now,
				updated_at: now,
				user_id: null,
			},
			{
				id: "item_2",
				session_id: SESSION_ID,
				product_id: "prod_2",
				quantity: 3,
				created_at: now,
				updated_at: now,
				user_id: null,
			},
		);

		const count = await cartActions.getCartItemCount();

		expect(count).toBe(5);
	});

	it("clears all cart items", async () => {
		const now = new Date().toISOString();
		cartItemsStore.push({
			id: "item_1",
			session_id: SESSION_ID,
			product_id: "prod_1",
			quantity: 2,
			created_at: now,
			updated_at: now,
			user_id: null,
		});

		await cartActions.clearCartAction();

		expect(cartItemsStore).toHaveLength(0);
	});
});
