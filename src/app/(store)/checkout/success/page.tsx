import { redirect } from "next/navigation";
import { completeCheckout } from "@/actions/checkout-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/checkout");
  }

  try {
    // Complete the checkout process
    await completeCheckout(sessionId);
  } catch (error) {
    console.error("Error completing checkout:", error);
    // Don't redirect - show success anyway since payment was completed
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-[#D4AF37]/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-light uppercase tracking-wide text-[#212529]">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-[#212529]">Thank you for your purchase</h3>
            <p className="text-[#6C757D]">
              Your order has been successfully placed and will be processed shortly.
              You will receive a confirmation email with your order details.
            </p>
          </div>

          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
            <h4 className="font-medium text-[#212529] mb-2">What happens next?</h4>
            <ul className="text-sm text-[#6C757D] space-y-1 text-left">
              <li>• Order confirmation email will be sent shortly</li>
              <li>• Your payment will be processed securely</li>
              <li>• We'll prepare your items for shipping</li>
              <li>• You'll receive tracking information once shipped</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="vero-button">
              <Link href="/orders">View My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="vero-button-outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>

          <div className="text-xs text-[#6C757D]">
            <p>Order ID: {sessionId}</p>
            <p>If you have any questions, please contact our customer support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}