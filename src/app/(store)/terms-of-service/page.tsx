import { AlertCircle, CheckCircle, FileText, Scale, ShoppingBag, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service - Veromodels",
	description: "Read our terms of service for purchasing premium die-cast model cars.",
};

export default function TermsOfServicePage() {
	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative w-full bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] text-white overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-20 w-64 h-64 border border-[#D4AF37] rounded-full animate-float" />
					<div className="absolute bottom-10 right-20 w-48 h-48 border border-[#D4AF37] rounded-full animate-float delay-1000" />
				</div>
				<div className="relative z-10 w-full px-6 lg:px-12 xl:px-16 py-16 lg:py-20">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
							<Scale className="w-4 h-4 text-[#D4AF37]" />
							<span className="text-sm font-medium text-[#E6C757]">Legal Agreement</span>
						</div>
						<h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">
							Terms of <span className="vero-elegant-text">Service</span>
						</h1>
						<p className="text-base lg:text-lg text-white/80 leading-relaxed">Last Updated: January 2025</p>
					</div>
				</div>
			</section>

			{/* Content Sections */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
				<div className="max-w-4xl mx-auto space-y-12">
					{/* Agreement to Terms */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<FileText className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Agreement to Terms</h2>
								<p className="text-[#6C757D] leading-relaxed">
									These Terms of Service constitute a legally binding agreement between you and Veromodels
									concerning your access to and use of our website and services. By accessing or using our
									website, you agree to be bound by these Terms. If you disagree with any part of the terms,
									then you may not access the service.
								</p>
							</div>
						</div>
					</div>

					{/* Product Information */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Products & Pricing</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									We make every effort to display our products and their colors as accurately as possible.
									However, we cannot guarantee that your device's display accurately reflects the actual
									product colors.
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>
											All products are authentic 1:18 scale die-cast models from licensed manufacturers
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Prices are subject to change without notice</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>We reserve the right to limit quantities purchased per person or per order</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Limited edition items may have purchase restrictions</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Orders & Payment */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<CheckCircle className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Orders & Payment</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									When you place an order through our website, you are offering to purchase a product subject
									to these Terms.
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>All payments are processed securely through Stripe</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>We accept major credit cards and debit cards</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Payment must be received in full before order processing</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>We reserve the right to refuse or cancel any order for any reason</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Pre-order items will be charged at the time of order placement</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Intellectual Property */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Scale className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Intellectual Property</h2>
								<p className="text-[#6C757D] leading-relaxed">
									The Service and its original content, features and functionality are and will remain the
									exclusive property of Veromodels and its licensors. The Service is protected by copyright,
									trademark, and other laws. Our trademarks and trade dress may not be used in connection with
									any product or service without our prior written consent.
								</p>
							</div>
						</div>
					</div>

					{/* Limitation of Liability */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<AlertCircle className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Limitation of Liability</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									In no event shall Veromodels, nor its directors, employees, partners, agents, suppliers, or
									affiliates, be liable for any indirect, incidental, special, consequential or punitive
									damages, including without limitation, loss of profits, data, use, goodwill, or other
									intangible losses, resulting from:
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Your access to or use of or inability to access or use the Service</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Any conduct or content of any third party on the Service</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Any content obtained from the Service</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Unauthorized access, use or alteration of your transmissions or content</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Prohibited Uses */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<XCircle className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Prohibited Uses</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									You may use our Service only for lawful purposes. You agree not to use the Service:
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>
											In any way that violates any applicable national or international law or regulation
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>
											To transmit any advertising or promotional material without our prior written consent
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>To impersonate or attempt to impersonate Veromodels or another user</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>To engage in any automated use of the system</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Changes to Terms */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20 bg-gradient-to-br from-[#F5E6D3]/20 to-white">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<FileText className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Changes to Terms</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									We reserve the right to modify or replace these Terms at any time. If a revision is
									material, we will provide at least 30 days' notice prior to any new terms taking effect.
									What constitutes a material change will be determined at our sole discretion.
								</p>
								<p className="text-[#6C757D] leading-relaxed">
									By continuing to access or use our Service after any revisions become effective, you agree
									to be bound by the revised terms. If you do not agree to the new terms, you are no longer
									authorized to use the Service.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
