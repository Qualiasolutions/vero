import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function CheckoutCancelPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<Card className="border-[#C4A962]/20">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<XCircle className="h-16 w-16 text-red-500" />
					</div>
					<CardTitle className="text-2xl font-light uppercase tracking-wide text-[#111827]">
						Payment Cancelled
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-6">
					<div className="space-y-2">
						<h3 className="text-lg font-medium text-[#111827]">Your payment was cancelled</h3>
						<p className="text-[#6B7280]">
							You were not charged for this order. Your cart has been saved and you can return to checkout
							whenever you're ready.
						</p>
					</div>

					<div className="bg-[#C4A962]/10 border border-[#C4A962]/30 rounded-lg p-4">
						<h4 className="font-medium text-[#111827] mb-2">Why was the payment cancelled?</h4>
						<p className="text-sm text-[#6B7280]">
							Payment cancellation can happen for various reasons - you may have clicked cancel, closed the
							browser window, or there was an issue with the payment process. Rest assured, no charges were
							made.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild className="vero-button">
							<Link href="/checkout">Return to Checkout</Link>
						</Button>
						<Button asChild variant="outline" className="vero-button-outline">
							<Link href="/cart">View Cart</Link>
						</Button>
					</div>

					<div className="text-xs text-[#6B7280]">
						<p>Need help? Contact our customer support for assistance.</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
