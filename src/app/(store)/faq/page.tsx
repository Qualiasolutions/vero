"use client";

import { Clock, CreditCard, HelpCircle, Package, RotateCcw, Shield, Star, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/shadcn/accordion";

export default function FAQPage() {
	const faqCategories = [
		{
			icon: Package,
			title: "Products & Authenticity",
			questions: [
				{
					q: "Are all models officially licensed and authentic?",
					a: "Yes, absolutely! Every model in our collection is officially licensed from verified manufacturers. Each item comes with a certificate of authenticity to guarantee its legitimacy. We work directly with reputable brands to ensure you receive genuine 1:18 scale die-cast models.",
				},
				{
					q: "What scale are the models?",
					a: "All our models are premium 1:18 scale die-cast collectibles. This means each model is exactly 1/18th the size of the actual vehicle, providing exceptional detail and perfect proportions for display.",
				},
				{
					q: "Do models come in their original packaging?",
					a: "Yes, all models arrive in their original manufacturer packaging, which includes protective foam inserts and detailed product information. This ensures your collectible maintains its value and arrives in perfect condition.",
				},
				{
					q: "Can I request a specific model that's not listed?",
					a: "Absolutely! We offer a custom order service. Visit our 'Custom Request' page or contact us at info@veromodels.com with details about the model you're looking for. We'll do our best to source it for you.",
				},
			],
		},
		{
			icon: CreditCard,
			title: "Orders & Payment",
			questions: [
				{
					q: "What payment methods do you accept?",
					a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. All transactions are encrypted and your payment information is never stored on our servers.",
				},
				{
					q: "When will I be charged for my order?",
					a: "For in-stock items, your card is charged immediately upon order confirmation. For pre-order items, you'll be charged at the time you place your order, but the item will ship once it becomes available.",
				},
				{
					q: "Can I modify or cancel my order?",
					a: "You can modify or cancel your order within 2 hours of placing it by contacting us immediately at info@veromodels.com. Once an order enters processing, we cannot make changes. However, you can always return items according to our return policy.",
				},
				{
					q: "Do you offer gift wrapping?",
					a: "While we don't currently offer gift wrapping, all our models come in premium manufacturer packaging that's perfect for gifting. For special requests, please contact our customer service team.",
				},
			],
		},
		{
			icon: Truck,
			title: "Shipping & Delivery",
			questions: [
				{
					q: "How long does shipping take?",
					a: "Standard shipping takes 5-7 business days, while Express shipping delivers in 2-3 business days. International orders typically arrive within 7-21 business days depending on your location. All orders include tracking information.",
				},
				{
					q: "Do you offer free shipping?",
					a: "Yes! We offer free standard shipping on all orders over AED 550. For orders under this amount, standard shipping is AED 35.",
				},
				{
					q: "Do you ship internationally?",
					a: "Yes, we ship worldwide! International shipping costs and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the recipient.",
				},
				{
					q: "How are items packaged for shipping?",
					a: "Every model is double-boxed with protective foam padding to ensure safe delivery. Limited edition and rare items receive extra protective measures. We take pride in our packaging to ensure your collectible arrives in perfect condition.",
				},
				{
					q: "Can I track my order?",
					a: "Yes! Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's journey in real-time.",
				},
			],
		},
		{
			icon: RotateCcw,
			title: "Returns & Exchanges",
			questions: [
				{
					q: "What is your return policy?",
					a: "We offer a 30-day return policy for most items in original, unopened packaging. The item must include all original accessories and documentation. Defective items can be returned even if opened, and we'll cover return shipping costs.",
				},
				{
					q: "Can I return a limited edition item?",
					a: "Limited edition items can only be returned if they remain unopened and in original packaging. Once opened, limited editions are final sale unless defective.",
				},
				{
					q: "How long does it take to receive a refund?",
					a: "Once we receive your returned item and verify its condition, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method.",
				},
				{
					q: "What if my item arrives damaged?",
					a: "We're very sorry if this happens! Please contact us immediately at info@veromodels.com with photos of the damage. We'll arrange a replacement or full refund, and cover all return shipping costs.",
				},
			],
		},
		{
			icon: Star,
			title: "Pre-Orders & Limited Editions",
			questions: [
				{
					q: "How do pre-orders work?",
					a: "When you pre-order an item, you pay in full at the time of order. We'll email you with updates about the expected arrival date. As soon as the item arrives at our warehouse, we'll ship it to you with priority processing.",
				},
				{
					q: "Can I cancel a pre-order?",
					a: "Pre-orders can be cancelled for a full refund up until 48 hours before the item's expected arrival date at our warehouse. After that point, the order is final.",
				},
				{
					q: "How are limited edition items numbered?",
					a: "Limited edition items include a numbered certificate of authenticity. Numbers are assigned sequentially as orders are placed. We cannot guarantee specific numbers.",
				},
				{
					q: "Will limited edition items be restocked?",
					a: "By definition, limited edition items have a fixed production run and will not be restocked once sold out. We recommend securing these items quickly when they become available.",
				},
			],
		},
		{
			icon: Shield,
			title: "Account & Privacy",
			questions: [
				{
					q: "Do I need an account to place an order?",
					a: "No, you can check out as a guest. However, creating an account allows you to track orders, save favorites, and access exclusive offers for collectors.",
				},
				{
					q: "How is my personal information protected?",
					a: "We take data security seriously. All personal information is encrypted and stored securely. We never share your information with third parties. Payment processing is handled by Stripe, and we don't store your payment details. Read our Privacy Policy for full details.",
				},
				{
					q: "How can I update my account information?",
					a: "Log into your account and navigate to your profile settings where you can update your email, shipping address, and password at any time.",
				},
			],
		},
		{
			icon: HelpCircle,
			title: "General Questions",
			questions: [
				{
					q: "How can I contact customer service?",
					a: "You can reach us via email at info@veromodels.com or call +1 (234) 567-890. We typically respond within 24 hours during business days. You can also use our contact form for detailed inquiries.",
				},
				{
					q: "Do you have a physical store?",
					a: "We are currently an online-only retailer based in Cyprus, Nicosia. This allows us to offer competitive pricing and a wider selection of collectibles.",
				},
				{
					q: "Do you offer bulk or wholesale pricing?",
					a: "Yes! For bulk orders or wholesale inquiries, please contact us at info@veromodels.com with details about your requirements, and we'll provide a custom quote.",
				},
				{
					q: "How do I care for my die-cast models?",
					a: "Keep models in a cool, dry place away from direct sunlight. Display in a dust-free cabinet if possible. Clean gently with a soft, dry cloth. Never use chemicals or water on the models.",
				},
			],
		},
	];

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
							<HelpCircle className="w-4 h-4 text-[#D4AF37]" />
							<span className="text-sm font-medium text-[#E6C757]">We're Here to Help</span>
						</div>
						<h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">
							Frequently Asked <span className="vero-elegant-text">Questions</span>
						</h1>
						<p className="text-base lg:text-lg text-white/80 leading-relaxed">
							Find answers to common questions about our products, orders, and services
						</p>
					</div>
				</div>
			</section>

			{/* FAQ Content */}
			<section className="w-full px-6 lg:px-12 xl:px-16 py-16 bg-gradient-to-b from-white via-[#FDFBF7]/30 to-white">
				<div className="max-w-4xl mx-auto space-y-12">
					{faqCategories.map((category, categoryIndex) => {
						const IconComponent = category.icon;
						return (
							<div key={categoryIndex} className="vero-card rounded-xl p-8 border border-[#D4AF37]/20">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6C757]/10 rounded-lg flex items-center justify-center flex-shrink-0">
										<IconComponent className="w-6 h-6 text-[#D4AF37]" />
									</div>
									<h2 className="text-2xl font-semibold text-[#212529]">{category.title}</h2>
								</div>

								<Accordion type="single" collapsible className="space-y-4">
									{category.questions.map((faq, faqIndex) => (
										<AccordionItem
											key={faqIndex}
											value={`item-${categoryIndex}-${faqIndex}`}
											className="border border-[#D4AF37]/10 rounded-lg px-5 bg-gradient-to-br from-[#F5E6D3]/10 to-white"
										>
											<AccordionTrigger className="text-left hover:text-[#D4AF37] transition-colors py-4 text-[#212529] font-medium">
												{faq.q}
											</AccordionTrigger>
											<AccordionContent className="text-[#6C757D] leading-relaxed pb-4">
												{faq.a}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						);
					})}

					{/* Still Have Questions CTA */}
					<div className="vero-card rounded-xl p-8 border border-[#D4AF37]/20 text-center bg-gradient-to-br from-[#D4AF37]/5 to-white">
						<Clock className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
						<h3 className="text-2xl font-semibold text-[#212529] mb-3">Still Have Questions?</h3>
						<p className="text-[#6C757D] mb-6 max-w-2xl mx-auto">
							Our collector support team is ready to assist you with any questions about our products or
							services.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<a
								href="mailto:info@veromodels.com"
								className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C757] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
							>
								Email Support
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
