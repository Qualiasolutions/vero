/**
 * Email service for Veromodels
 *
 * Handles sending transactional emails (order confirmations, shipping notifications, etc.)
 * Currently uses simple fetch-based implementation
 * TODO: Integrate with Resend, SendGrid, or similar email service
 */

import { logger } from "./logger";

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

interface OrderDetails {
	orderId: string;
	customerEmail: string;
	totalAmount: number;
	currency: string;
	items: Array<{
		productId: string;
		quantity: number;
		priceAtTime: number;
	}>;
}

/**
 * Send an email (stub implementation - integrate with actual email service)
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
	try {
		// Log email attempt
		logger.info("Sending email", {
			to: options.to,
			subject: options.subject,
		});

		// In development, just log the email
		if (process.env.NODE_ENV === "development") {
			logger.debug("Email content (dev mode)", {
				to: options.to,
				subject: options.subject,
				preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
			});
			return true;
		}

		// TODO: Implement actual email sending with Resend, SendGrid, or AWS SES
		// Example with Resend:
		// const resend = new Resend(process.env.RESEND_API_KEY);
		// await resend.emails.send({
		//   from: 'orders@veromodels.com',
		//   to: options.to,
		//   subject: options.subject,
		//   html: options.html,
		// });

		// For now, log a warning that emails are not actually sent
		logger.warn("Email not sent - email service not configured", {
			to: options.to,
			subject: options.subject,
		});

		return true;
	} catch (error) {
		logger.error("Failed to send email", error, {
			to: options.to,
			subject: options.subject,
		});
		return false;
	}
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderConfirmationHTML(order: OrderDetails): string {
	const itemsHTML = order.items
		.map(
			(item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        Product ID: ${item.productId}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${(item.priceAtTime / 100).toFixed(2)} ${order.currency}
      </td>
    </tr>
  `,
		)
		.join("");

	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Veromodels</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #C4A962 0%, #8B7355 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        <p style="color: #fff; margin: 10px 0 0 0;">Thank you for your purchase</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Hi there,
        </p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We've received your order and are preparing it for shipment. You'll receive another email once your items are on their way.
        </p>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #C4A962; font-size: 20px;">Order Details</h2>
          <p style="margin: 10px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
          
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #C4A962;">
                  Total:
                </td>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #C4A962;">
                  ${(order.totalAmount / 100).toFixed(2)} ${order.currency}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333; font-size: 18px;">What's Next?</h3>
          <ol style="padding-left: 20px; margin: 10px 0;">
            <li style="margin-bottom: 10px;">We'll process your order within 1-2 business days</li>
            <li style="margin-bottom: 10px;">You'll receive a shipping confirmation email with tracking information</li>
            <li style="margin-bottom: 10px;">Your premium die-cast models will arrive at your doorstep</li>
          </ol>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          Questions? Contact us at <a href="mailto:info@veromodels.com" style="color: #C4A962;">info@veromodels.com</a>
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            Veromodels - Premium 1:18 Scale Die-Cast Model Cars<br>
            Dubai, UAE
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of order confirmation
 */
function generateOrderConfirmationText(order: OrderDetails): string {
	const itemsText = order.items
		.map(
			(item) =>
				`- Product ID: ${item.productId} | Qty: ${item.quantity} | Price: ${(item.priceAtTime / 100).toFixed(2)} ${order.currency}`,
		)
		.join("\n");

	return `
ORDER CONFIRMATION - VEROMODELS

Thank you for your purchase!

We've received your order and are preparing it for shipment. You'll receive another email once your items are on their way.

ORDER DETAILS
Order ID: ${order.orderId}

ITEMS:
${itemsText}

TOTAL: ${(order.totalAmount / 100).toFixed(2)} ${order.currency}

WHAT'S NEXT?
1. We'll process your order within 1-2 business days
2. You'll receive a shipping confirmation email with tracking information
3. Your premium die-cast models will arrive at your doorstep

Questions? Contact us at info@veromodels.com

---
Veromodels - Premium 1:18 Scale Die-Cast Model Cars
Dubai, UAE
  `.trim();
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(order: OrderDetails): Promise<boolean> {
	const html = generateOrderConfirmationHTML(order);
	const text = generateOrderConfirmationText(order);

	return sendEmail({
		to: order.customerEmail,
		subject: `Order Confirmation #${order.orderId} - Veromodels`,
		html,
		text,
	});
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
	customerEmail: string,
	orderId: string,
	trackingNumber: string,
	carrier: string,
): Promise<boolean> {
	const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #C4A962;">Your Order Has Shipped! 📦</h1>
      <p>Great news! Your order #${orderId} is on its way.</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Carrier:</strong> ${carrier}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      </div>
      <p>You can track your shipment using the tracking number above.</p>
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Questions? Contact us at info@veromodels.com
      </p>
    </body>
    </html>
  `;

	const text = `
Your Order Has Shipped!

Great news! Your order #${orderId} is on its way.

Carrier: ${carrier}
Tracking Number: ${trackingNumber}

You can track your shipment using the tracking number above.

Questions? Contact us at info@veromodels.com
  `.trim();

	return sendEmail({
		to: customerEmail,
		subject: `Your Order #${orderId} Has Shipped - Veromodels`,
		html,
		text,
	});
}
