import Link from "next/link";
import { NavMobileMenu } from "@/ui/nav/nav-mobile-menu.client";
import StoreConfig from "@/store.config";

const links = [
	{
		label: "Home",
		href: "/",
	},
	...StoreConfig.categories.map(cat => ({
		label: cat.name,
		href: `/category/${cat.slug}`,
	})),
	{
		label: "All Models",
		href: "/products",
	},
];

export const NavMenu = () => {
	return (
		<>
			<div className="sm:block hidden">
				<ul className="flex flex-row items-center justify-center gap-x-2">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className="inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-light tracking-wide text-[#6C757D] hover:text-[#D4AF37] transition-colors duration-300 relative group"
							>
								{link.label}
								<span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div className="sm:hidden flex items-center">
				<NavMobileMenu>
					<ul className="flex pb-8 flex-col items-stretch justify-center gap-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="inline-flex h-9 w-full items-center justify-center px-4 py-2 text-sm font-light text-[#6C757D] hover:text-[#D4AF37] transition-colors border border-[#D4AF37]/20 hover:border-[#D4AF37]/60"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</NavMobileMenu>
			</div>
		</>
	);
};
