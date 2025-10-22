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
		<footer className="w-full border-t border-[#D4AF37]/30 bg-white py-6">
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
							<p className="text-[#6C757D] text-sm leading-relaxed mt-2">
								Premium 1:18 scale diecast collectibles
							</p>
							<div className="flex items-center gap-2 mt-3">
								<a
									href="https://facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#6C757D]/60 hover:text-[#D4AF37] transition-colors p-2 rounded-full bg-[#F5E6D3]/10 hover:bg-[#D4AF37]/20"
								>
									<Facebook className="w-4 h-4" />
								</a>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#6C757D]/60 hover:text-[#D4AF37] transition-colors p-2 rounded-full bg-[#F5E6D3]/10 hover:bg-[#D4AF37]/20"
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
								<h4 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-xs mb-3">
									{section.header}
								</h4>
								<ul role="list" className="space-y-2">
									{section.links.map((link) => (
										<li key={link.label}>
											<YnsLink
												className="text-[#6C757D] hover:text-[#D4AF37] transition-colors text-sm"
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
							<h4 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-xs mb-3">Company</h4>
							<ul role="list" className="space-y-2">
								{sections[2]?.links.map((link) => (
									<li key={link.label}>
										<YnsLink
											className="text-[#6C757D] hover:text-[#D4AF37] transition-colors text-sm"
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
							<h4 className="font-semibold text-[#D4AF37] uppercase tracking-wider text-xs mb-3">
								Get in Touch
							</h4>
							<div className="space-y-2">
								<a
									href="mailto:info@veromodels.com"
									className="text-[#6C757D] hover:text-[#D4AF37] transition-colors flex items-center gap-2 text-sm"
								>
									<Mail className="w-4 h-4" />
									<span>info@veromodels.com</span>
								</a>
								<div className="flex items-center gap-2">
									<span className="text-[#6C757D] text-sm">Follow us:</span>
									<a
										href="https://facebook.com/veromodels"
										target="_blank"
										rel="noopener noreferrer"
										className="text-[#D4AF37] hover:text-[#B8941F] transition-colors"
									>
										Facebook
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-[#D4AF37]/20 pt-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						{/* Copyright */}
						<div className="text-center md:text-left">
							<p className="text-[#6C757D] text-xs">
								© {new Date().getFullYear()} Veromodels. All rights reserved.
							</p>
							<p className="text-[#6C757D]/50 text-xs mt-1">
								Developed by{" "}
								<a
									href="https://qualiasolutions.net"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#D4AF37] hover:text-[#B8941F] transition-colors"
								>
									Qualia Solutions
								</a>
							</p>
						</div>

						{/* Payment Methods */}
						<div className="flex items-center gap-4">
							<span className="text-[#6C757D] text-xs">Secure Payment:</span>
							<div className="flex items-center gap-2">
								{/* Stripe Icon */}
								<svg className="w-6 h-4 text-[#6C757D]" viewBox="0 0 24 24" fill="currentColor">
									<path d="M13.5 0C12.254 0 0 7.246 0 1.75v6.504c0 1.273.446.205.446.205.446h12.254l1.415 2.415c0 1.273.0 2.446-.695L13.5 15.75c0 1.424-.287.863-.717.863-.717C15.75 16.5 18 15.75c-3.774 4.62-5.379 8.246-5.379C3.754 8.246c-1.426-1.426-1.426 0-1 0h-2.876c0 1.426.71.429 2.446.714.29-2.446.714-.29 0-.571.571-1.426-1.426v-4c0 2.285 0 4.62z" />
								</svg>
								<span className="text-[#6C757D] text-xs ml-2">Visa</span>
								{/* Mastercard Icon */}
								<svg className="w-6 h-4 text-[#6C757D]" viewBox="0 0 24 24" fill="currentColor">
									<path d="M4.31 3c1.24 0 2.26-.28.56-.46-.05L2 1.41c0-.13.24-.22.28-.46.07-.53-.54L.69 4c0 .55.54.62.28.46.54L21.56 3c0 .55.62.28.46.54.62 28.46.54c0 1.1-.27.05-.53.52-.53.51.63.51.63.51.63s-.51 0-1 0H1.41c0-.13.24-.22.28-.46.07-.53-.54l.84-.54L3 16c0 .55.54.62.28.46.54.62 28.46.54c0 1.1-.27.05-.53.52-.53.51.63.51.63.51.63s-.51 0-1 0z" />
								</svg>
								<span className="text-[#6C757D] text-xs ml-2">Mastercard</span>
								{/* Amex Icon */}
								<svg className="w-6 h-4 text-[#6C757D]" viewBox="0 0 24 24" fill="currentColor">
									<path d="M21 8V2c0-1.1-.9-2-2H2C.9 0 2 2 .9 2 2v2c0 1.1.9 2 2 .9 2 2v13a2 2 0 004 0h2a2 2 0 004 2zm4 2V17a2 2 0 004-2H6a2 2 0 004 2zm1 1c0 .55.45 1 .55.45 1 .55.45 1v1h4v4H6c0-.55-.45-1-.55-.45-1-.55-.45-1-.55-.45-1-.55-.45-1-.55-.45v1a2 2 0 004 0H4a2 2 0 004 2z" />
								</svg>
								<span className="text-[#6C757D] text-xs ml-2">Amex</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
