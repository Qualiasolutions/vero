import { CheckCircle, Clock, MapPin, Package, RotateCcw, Shield, Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shipping & Returns - Veromodels",
	description: "Learn about our shipping options and return policy for die-cast model cars.",
};

export default function ShippingReturnsPage() {
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
							<Truck className="w-4 h-4 text-[#D4AF37]" />
							<span className="text-sm font-medium text-[#E6C757]">Worldwide Delivery</span>
						</div>
						<h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">
							Shipping & <span className="vero-elegant-text">Returns</span>
						</h1>
						<p className="text-base lg:text-lg text-white/80 leading-relaxed">
							Fast, secure delivery with easy returns for your peace of mind
						</p>
					</div>
				</div>
			</section>

			{/* Content Sections */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
				<div className="max-w-4xl mx-auto space-y-12">
					{/* Shipping Information */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Package className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Shipping Information</h2>
								<p className="text-[#6C757D] leading-relaxed mb-6">
									We ship our premium die-cast models worldwide with the utmost care and attention to ensure
									they arrive in perfect condition.
								</p>

								<div className="grid md:grid-cols-2 gap-6">
									<div className="bg-gradient-to-br from-[#F5E6D3]/20 to-white rounded-lg p-5 border border-[#D4AF37]/10">
										<div className="flex items-center gap-3 mb-3">
											<Truck className="w-5 h-5 text-[#D4AF37]" />
											<h3 className="font-semibold text-[#212529]">Standard Shipping</h3>
										</div>
										<ul className="space-y-2 text-sm text-[#6C757D]">
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Delivery: 5-7 business days</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Cost: AED 35</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Free on orders over AED 550</span>
											</li>
										</ul>
									</div>

									<div className="bg-gradient-to-br from-[#D4AF37]/10 to-white rounded-lg p-5 border border-[#D4AF37]/20">
										<div className="flex items-center gap-3 mb-3">
											<Package className="w-5 h-5 text-[#D4AF37]" />
											<h3 className="font-semibold text-[#212529]">Express Shipping</h3>
										</div>
										<ul className="space-y-2 text-sm text-[#6C757D]">
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Delivery: 2-3 business days</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Cost: AED 75</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Priority handling & tracking</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Processing Time */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Clock className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Order Processing</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									All orders are carefully inspected and securely packaged before shipping.
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
										<span>
											<strong className="text-[#212529]">In-Stock Items:</strong> Processed within 1-2
											business days
										</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
										<span>
											<strong className="text-[#212529]">Pre-Order Items:</strong> Shipped as soon as stock
											arrives (estimated dates provided)
										</span>
									</li>
									<li className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
										<span>
											<strong className="text-[#212529]">Custom Orders:</strong> Processing time varies (we'll
											notify you)
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* International Shipping */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<MapPin className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">International Shipping</h2>
								<p className="text-[#6C757D] leading-relaxed mb-4">
									We ship to collectors worldwide. International shipping times and costs vary by destination.
								</p>
								<ul className="space-y-3 text-[#6C757D]">
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Delivery time: 7-21 business days depending on location</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>All packages include tracking and insurance</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Customs duties and taxes are the responsibility of the recipient</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0" />
										<span>Shipping cost calculated at checkout based on destination</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Packaging */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<Shield className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div>
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Premium Packaging</h2>
								<p className="text-[#6C757D] leading-relaxed">
									Every model is double-boxed with protective foam padding to ensure it arrives in pristine
									condition. We take extra care with limited edition and rare collectibles, using additional
									protective measures to safeguard your investment.
								</p>
							</div>
						</div>
					</div>

					{/* Returns Policy */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20 bg-gradient-to-br from-[#F5E6D3]/20 to-white">
						<div className="flex items-start gap-4 mb-6">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<RotateCcw className="w-6 h-6 text-[#D4AF37]" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold text-[#212529] mb-3">Return Policy</h2>
								<p className="text-[#6C757D] leading-relaxed mb-6">
									We want you to be completely satisfied with your purchase. If you're not happy, we offer a
									30-day return policy for most items.
								</p>

								<div className="space-y-4">
									<div className="bg-white rounded-lg p-5 border border-[#D4AF37]/10">
										<h3 className="font-semibold text-[#212529] mb-3 flex items-center gap-2">
											<CheckCircle className="w-5 h-5 text-green-500" />
											Eligible for Return
										</h3>
										<ul className="space-y-2 text-sm text-[#6C757D]">
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Item in original, unopened packaging</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Returned within 30 days of delivery</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Includes all original accessories and documentation</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5 flex-shrink-0" />
												<span>Defective or damaged items (we'll cover return shipping)</span>
											</li>
										</ul>
									</div>

									<div className="bg-white rounded-lg p-5 border border-red-200">
										<h3 className="font-semibold text-[#212529] mb-3 flex items-center gap-2">
											<Package className="w-5 h-5 text-red-500" />
											Not Eligible for Return
										</h3>
										<ul className="space-y-2 text-sm text-[#6C757D]">
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
												<span>Opened limited edition or exclusive items</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
												<span>Custom-ordered models</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
												<span>Sale or clearance items (unless defective)</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
												<span>Items damaged due to misuse or negligence</span>
											</li>
										</ul>
									</div>
								</div>

								<div className="mt-6 p-5 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20">
									<h3 className="font-semibold text-[#212529] mb-2">How to Return</h3>
									<ol className="space-y-2 text-sm text-[#6C757D]">
										<li className="flex items-start gap-3">
											<span className="font-bold text-[#D4AF37] flex-shrink-0">1.</span>
											<span>Contact our customer service at info@veromodels.com with your order number</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="font-bold text-[#D4AF37] flex-shrink-0">2.</span>
											<span>Receive return authorization and shipping instructions</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="font-bold text-[#D4AF37] flex-shrink-0">3.</span>
											<span>Pack the item securely in original packaging</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="font-bold text-[#D4AF37] flex-shrink-0">4.</span>
											<span>Ship to provided address with tracking</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="font-bold text-[#D4AF37] flex-shrink-0">5.</span>
											<span>Refund processed within 5-7 business days of receipt</span>
										</li>
									</ol>
								</div>
							</div>
						</div>
					</div>

					{/* Contact CTA */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20 text-center bg-gradient-to-br from-[#D4AF37]/5 to-white">
						<h3 className="text-xl font-semibold text-[#212529] mb-3">
							Questions About Shipping or Returns?
						</h3>
						<p className="text-[#6C757D] mb-6">
							Our team is here to help with any questions about your order.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<a
								href="mailto:info@veromodels.com"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
							>
								Email Us
							</a>
							<a
								href="/contact"
								className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5E6D3] text-[#212529] font-semibold px-6 py-3 rounded-lg border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300"
							>
								Contact Form
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
