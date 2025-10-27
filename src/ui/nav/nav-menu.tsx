"use client";

import Link from "next/link";
import StoreConfig from "@/store.config";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";

const links = [
	{
		label: "Collection",
		href: "/products",
	},
	...StoreConfig.categories.map((cat) => ({
		label: cat.name,
		href: `/category/${cat.slug}`,
	})),
];

export const NavMenu = () => {
	return (
		<>
			{/* Desktop Navigation */}
			<nav className="hidden lg:block">
				<ul className="flex flex-row items-center gap-3 whitespace-nowrap">
					{links.map((link) => (
						<li key={link.href} className="flex-shrink-0">
							<Link
								href={link.href}
								className="inline-flex h-10 items-center justify-center rounded-full border border-transparent px-5 text-sm font-medium tracking-wide text-[#111827] transition-all duration-200 hover:border-[#C4A962] hover:bg-[#C4A962]/10 hover:text-[#A89050]"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{/* Mobile Navigation */}
			<div className="lg:hidden flex items-center">
				<NavMobileMenu>
					<nav className="w-full">
						<ul className="flex flex-col items-stretch justify-center gap-1 p-2">
							{links.map((link, index) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="flex h-12 w-full items-center justify-start rounded-lg border border-[#C4A962]/20 px-4 text-sm font-medium text-[#111827] transition-all duration-200 hover:border-[#C4A962]/50 hover:bg-[#C4A962]/10 hover:text-[#A89050]"
									>
										<span className="mr-3 text-[#C4A962]/60">{String(index + 1).padStart(2, "0")}</span>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</NavMobileMenu>
			</div>
		</>
	);
};
