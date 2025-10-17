import Image from "next/image";
import { getTranslations } from "@/i18n/server";
import { Newsletter } from "@/ui/footer/newsletter.client";
import { YnsLink } from "@/ui/yns-link";

const sections = [
	{
		header: "Collections",
		links: [
			{ label: "All Models", href: "/products" },
			{ label: "New Arrivals", href: "/category/new-arrivals" },
			{ label: "Pre-Order", href: "/category/pre-order" },
			{ label: "Special Price", href: "/category/on-sale" },
			{ label: "Limited Editions", href: "/category/limited-edition" },
			{ label: "Rare Models", href: "/category/rare" },
		],
	},
	{
		header: "Services",
		links: [
			{ label: "Custom Request", href: "/order-your-diecast" },
			{ label: "Contact Us", href: "/contact" },
			{ label: "Shipping & Returns", href: "/shipping-returns" },
			{ label: "FAQ", href: "/faq" },
		],
	},
	{
		header: "Company",
		links: [
			{ label: "About Us", href: "/about" },
			{ label: "Privacy Policy", href: "/privacy-policy" },
			{ label: "Terms of Service", href: "/terms-of-service" },
		],
	},
];

export async function Footer() {
	const t = await getTranslations("Global.footer");

	return (
		<footer className="w-full border-t border-[#D4AF37]/30 vero-black-gradient p-6 text-[#F5E6D3]/70 md:py-12 relative overflow-hidden">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTMwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpNNiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] pointer-events-none"></div>

			<div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between relative z-10">
				<div className="">
					<div className="flex w-full max-w-sm flex-col gap-4">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={180}
							height={60}
							className="h-12 w-auto mb-2 object-contain brightness-0 invert opacity-90"
						/>
						<p className="text-[#F5E6D3]/60 leading-relaxed">
							Premium 1:18 scale diecast car models. Luxury collectibles from the world's most prestigious
							automobile manufacturers.
						</p>
						<h3 className="font-medium text-[#D4AF37] mt-4 uppercase tracking-wider text-sm">
							{t("newsletterTitle")}
						</h3>
						<Newsletter />
					</div>
				</div>

				<nav className="grid grid-cols-3 gap-12">
					{sections.map((section) => (
						<section key={section.header}>
							<h3 className="mb-4 font-medium text-[#D4AF37] uppercase tracking-wider text-sm">
								{section.header}
							</h3>
							<ul role="list" className="grid gap-3">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink
											className="text-[#F5E6D3]/60 hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-1 inline-block"
											href={link.href}
										>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>
			<div className="container mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#F5E6D3]/50 border-t border-[#D4AF37]/30 pt-8 md:flex-row relative z-10">
				<div>
					<p className="text-[#F5E6D3]/60">© {new Date().getFullYear()} Veromodels. All rights reserved.</p>
					<p className="text-[#F5E6D3]/40 text-xs mt-1">
						Premium diecast collectibles for discerning collectors worldwide.
					</p>
				</div>
				<div className="flex items-center gap-4">
					<p className="text-[#D4AF37]/80 hover:text-[#E6C757] transition-colors">
						Contact: info@veromodels.com
					</p>
				</div>
			</div>
		</footer>
	);
}
