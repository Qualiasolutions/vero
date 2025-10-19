import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import StoreConfig from "@/store.config";

export const metadata = {
	title: "Contact Us - Get in Touch",
	description: "Have questions? Contact Veromodels for inquiries about our premium die-cast model cars.",
};

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A]">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-20 w-64 h-64 border border-[#D4AF37] rounded-full animate-float" />
					<div className="absolute bottom-10 right-20 w-48 h-48 border border-[#E6C757] rounded-full animate-float delay-1000" />
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					<h1 className="text-5xl md:text-6xl font-light mb-4 text-white">
						Get in <span className="vero-elegant-text">Touch</span>
					</h1>
					<p className="text-xl text-white/70 max-w-2xl mx-auto">
						We're here to help with your collection. Reach out with any questions or inquiries.
					</p>
				</div>
			</section>

			{/* Contact Information Cards */}
			<section className="max-w-7xl mx-auto px-6 py-16 -mt-16 relative z-10">
				<div className="grid md:grid-cols-3 gap-6">
					{/* Email Card */}
					<div className="group bg-white rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
						<div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<Mail className="w-8 h-8 text-[#D4AF37]" />
						</div>
						<h3 className="text-xl font-semibold text-[#212529] mb-3 text-center">Email Us</h3>
						<p className="text-[#6C757D] mb-4 text-center">Send us a message anytime</p>
						<Link
							href={`mailto:${StoreConfig.contact.email}`}
							className="block text-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors"
						>
							{StoreConfig.contact.email}
						</Link>
					</div>

					{/* Phone Card */}
					<div className="group bg-white rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
						<div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<Phone className="w-8 h-8 text-[#D4AF37]" />
						</div>
						<h3 className="text-xl font-semibold text-[#212529] mb-3 text-center">Call Us</h3>
						<p className="text-[#6C757D] mb-4 text-center">Mon-Fri 9AM-6PM CET</p>
						<Link
							href={`tel:${StoreConfig.contact.phone}`}
							className="block text-center text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors"
						>
							{StoreConfig.contact.phone}
						</Link>
					</div>

					{/* Address Card */}
					<div className="group bg-white rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2">
						<div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
							<MapPin className="w-8 h-8 text-[#D4AF37]" />
						</div>
						<h3 className="text-xl font-semibold text-[#212529] mb-3 text-center">Visit Us</h3>
						<p className="text-[#6C757D] mb-4 text-center">Our headquarters</p>
						<p className="text-center text-[#D4AF37] font-medium">{StoreConfig.contact.address}</p>
					</div>
				</div>
			</section>

			{/* Main Contact Section */}
			<section className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid lg:grid-cols-2 gap-16 items-start">
					{/* Contact Form */}
					<div>
						<h2 className="text-3xl md:text-4xl font-light text-[#212529] mb-4">
							Send Us a <span className="vero-elegant-text">Message</span>
						</h2>
						<p className="text-[#6C757D] text-lg mb-8">
							Have a question about a specific model? Looking for a rare piece? We're here to help.
						</p>

						<form className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-[#212529] mb-2">
										Full Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										required
										className="vero-input w-full h-12"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-[#212529] mb-2">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										className="vero-input w-full h-12"
										placeholder="your@email.com"
									/>
								</div>
							</div>

							<div>
								<label htmlFor="subject" className="block text-sm font-medium text-[#212529] mb-2">
									Subject
								</label>
								<input
									type="text"
									id="subject"
									name="subject"
									required
									className="vero-input w-full h-12"
									placeholder="How can we help?"
								/>
							</div>

							<div>
								<label htmlFor="message" className="block text-sm font-medium text-[#212529] mb-2">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									required
									rows={6}
									className="vero-input w-full resize-none"
									placeholder="Tell us more about your inquiry..."
								/>
							</div>

							<button
								type="submit"
								className="w-full md:w-auto vero-button px-8 py-3 h-12 font-semibold tracking-wide"
							>
								Send Message
							</button>
						</form>
					</div>

					{/* FAQ Section */}
					<div>
						<h2 className="text-3xl md:text-4xl font-light text-[#212529] mb-4">
							Frequently Asked <span className="vero-elegant-text">Questions</span>
						</h2>
						<p className="text-[#6C757D] text-lg mb-8">
							Quick answers to common questions about our products and services.
						</p>

						<div className="space-y-6">
							<div className="vero-glass-card p-6">
								<h3 className="text-lg font-semibold text-[#212529] mb-2 flex items-start gap-3">
									<MessageSquare className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
									<span>Do you ship internationally?</span>
								</h3>
								<p className="text-[#6C757D] ml-8">
									Yes! We ship worldwide with tracked and insured delivery to ensure your models arrive
									safely.
								</p>
							</div>

							<div className="vero-glass-card p-6">
								<h3 className="text-lg font-semibold text-[#212529] mb-2 flex items-start gap-3">
									<MessageSquare className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
									<span>Are all models authentic?</span>
								</h3>
								<p className="text-[#6C757D] ml-8">
									Absolutely. Every model is officially licensed and comes from authorized manufacturers with
									certificates of authenticity.
								</p>
							</div>

							<div className="vero-glass-card p-6">
								<h3 className="text-lg font-semibold text-[#212529] mb-2 flex items-start gap-3">
									<MessageSquare className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
									<span>Can you source specific models?</span>
								</h3>
								<p className="text-[#6C757D] ml-8">
									Yes! If you're looking for a specific model not in our current inventory, contact us and
									we'll do our best to source it for you.
								</p>
							</div>

							<div className="vero-glass-card p-6">
								<h3 className="text-lg font-semibold text-[#212529] mb-2 flex items-start gap-3">
									<MessageSquare className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
									<span>What is your return policy?</span>
								</h3>
								<p className="text-[#6C757D] ml-8">
									We offer a 30-day return policy on all unopened items in original condition. See our{" "}
									<Link href="/terms" className="text-[#D4AF37] hover:text-[#B8941F]">
										terms & conditions
									</Link>{" "}
									for details.
								</p>
							</div>
						</div>

						<div className="mt-8 p-6 bg-gradient-to-r from-[#D4AF37]/10 to-[#E6C757]/10 rounded-2xl border border-[#D4AF37]/20">
							<h3 className="text-lg font-semibold text-[#212529] mb-2">Still have questions?</h3>
							<p className="text-[#6C757D] mb-4">
								Our team is ready to help you find the perfect addition to your collection.
							</p>
							<Link
								href={`mailto:${StoreConfig.contact.email}`}
								className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors"
							>
								<Mail className="w-4 h-4" />
								Email us directly
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Business Hours */}
			<section className="border-t border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] to-white py-16">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<h2 className="text-3xl font-light text-[#212529] mb-8">
						Business <span className="vero-elegant-text">Hours</span>
					</h2>
					<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
						<div className="vero-glass-card p-6">
							<h3 className="font-semibold text-[#212529] mb-3">Customer Support</h3>
							<p className="text-[#6C757D]">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
							<p className="text-[#6C757D]">Saturday: 10:00 AM - 4:00 PM CET</p>
							<p className="text-[#6C757D]">Sunday: Closed</p>
						</div>
						<div className="vero-glass-card p-6">
							<h3 className="font-semibold text-[#212529] mb-3">Order Processing</h3>
							<p className="text-[#6C757D]">Orders placed before 2:00 PM CET</p>
							<p className="text-[#6C757D]">ship same business day</p>
							<p className="text-[#D4AF37] font-medium mt-2">Free shipping on orders AED 150+</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
