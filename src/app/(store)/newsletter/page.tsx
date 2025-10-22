import { Bell, Gift, Mail, Newspaper, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "@/ui/yns-link";

export const metadata = {
	title: "Newsletter - Veromodels",
	description:
		"Subscribe to the Veromodels newsletter for exclusive updates, new releases, and collector tips.",
};

export default function NewsletterPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section with Background Image */}
			<section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0">
					<Image
						src="https://i.ibb.co/d4pc3pfB/Generated-Image-October-09-2025-3-08-PM.png"
						alt="Veromodels Newsletter"
						fill
						className="object-cover"
						sizes="100vw"
						priority
					/>
					{/* Overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					<div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-6 py-2 backdrop-blur-sm mb-8">
						<Mail className="w-4 h-4 text-[#D4AF37]" />
						<span className="text-sm font-medium text-[#E6C757]">Stay Connected</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-light mb-6 text-white tracking-tight">
						<span className="vero-elegant-text">Newsletter</span>
					</h1>
					<p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
						Exclusive updates, new releases, and collector insights delivered to your inbox
					</p>
				</div>
			</section>

			{/* Newsletter Sign-up Section */}
			<section className="max-w-4xl mx-auto px-6 py-20">
				<div className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-light text-[#212529] mb-6">
						Join Our <span className="vero-elegant-text">Community</span>
					</h2>
					<p className="text-xl text-[#6C757D] leading-relaxed max-w-3xl mx-auto">
						Be the first to know about new arrivals, exclusive offers, and collector events
					</p>
				</div>

				<div className="relative rounded-2xl overflow-hidden p-12 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] border border-[#D4AF37]/20">
					{/* Decorative Elements */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute top-10 right-10 w-48 h-48 border border-[#D4AF37] rounded-full" />
						<div className="absolute bottom-10 left-10 w-32 h-32 border border-[#E6C757] rounded-full" />
					</div>

					<div className="relative z-10 text-center">
						<Mail className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
						<h3 className="text-2xl md:text-3xl font-light text-white mb-4">Subscribe to Our Newsletter</h3>
						<p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
							Get exclusive access to limited editions, pre-order opportunities, and collector tips
						</p>

						{/* Newsletter Form */}
						<div className="max-w-md mx-auto mb-6">
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									placeholder="Enter your email address"
									className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] focus:bg-white/20 transition-all"
								/>
								<button className="vero-button px-6 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">
									Subscribe
								</button>
							</div>
							<p className="text-xs text-white/50 mt-3">
								By subscribing, you agree to receive marketing emails from Veromodels. You can unsubscribe at
								any time.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="border-y border-[#D4AF37]/20 bg-gradient-to-b from-[#FDFBF7] via-white to-[#FDFBF7] py-20">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-4xl md:text-5xl font-light text-center text-[#212529] mb-16">
						What You'll <span className="vero-elegant-text">Receive</span>
					</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								icon: Star,
								title: "New Arrivals",
								description:
									"Be the first to know when we add new models to our collection, including limited editions and rare finds.",
							},
							{
								icon: Gift,
								title: "Exclusive Offers",
								description:
									"Get special discounts and early access to sales, available only to our newsletter subscribers.",
							},
							{
								icon: Bell,
								title: "Pre-Order Alerts",
								description:
									"Never miss out on pre-order opportunities for upcoming releases from premium manufacturers.",
							},
							{
								icon: Sparkles,
								title: "Collector Insights",
								description:
									"Expert tips on model care, display techniques, and the latest trends in die-cast collecting.",
							},
							{
								icon: Newspaper,
								title: "Industry News",
								description:
									"Stay updated with the latest happenings in the die-cast model world and automotive history.",
							},
							{
								icon: Mail,
								title: "Personalized Content",
								description: "Receive recommendations based on your interests and collecting preferences.",
							},
						].map((benefit, index) => (
							<div
								key={index}
								className="group text-center p-8 bg-white rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 hover:-translate-y-2"
							>
								<div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
									<benefit.icon className="w-8 h-8 text-[#D4AF37]" />
								</div>
								<h3 className="text-lg font-bold text-[#D4AF37] mb-4 uppercase tracking-wider">
									{benefit.title}
								</h3>
								<p className="text-[#6C757D] leading-relaxed">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<h2 className="text-4xl md:text-5xl font-light text-center text-[#212529] mb-16">
					What Our <span className="vero-elegant-text">Subscribers Say</span>
				</h2>

				<div className="grid md:grid-cols-3 gap-8">
					{[
						{
							name: "Michael R.",
							location: "Dubai, UAE",
							content:
								"Thanks to the newsletter, I never miss out on limited editions. The pre-order alerts are invaluable!",
							rating: 5,
						},
						{
							name: "Sarah K.",
							location: "London, UK",
							content:
								"The collector insights have helped me take better care of my collection. Excellent content every time.",
							rating: 5,
						},
						{
							name: "Ahmed H.",
							location: "Abu Dhabi, UAE",
							content:
								"The exclusive offers alone make it worth subscribing. I've saved so much on my recent purchases.",
							rating: 5,
						},
					].map((testimonial, index) => (
						<div key={index} className="vero-card p-6 text-center">
							<div className="flex justify-center mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="w-5 h-5 text-[#D4AF37] fill-current" />
								))}
							</div>
							<p className="text-[#6C757D] mb-6 italic">"{testimonial.content}"</p>
							<div>
								<p className="font-semibold text-[#212529]">{testimonial.name}</p>
								<p className="text-sm text-[#6C757D]">{testimonial.location}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* FAQ Section */}
			<section className="border-y border-[#D4AF37]/20 bg-gradient-to-b from-white to-[#FDFBF7] py-20">
				<div className="max-w-4xl mx-auto px-6">
					<h2 className="text-4xl md:text-5xl font-light text-center text-[#212529] mb-16">
						Frequently Asked <span className="vero-elegant-text">Questions</span>
					</h2>

					<div className="space-y-6">
						{[
							{
								question: "How often will I receive emails?",
								answer:
									"We send our newsletter 2-3 times per month with new arrivals, special offers, and collector content. We never spam your inbox.",
							},
							{
								question: "Can I unsubscribe anytime?",
								answer:
									"Yes, absolutely! Every email includes an unsubscribe link, and you can opt out at any time with no questions asked.",
							},
							{
								question: "Will my information be shared?",
								answer:
									"No, we never share your email address with third parties. Your privacy is important to us.",
							},
							{
								question: "Do newsletter subscribers get special benefits?",
								answer:
									"Yes! Subscribers get early access to pre-orders, exclusive discounts, and content not available to the general public.",
							},
						].map((faq, index) => (
							<div key={index} className="vero-card p-6 border border-[#D4AF37]/20">
								<h3 className="text-lg font-semibold text-[#212529] mb-3 flex items-center gap-2">
									<Mail className="w-5 h-5 text-[#D4AF37]" />
									{faq.question}
								</h3>
								<p className="text-[#6C757D] leading-relaxed">{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-5xl mx-auto px-6 py-20 text-center">
				<div className="relative rounded-2xl overflow-hidden p-12 md:p-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A]">
					{/* Decorative Elements */}
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-10 right-10 w-48 h-48 border border-[#D4AF37] rounded-full" />
						<div className="absolute bottom-10 left-10 w-32 h-32 border border-[#E6C757] rounded-full" />
					</div>

					<div className="relative z-10">
						<Newspaper className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
						<h2 className="text-3xl md:text-4xl font-light text-white mb-4">
							Ready to <span className="vero-elegant-text">Subscribe?</span>
						</h2>
						<p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
							Join thousands of collectors who never miss out on the latest models and exclusive offers.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<YnsLink
								href="#newsletter-signup"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
							>
								Subscribe Now
							</YnsLink>
							<YnsLink
								href="/products"
								className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm"
							>
								Browse Collection
							</YnsLink>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
