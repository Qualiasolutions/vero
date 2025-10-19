import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
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
				<div className="max-w-sm">
					<div className="flex flex-col gap-5">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={360}
							height={120}
							className="h-20 w-auto mb-2 object-contain"
						/>
						<p className="text-[#F5E6D3]/70 leading-relaxed text-sm">
							Premium 1:18 scale diecast car models. Luxury collectibles from the world's most prestigious
							automobile manufacturers.
						</p>

						{/* Contact Information */}
						<div className="space-y-3 pt-2">
							<div className="flex items-center gap-3 text-[#F5E6D3]/60 hover:text-[#D4AF37] transition-colors group">
								<Mail className="w-4 h-4 text-[#D4AF37]" />
								<a href="mailto:info@veromodels.com" className="text-sm">info@veromodels.com</a>
							</div>
							<div className="flex items-center gap-3 text-[#F5E6D3]/60 hover:text-[#D4AF37] transition-colors group">
								<Phone className="w-4 h-4 text-[#D4AF37]" />
								<a href="tel:+1234567890" className="text-sm">+1 (234) 567-890</a>
							</div>
							<div className="flex items-start gap-3 text-[#F5E6D3]/60">
								<MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
								<span className="text-sm">Cyprus, Nicosia</span>
							</div>
						</div>

						{/* Social Media */}
						<div className="pt-4">
							<h3 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-xs mb-3">
								Follow Us
							</h3>
							<div className="flex items-center gap-3">
								<a
									href="https://facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-lg bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#F5E6D3]/60 hover:text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110"
								>
									<Facebook className="w-5 h-5" />
								</a>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 rounded-lg bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#F5E6D3]/60 hover:text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110"
								>
									<Instagram className="w-5 h-5" />
								</a>
							</div>
						</div>

						{/* Newsletter */}
						<div className="pt-4 border-t border-[#D4AF37]/20">
							<h3 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-xs mb-3">
								{t("newsletterTitle")}
							</h3>
							<Newsletter />
						</div>
					</div>
				</div>

				<nav className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{sections.map((section) => (
						<section key={section.header}>
							<h3 className="mb-5 font-semibold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-[#D4AF37]/20 pb-3">
								{section.header}
							</h3>
							<ul role="list" className="grid gap-3">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink
											className="text-[#F5E6D3]/60 hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-1 inline-block text-sm group flex items-center gap-2"
											href={link.href}
										>
											<span className="w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-3"></span>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>

			{/* Bottom Section - Enhanced */}
			<div className="container mt-16 max-w-7xl relative z-10">
				<div className="border-t border-[#D4AF37]/30 pt-8 pb-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						{/* Copyright */}
						<div className="text-center md:text-left">
							<p className="text-[#F5E6D3]/70 text-sm font-medium">
								© {new Date().getFullYear()} Veromodels. All rights reserved.
							</p>
							<p className="text-[#F5E6D3]/50 text-xs mt-1.5">
								Premium diecast collectibles for discerning collectors worldwide.
							</p>
						</div>

						{/* Payment/Trust Badges */}
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
								<svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect width="38" height="24" rx="4" fill="#1434CB"/>
									<path d="M14 12L12 8h4l2 4-2 4h-4l2-4z" fill="#FF6E14"/>
									<path d="M24 12L22 8h4l2 4-2 4h-4l2-4z" fill="#EB001B"/>
								</svg>
								<svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect width="38" height="24" rx="4" fill="#00579F"/>
									<circle cx="14" cy="12" r="6" fill="#EB001B"/>
									<circle cx="24" cy="12" r="6" fill="#FF9800"/>
								</svg>
								<span className="text-[#F5E6D3]/60 text-xs ml-1">Secure Payment</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
