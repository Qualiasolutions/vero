import Link, { type LinkProps } from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

const pages: Record<string, { content: string }> = {
	"/contact": {
		content: `
# Contact Us

Get in touch with Veromodels for any inquiries about our premium diecast car collection.

## Our Contact Information

**Email:** info@veromodels.com

**Phone:** +49 (0) 123 456789

**Location:** Germany

## Business Hours

Monday - Friday: 9:00 AM - 6:00 PM CET

Saturday: 10:00 AM - 4:00 PM CET

Sunday: Closed

## Send Us a Message

For custom requests, please use our [Order Your Diecast](/order-your-diecast) page.

For general inquiries, email us at info@veromodels.com`,
	},
	"/faq": {
		content: `
# Frequently Asked Questions

Find answers to common questions about Veromodels and our premium diecast car collection.

## Ordering & Purchasing

### How do I place an order?
Browse our collection, select your desired model, and proceed to checkout. We accept all major credit cards and secure payment methods through Stripe.

### Can you source a specific model for me?
Yes! Use our [Custom Request Service](/order-your-diecast) to submit a request for any specific model you're looking for.

### What payment methods do you accept?
We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment system.

## Shipping & Delivery

### Where do you ship?
We ship worldwide from Germany. Shipping costs and delivery times vary by location.

### How long does shipping take?
- Germany: 2-3 business days
- Europe: 5-7 business days
- International: 7-14 business days

### Do you offer express shipping?
Yes, express shipping options are available at checkout for faster delivery.

## Products & Quality

### Are these authentic diecast models?
Yes, all our models are authentic products from renowned manufacturers like AUTOart, BBR, Minichamps, and more.

### What scale are your models?
We primarily offer 1:18 scale models, with some 1:43 and 1:12 scale pieces in our collection.

### Do models come with original packaging?
Yes, all models include their original manufacturer packaging and certificates of authenticity when applicable.

## Returns & Refunds

### What is your return policy?
We accept returns within 14 days of delivery for unopened items in original condition. See our [Shipping & Returns](/shipping-returns) policy for details.

### How do I initiate a return?
Contact us at info@veromodels.com with your order number to start the return process.

## Custom Requests

### How does the custom request service work?
Submit a request through our [Order Your Diecast](/order-your-diecast) page. We'll search our global network and respond within 24-48 hours with availability and pricing.

### Is there a fee for custom requests?
There's no fee to submit a request. A 10% finder's fee applies only to successful orders.`,
	},
	"/privacy-policy": {
		content: `
# Privacy Policy

**Last Updated:** January 2025

Veromodels ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.

## Information We Collect

### Personal Information
- Name and contact details (email, phone, address)
- Payment information (processed securely through Stripe)
- Order history and preferences
- Custom request submissions

### Automatically Collected Information
- Browser type and IP address
- Pages visited and time spent on site
- Device information and location data

## How We Use Your Information

We use your personal information to:
- Process and fulfill your orders
- Respond to custom requests and inquiries
- Send order confirmations and shipping updates
- Improve our website and services
- Send marketing communications (with your consent)

## Data Protection

We implement appropriate security measures to protect your personal data, including:
- Secure SSL encryption for all transactions
- PCI-compliant payment processing through Stripe
- Regular security audits and updates
- Restricted access to personal information

## Your Rights

You have the right to:
- Access your personal data
- Request data correction or deletion
- Withdraw consent for marketing communications
- Lodge a complaint with supervisory authorities

## Cookies

We use cookies to enhance your browsing experience. You can control cookie preferences through your browser settings.

## Third-Party Services

We use trusted third-party services:
- **Stripe:** Payment processing
- **Shipping Carriers:** Order fulfillment
- **Analytics:** Website improvement

## Data Retention

We retain personal data only as long as necessary for business purposes or as required by law.

## Contact Us

For privacy-related questions, contact us at:
- Email: info@veromodels.com
- Phone: +49 (0) 123 456789

## Changes to This Policy

We may update this privacy policy periodically. Changes will be posted on this page with an updated revision date.`,
	},
	"/terms-of-service": {
		content: `
# Terms of Service

**Last Updated:** January 2025

Welcome to Veromodels. By accessing and using our website, you agree to these Terms of Service.

## 1. Acceptance of Terms

By using veromodels.com, you accept these terms in full. If you disagree with any part, please do not use our website.

## 2. Product Information

### Accuracy
We strive to provide accurate product descriptions and images. However, we do not warrant that descriptions, images, or content are error-free.

### Authenticity
All diecast models are authentic products from authorized manufacturers. We guarantee the authenticity of all items sold.

### Availability
Product availability is subject to change. We reserve the right to limit quantities or discontinue products.

## 3. Pricing and Payment

### Prices
All prices are in USD/EUR and subject to change without notice. The price at checkout is the final price.

### Payment Processing
Payments are processed securely through Stripe. We do not store your payment information.

### Taxes
Applicable taxes will be calculated at checkout based on your location.

## 4. Orders and Fulfillment

### Order Confirmation
You will receive an email confirmation once your order is placed. This does not constitute acceptance of your order.

### Order Acceptance
We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or fraudulent activity.

### Shipping
Shipping times and costs vary by location. See our [Shipping & Returns](/shipping-returns) policy for details.

## 5. Custom Request Service

### Request Submission
Custom requests are non-binding inquiries. We'll search for your requested model with no obligation to purchase.

### Finder's Fee
A 10% finder's fee applies to successful custom orders. This will be clearly communicated before purchase.

### No Guarantee
We cannot guarantee the availability of requested models.

## 6. Returns and Refunds

See our [Shipping & Returns](/shipping-returns) policy for complete details on returns, refunds, and exchanges.

## 7. Intellectual Property

All content on veromodels.com, including images, text, logos, and design, is owned by Veromodels or licensed to us. Unauthorized use is prohibited.

## 8. Limitation of Liability

Veromodels shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.

## 9. Governing Law

These terms are governed by the laws of Germany. Any disputes shall be resolved in German courts.

## 10. Changes to Terms

We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of modified terms.

## 11. Contact Information

For questions about these terms, contact us at:
- Email: info@veromodels.com
- Phone: +49 (0) 123 456789`,
	},
	"/shipping-returns": {
		content: `
# Shipping & Returns

Learn about our shipping methods, delivery times, and return policy.

## Shipping Information

### Shipping Regions

We ship worldwide from our facility in Germany.

### Shipping Costs

Shipping costs are calculated at checkout based on:
- Destination country
- Package weight and dimensions
- Selected shipping method

### Delivery Times

**Germany**
- Standard: 2-3 business days
- Express: 1-2 business days

**Europe**
- Standard: 5-7 business days
- Express: 3-4 business days

**International**
- Standard: 7-14 business days
- Express: 5-7 business days

### Tracking

All orders include tracking information. You'll receive a tracking number via email once your order ships.

### Shipping Partners

We work with trusted carriers including DHL, UPS, and FedEx to ensure safe delivery.

## Returns Policy

### Return Window

You may return items within **14 days** of delivery for a full refund.

### Return Conditions

Items must be:
- In original, unopened packaging
- In new, unused condition
- Include all original accessories and documentation
- Accompanied by proof of purchase

### Non-Returnable Items

The following cannot be returned:
- Opened or used items
- Custom-ordered models
- Limited edition pieces marked as final sale
- Damaged packaging due to customer handling

### Return Process

1. Contact us at info@veromodels.com with your order number
2. Receive return authorization and shipping instructions
3. Ship item back using provided instructions
4. Refund processed within 5-7 business days of receiving return

### Return Shipping

- Customers are responsible for return shipping costs
- We recommend insured shipping with tracking
- Veromodels is not responsible for items lost in return transit

## Exchanges

We do not offer direct exchanges. Please return the item for a refund and place a new order.

## Damaged or Defective Items

### Inspection Upon Delivery

Please inspect your package immediately upon delivery. Report any damage to the carrier and contact us within 48 hours.

### Manufacturing Defects

If you receive a defective item:
1. Contact us within 7 days at info@veromodels.com
2. Provide photos of the defect
3. We'll arrange a replacement or full refund

### Shipping Damage

For items damaged during shipping:
1. Document damage with photos
2. Contact us immediately
3. We'll file a claim with the carrier and send a replacement

## Refunds

### Processing Time

Refunds are processed within 5-7 business days of receiving the return.

### Refund Method

Refunds are issued to the original payment method.

### Partial Refunds

In some cases, partial refunds may be granted:
- Items not in original condition
- Items with missing parts not due to our error
- Items returned more than 14 days after delivery

## Contact Us

For shipping or return questions:
- **Email:** info@veromodels.com
- **Phone:** +49 (0) 123 456789

We're here to help ensure your complete satisfaction with every purchase.`,
	},
};

export default async function Page(props: { params: Promise<{ segments?: string[] }> }) {
	const params = await props.params;
	if (!params.segments) {
		return notFound();
	}

	const path = `/${params.segments.join("/")}`;
	const page = pages[path];

	if (!page) {
		return notFound();
	}

	return (
		<div className="prose pb-8 pt-4 lg:prose-lg xl:prose-xl">
			<MDXRemote
				source={page.content}
				components={{
					a: (props) => <Link {...(props as LinkProps)} />,
				}}
			/>
		</div>
	);
}
