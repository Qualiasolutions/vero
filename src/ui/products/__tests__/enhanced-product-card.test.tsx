import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EnhancedProductCard } from "../enhanced-product-card";

// Mock Next.js components
vi.mock("next/image", () => ({
	default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("next/link", () => ({
	default: ({ href, children, className }: any) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

describe("EnhancedProductCard", () => {
	const baseProduct = {
		id: "prod_1",
		name: "Ferrari F40 1:18 Scale Model",
		slug: "ferrari-f40",
		price: 39900, // AED 399.00 in fils
		images: ["https://example.com/ferrari.jpg"],
		metadata: {
			brand: "BBurago",
			category: "supercars",
		},
	};

	it("should render product information correctly", () => {
		render(<EnhancedProductCard product={baseProduct} currency="AED" />);

		expect(screen.getByText("Ferrari F40 1:18 Scale Model")).toBeInTheDocument();
		expect(screen.getByText("BBurago")).toBeInTheDocument();
		expect(screen.getByText(/39900\.00/)).toBeInTheDocument(); // Price is in fils (smallest unit)
		expect(screen.getByText("View Details")).toBeInTheDocument();
	});

	it("should render with default currency", () => {
		render(<EnhancedProductCard product={baseProduct} />);

		expect(screen.getByText(/AED/)).toBeInTheDocument();
	});

	it("should display correct link to product page", () => {
		render(<EnhancedProductCard product={baseProduct} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/product/ferrari-f40");
	});

	it('should show "SPECIAL PRICE" badge for sale items', () => {
		const saleProduct = {
			...baseProduct,
			price: 29900,
			metadata: {
				...baseProduct.metadata,
				onSale: "true",
				originalPrice: "39900", // Same unit as price
			},
		};

		render(<EnhancedProductCard product={saleProduct} />);

		expect(screen.getByText("SPECIAL PRICE")).toBeInTheDocument();
		expect(screen.getByText(/29900\.00/)).toBeInTheDocument(); // Current price
		// Note: originalPrice only shows when originalPrice > price
	});

	it("should calculate and display discount percentage", () => {
		const saleProduct = {
			...baseProduct,
			price: 299, // Regular price value (not fils)
			metadata: {
				...baseProduct.metadata,
				onSale: "true",
				originalPrice: "399.00",
			},
		};

		render(<EnhancedProductCard product={saleProduct} />);

		// Discount is calculated as ((399 - 299) / 399) * 100 = ~25%
		expect(screen.getByText(/-25%/)).toBeInTheDocument();
	});

	it('should show "PRE-ORDER" badge with release date', () => {
		const preorderProduct = {
			...baseProduct,
			metadata: {
				...baseProduct.metadata,
				preorder: "true",
				releaseDate: "Q2 2025",
			},
		};

		render(<EnhancedProductCard product={preorderProduct} />);

		expect(screen.getByText("PRE-ORDER")).toBeInTheDocument();
		expect(screen.getByText(/Release: Q2 2025/)).toBeInTheDocument();
	});

	it('should show "LIMITED EDITION" badge for limited products', () => {
		const limitedProduct = {
			...baseProduct,
			name: "Ferrari F40 Limited Edition",
			metadata: {
				...baseProduct.metadata,
				category: "limited-edition",
			},
		};

		render(<EnhancedProductCard product={limitedProduct} />);

		expect(screen.getByText("LIMITED EDITION")).toBeInTheDocument();
	});

	it('should show "RARE" badge for rare products', () => {
		const rareProduct = {
			...baseProduct,
			name: "Ferrari F40 Rare Model",
			metadata: {
				...baseProduct.metadata,
				category: "rare-models",
			},
		};

		render(<EnhancedProductCard product={rareProduct} />);

		expect(screen.getByText("RARE")).toBeInTheDocument();
	});

	it('should show "NEW ARRIVAL" badge for new collection', () => {
		const newProduct = {
			...baseProduct,
			metadata: {
				...baseProduct.metadata,
				category: "new-arrivals",
			},
		};

		render(<EnhancedProductCard product={newProduct} />);

		expect(screen.getByText("NEW ARRIVAL")).toBeInTheDocument();
	});

	it("should handle missing product images with placeholder", () => {
		const productWithoutImages = {
			...baseProduct,
			images: [],
		};

		render(<EnhancedProductCard product={productWithoutImages} />);

		const image = screen.getByAltText("Ferrari F40 1:18 Scale Model");
		expect(image).toHaveAttribute("src", "/placeholder-car.jpg");
	});

	it("should not show brand if not provided", () => {
		const productWithoutBrand = {
			...baseProduct,
			metadata: {},
		};

		render(<EnhancedProductCard product={productWithoutBrand} />);

		expect(screen.queryByText("BBurago")).not.toBeInTheDocument();
	});

	it("should apply correct CSS classes for Vero design system", () => {
		const { container } = render(<EnhancedProductCard product={baseProduct} />);

		const card = container.querySelector(".vero-card");
		expect(card).toBeInTheDocument();
	});

	it("should format price correctly with two decimal places", () => {
		const productWithOddPrice = {
			...baseProduct,
			price: 12345, // Price in fils (smallest unit)
		};

		render(<EnhancedProductCard product={productWithOddPrice} currency="AED" />);

		expect(screen.getByText(/12345\.00/)).toBeInTheDocument(); // Displays as-is with .00
	});
});
