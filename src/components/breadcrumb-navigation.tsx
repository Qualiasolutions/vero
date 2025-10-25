import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
	label: string;
	href?: string;
	current?: boolean;
}

interface BreadcrumbNavigationProps {
	items: BreadcrumbItem[];
	className?: string;
}

export function BreadcrumbNavigation({ items, className = "" }: BreadcrumbNavigationProps) {
	return (
		<nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm text-[#6B7280] ${className}`}>
			<Link
				href="/"
				className="flex items-center gap-1 hover:text-[var(--vero-gold-accent)] transition-colors duration-200"
				aria-label="Home"
			>
				<Home className="w-4 h-4" />
			</Link>

			{items.map((item, index) => (
				<div key={index} className="flex items-center gap-2">
					<ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
					{item.href && !item.current ? (
						<Link
							href={item.href}
							className="hover:text-[var(--vero-gold-accent)] transition-colors duration-200 font-medium"
						>
							{item.label}
						</Link>
					) : (
						<span
							className={`text-[#111827] font-medium ${item.current ? "text-[var(--vero-gold-accent)]" : ""}`}
						>
							{item.label}
						</span>
					)}
				</div>
			))}
		</nav>
	);
}

// Helper function to generate breadcrumbs for common pages
export function generateBreadcrumbs(
	pageType: string,
	additionalData?: Record<string, unknown>,
): BreadcrumbItem[] {
	switch (pageType) {
		case "products":
			return [{ label: "All Models", current: true }];

		case "category":
			return [
				{ label: "All Models", href: "/products" },
				{
					label: (additionalData?.categoryName as string | undefined) || "Category",
					current: true,
				},
			];

		case "product":
			return [
				{ label: "All Models", href: "/products" },
				...(additionalData?.categoryName
					? [
							{
								label: additionalData.categoryName as string,
								href: `/category/${additionalData.categorySlug as string}`,
							},
						]
					: []),
				{ label: (additionalData?.productName as string | undefined) || "Product", current: true },
			];

		case "search":
			return [{ label: "Search Results", current: true }];

		case "cart":
			return [{ label: "Shopping Cart", current: true }];

		case "checkout":
			return [
				{ label: "Shopping Cart", href: "/cart" },
				{ label: "Checkout", current: true },
			];

		case "orders":
			return [{ label: "My Orders", current: true }];

		case "favorites":
			return [{ label: "My Favorites", current: true }];

		case "contact":
			return [{ label: "Contact Us", current: true }];

		case "about":
			return [{ label: "About Us", current: true }];

		case "faq":
			return [{ label: "FAQ", current: true }];

		default:
			return [];
	}
}
