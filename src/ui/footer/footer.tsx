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
		<footer className="w-full border-t border-[#D4AF37]/20 bg-gradient-to-b from-white to-[#FDFBF7] p-6 text-[#6C757D] md:py-12">
			<div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
				<div className="">
					<div className="flex w-full max-w-sm flex-col gap-4">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={180}
							height={60}
							className="h-12 w-auto mb-2 object-contain"
						/>
						<p className="text-[#6C757D] leading-relaxed">
							Premium 1:18 scale diecast car models. Luxury collectibles from the world's most prestigious automobile manufacturers.
						</p>
						<h3 className="font-medium text-[#D4AF37] mt-4 uppercase tracking-wider text-sm">{t("newsletterTitle")}</h3>
						<Newsletter />
					</div>
				</div>

				<nav className="grid grid-cols-3 gap-12">
					{sections.map((section) => (
						<section key={section.header}>
							<h3 className="mb-4 font-medium text-[#D4AF37] uppercase tracking-wider text-sm">{section.header}</h3>
							<ul role="list" className="grid gap-3">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink className="text-[#6C757D] hover:text-[#D4AF37] transition-colors" href={link.href}>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>
			<div className="container mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#6C757D] border-t border-[#D4AF37]/20 pt-8 md:flex-row">
				<div>
					<p>© {new Date().getFullYear()} Veromodels. All rights reserved.</p>
					<p>Premium diecast collectibles for discerning collectors worldwide.</p>
				</div>
				<div className="flex items-center gap-4">
					<p className="text-[#6C757D]">Contact: info@veromodels.com</p>
				</div>
			</div>
		</footer>
	);
}
