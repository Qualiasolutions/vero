import { Facebook, Instagram, Mail } from "lucide-react";
import Image from "next/image";
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
	return (
		<footer className="w-full border-t border-[var(--selfridges-border-light)] bg-[var(--selfridges-bg-primary)] py-6">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
					{/* Brand Info */}
					<div className="md:col-span-1">
						<div className="flex flex-col gap-4">
							<Image
								src="/veromodels-logo.webp"
								alt="Veromodels"
								width={160}
								height={60}
								className="h-12 w-auto object-contain"
							/>
							<p className="text-[var(--selfridges-text-muted)] text-sm leading-relaxed mt-2">
								Premium 1:18 scale diecast collectibles
							</p>
							<div className="flex items-center gap-2 mt-3">
								<a
									href="https://facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--selfridges-text-muted)]/60 hover:text-[var(--selfridges-text-secondary)] transition-colors p-2 rounded-full bg-[var(--selfridges-bg-secondary)] hover:bg-[var(--selfridges-bg-tertiary)]"
								>
									<Facebook className="w-4 h-4" />
								</a>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--selfridges-text-muted)]/60 hover:text-[var(--selfridges-text-secondary)] transition-colors p-2 rounded-full bg-[var(--selfridges-bg-secondary)] hover:bg-[var(--selfridges-bg-tertiary)]"
								>
									<Instagram className="w-4 h-4" />
								</a>
							</div>
						</div>
					</div>

					{/* Navigation Links */}
					<nav className="md:col-span-2 grid grid-cols-2 gap-8">
						{sections.slice(0, 2).map((section) => (
							<div key={section.header}>
								<h4 className="font-semibold text-[var(--selfridges-text-primary)] uppercase tracking-wider text-xs mb-3">
									{section.header}
								</h4>
								<ul role="list" className="space-y-2">
									{section.links.map((link) => (
										<li key={link.label}>
											<YnsLink
												className="text-[var(--selfridges-text-muted)] hover:text-[var(--selfridges-text-secondary)] transition-colors text-sm"
												href={link.href}
											>
												{link.label}
											</YnsLink>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>

					{/* Company & Contact */}
					<div className="md:col-span-1 space-y-4">
						{/* Company Links */}
						<div>
							<h4 className="font-semibold text-[var(--selfridges-text-primary)] uppercase tracking-wider text-xs mb-3">
								Company
							</h4>
							<ul role="list" className="space-y-2">
								{sections[2]?.links.map((link) => (
									<li key={link.label}>
										<YnsLink
											className="text-[var(--selfridges-text-muted)] hover:text-[var(--selfridges-text-secondary)] transition-colors text-sm"
											href={link.href}
										>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h4 className="font-semibold text-[var(--selfridges-text-primary)] uppercase tracking-wider text-xs mb-3">
								Get in Touch
							</h4>
							<div className="space-y-2">
								<a
									href="mailto:info@veromodels.com"
									className="text-[var(--selfridges-text-muted)] hover:text-[var(--selfridges-text-secondary)] transition-colors flex items-center gap-2 text-sm"
								>
									<Mail className="w-4 h-4" />
									<span>info@veromodels.com</span>
								</a>
								<div className="flex items-center gap-2">
									<span className="text-[var(--selfridges-text-muted)] text-sm">Follow us:</span>
									<a
										href="https://facebook.com/veromodels"
										target="_blank"
										rel="noopener noreferrer"
										className="text-[var(--selfridges-text-secondary)] hover:text-[var(--selfridges-text-primary)] transition-colors"
									>
										Facebook
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-[var(--selfridges-border-light)] pt-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						{/* Copyright */}
						<div className="text-center md:text-left">
							<p className="text-[var(--selfridges-text-muted)] text-xs">
								© {new Date().getFullYear()} Veromodels. All rights reserved.
							</p>
							<p className="text-[var(--selfridges-text-muted)]/70 text-xs mt-1">
								Developed by{" "}
								<a
									href="https://qualiasolutions.net"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--selfridges-text-secondary)] hover:text-[var(--selfridges-text-primary)] transition-colors"
								>
									Qualia Solutions
								</a>
							</p>
						</div>

						{/* Payment Methods */}
						<div className="flex items-center gap-4">
							<span className="text-[var(--selfridges-text-muted)] text-xs">Secure Payment:</span>
							<div className="flex items-center gap-3">
								<div className="px-3 py-1 bg-[var(--selfridges-bg-secondary)] rounded text-xs font-semibold text-[var(--selfridges-text-muted)]">
									Visa
								</div>
								<div className="px-3 py-1 bg-[var(--selfridges-bg-secondary)] rounded text-xs font-semibold text-[var(--selfridges-text-muted)]">
									Mastercard
								</div>
								<div className="px-3 py-1 bg-[var(--selfridges-bg-secondary)] rounded text-xs font-semibold text-[var(--selfridges-text-muted)]">
									Amex
								</div>
								<div className="px-3 py-1 bg-[var(--selfridges-bg-secondary)] rounded text-xs font-semibold text-[var(--selfridges-text-muted)]">
									Stripe
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
