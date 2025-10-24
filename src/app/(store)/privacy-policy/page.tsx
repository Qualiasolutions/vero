import { Eye, FileText, Globe, Lock, Shield, UserCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy - Veromodels",
	description: "Learn how Veromodels protects and handles your personal information.",
};

export default function PrivacyPolicyPage() {
	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative w-full bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] text-white overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-20 w-64 h-64 border border-[#C4A962] rounded-full animate-float" />
					<div className="absolute bottom-10 right-20 w-48 h-48 border border-[#C4A962] rounded-full animate-float delay-1000" />
				</div>
				<div className="relative z-10 w-full px-6 lg:px-12 xl:px-16 py-16 lg:py-20">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 bg-[#C4A962]/10 border border-[#C4A962]/30 rounded-full px-4 py-2 backdrop-blur-sm mb-6">
							<Shield className="w-4 h-4 text-[#C4A962]" />
							<span className="text-sm font-medium text-[#D4B673]">Your Privacy Matters</span>
						</div>
						<h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">
							Privacy <span className="vero-elegant-text">Policy</span>
						</h1>
						<p className="text-base lg:text-lg text-white/80 leading-relaxed">Last Updated: January 2025</p>
					</div>
				</div>
			</section>

			{/* Content Sections */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
				<div className="max-w-4xl mx-auto space-y-12">
					{/* Introduction */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<FileText className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">Introduction</h2>
								<p className="text-[#6B7280] leading-relaxed">
									Welcome to Veromodels. We respect your privacy and are committed to protecting your personal
									data. This privacy policy will inform you about how we handle your personal data when you
									visit our website and tell you about your privacy rights and how the law protects you.
								</p>
							</div>
						</div>
					</div>

					{/* Information We Collect */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Eye className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">Information We Collect</h2>
								<p className="text-[#6B7280] leading-relaxed mb-4">
									We may collect, use, store and transfer different kinds of personal data about you:
								</p>
								<ul className="space-y-3 text-[#6B7280]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>
											<strong className="text-[#111827]">Identity Data:</strong> First name, last name,
											username or similar identifier
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>
											<strong className="text-[#111827]">Contact Data:</strong> Email address, telephone
											numbers, billing and delivery addresses
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>
											<strong className="text-[#111827]">Financial Data:</strong> Payment card details
											(processed securely through Stripe)
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>
											<strong className="text-[#111827]">Transaction Data:</strong> Details about payments and
											products you have purchased
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>
											<strong className="text-[#111827]">Technical Data:</strong> IP address, browser type,
											device information
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* How We Use Your Information */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<UserCheck className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">How We Use Your Information</h2>
								<p className="text-[#6B7280] leading-relaxed mb-4">
									We will only use your personal data when the law allows us to. Most commonly, we will use
									your personal data in the following circumstances:
								</p>
								<ul className="space-y-3 text-[#6B7280]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>To process and deliver your orders</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>To manage payments, fees and charges</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>To provide customer support and respond to inquiries</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>To send you marketing communications (with your consent)</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>To improve our website and services</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Data Security */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Lock className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">Data Security</h2>
								<p className="text-[#6B7280] leading-relaxed">
									We have put in place appropriate security measures to prevent your personal data from being
									accidentally lost, used or accessed in an unauthorized way, altered or disclosed. All
									payment transactions are encrypted and processed securely through Stripe. We limit access to
									your personal data to those employees, agents, contractors and other third parties who have
									a business need to know.
								</p>
							</div>
						</div>
					</div>

					{/* Your Rights */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Shield className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">Your Legal Rights</h2>
								<p className="text-[#6B7280] leading-relaxed mb-4">
									Under certain circumstances, you have rights under data protection laws in relation to your
									personal data:
								</p>
								<ul className="space-y-3 text-[#6B7280]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Request access to your personal data</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Request correction of your personal data</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Request erasure of your personal data</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Object to processing of your personal data</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Request restriction of processing your personal data</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#C4A962] rounded-full mt-2 flex-shrink-0" />
										<span>Request transfer of your personal data</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Contact */}
					<div className="vero-card rounded-xl p-8 border border-[#C4A962]/20 bg-gradient-to-br from-[#F5E6D3]/20 to-white">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#C4A962]/10 to-[#D4B673]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Globe className="w-6 h-6 text-[#C4A962]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#111827] mb-3">Contact Us</h2>
								<p className="text-[#6B7280] leading-relaxed mb-4">
									If you have any questions about this privacy policy or our privacy practices, please contact
									us:
								</p>
								<div className="space-y-2 text-[#6B7280]">
									<p>
										<strong className="text-[#111827]">Email:</strong> info@veromodels.com
									</p>
									<p>
										<strong className="text-[#111827]">Phone:</strong> +1 (234) 567-890
									</p>
									<p>
										<strong className="text-[#111827]">Address:</strong> Cyprus, Nicosia
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
