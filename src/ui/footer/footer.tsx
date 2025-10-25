import { CreditCard, Facebook, Instagram, Mail, Shield } from "lucide-react";
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
		<footer className="w-full border-t-2 border-[#dfbc3f]/30 bg-gradient-to-b from-black via-black/98 to-black/95 py-12">
			<div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-[1600px]">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
					{/* Brand Info */}
					<div className="md:col-span-1">
						<div className="flex flex-col gap-5 items-center md:items-start">
							<Image
								src="/veromodels-logo.webp"
								alt="Veromodels"
								width={400}
								height={140}
								className="h-32 w-auto object-contain"
							/>
							<p className="text-white/80 text-sm leading-relaxed text-center md:text-left">
								Premium 1:18 scale diecast collectibles from the world's finest manufacturers
							</p>
							<div className="flex items-center gap-3 mt-4">
								<a
									href="https://facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#dfbc3f] hover:text-[#c4a535] transition-all duration-300 p-3 rounded-full border-2 border-[#dfbc3f]/30 hover:border-[#dfbc3f] hover:bg-[#dfbc3f]/10 backdrop-blur-sm"
								>
									<Facebook className="w-5 h-5" />
								</a>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#dfbc3f] hover:text-[#c4a535] transition-all duration-300 p-3 rounded-full border-2 border-[#dfbc3f]/30 hover:border-[#dfbc3f] hover:bg-[#dfbc3f]/10 backdrop-blur-sm"
								>
									<Instagram className="w-5 h-5" />
								</a>
							</div>
						</div>
					</div>

					{/* Navigation Links */}
					<nav className="md:col-span-2 grid grid-cols-2 gap-12">
						{sections.slice(0, 2).map((section) => (
							<div key={section.header}>
								<h4 className="font-bold text-[#dfbc3f] uppercase tracking-wider text-sm mb-5">
									{section.header}
								</h4>
								<ul role="list" className="space-y-3">
									{section.links.map((link) => (
										<li key={link.label}>
											<YnsLink
												className="text-white/70 hover:text-[#dfbc3f] transition-all duration-300 text-sm font-medium"
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
					<div className="md:col-span-1 space-y-6">
						{/* Company Links */}
						<div>
							<h4 className="font-bold text-[#dfbc3f] uppercase tracking-wider text-sm mb-5">Company</h4>
							<ul role="list" className="space-y-3">
								{sections[2]?.links.map((link) => (
									<li key={link.label}>
										<YnsLink
											className="text-white/70 hover:text-[#dfbc3f] transition-all duration-300 text-sm font-medium"
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
							<h4 className="font-bold text-[#dfbc3f] uppercase tracking-wider text-sm mb-5">Get in Touch</h4>
							<div className="space-y-3">
								<a
									href="mailto:info@veromodels.com"
									className="text-white/70 hover:text-[#dfbc3f] transition-all duration-300 flex items-center gap-3 text-sm font-medium"
								>
									<Mail className="w-5 h-5 text-[#dfbc3f]" />
									<span>info@veromodels.com</span>
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t-2 border-[#dfbc3f]/20 pt-8 mt-10">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						{/* Copyright */}
						<div className="text-center md:text-left">
							<p className="text-white/60 text-sm font-medium">
								© {new Date().getFullYear()} Veromodels. All rights reserved.
							</p>
							<p className="text-white/40 text-sm mt-2">
								Developed by{" "}
								<a
									href="https://qualiasolutions.net"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#dfbc3f] hover:text-[#c4a535] transition-colors font-semibold"
								>
									Qualia Solutions
								</a>
							</p>
						</div>

						{/* Payment Methods */}
						<div className="flex flex-col sm:flex-row items-center gap-4">
							<div className="flex items-center gap-2 text-white/60 text-sm font-semibold uppercase tracking-wider">
								<Shield className="w-4 h-4 text-[#dfbc3f]" />
								<span>Secure Payment</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f]/50 hover:bg-white/15 transition-all">
									<CreditCard className="w-4 h-4 text-[#dfbc3f]" />
									<span className="text-xs font-bold text-white/90">Visa</span>
								</div>
								<div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f]/50 hover:bg-white/15 transition-all">
									<CreditCard className="w-4 h-4 text-[#dfbc3f]" />
									<span className="text-xs font-bold text-white/90">Mastercard</span>
								</div>
								<div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#dfbc3f]/30 rounded-lg hover:border-[#dfbc3f]/50 hover:bg-white/15 transition-all">
									<Shield className="w-4 h-4 text-[#dfbc3f]" />
									<span className="text-xs font-bold text-white/90">Stripe</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
