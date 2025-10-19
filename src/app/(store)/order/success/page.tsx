import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCheckoutSession } from "@/actions/checkout-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrderSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string }>;
}) {
	const params = await searchParams;

	if (!params.session_id) {
		redirect("/");
	}

	const session = await getCheckoutSession(params.session_id);

	if (!session || !session.success) {
		redirect("/");
	}

	return (
		<div className="container mx-auto px-4 py-16 max-w-2xl">
			<Card className="border-[#D4AF37]/20 shadow-xl">
				<CardHeader className="text-center pb-8">
					<div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
						<CheckCircle className="w-12 h-12 text-green-600" />
					</div>
					<CardTitle className="text-3xl font-light uppercase tracking-wider text-[#212529]">
						Order Confirmed!
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="text-center">
						<p className="text-lg text-[#6C757D] mb-4">
							Thank you for your purchase! We've sent a confirmation email to:
						</p>
						<p className="font-medium text-[#212529]">{session.customerEmail}</p>
					</div>

					<div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-6">
						<div className="grid gap-4">
							<div className="flex justify-between items-center">
								<span className="text-[#6C757D]">Order Total:</span>
								<span className="font-semibold text-xl text-[#D4AF37]">
									{session.currency?.toUpperCase()} {((session.amount || 0) / 100).toFixed(2)}
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="font-medium text-[#212529] flex items-center gap-2">
							<Package className="w-5 h-5" />
							What's Next?
						</h3>
						<ul className="space-y-2 text-sm text-[#6C757D]">
							<li className="flex items-start gap-2">
								<span className="text-[#D4AF37] mt-0.5">✓</span>
								<span>You'll receive an order confirmation email shortly</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-[#D4AF37] mt-0.5">✓</span>
								<span>We'll notify you when your order ships</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-[#D4AF37] mt-0.5">✓</span>
								<span>Track your order status in your account</span>
							</li>
						</ul>
					</div>

					<div className="flex gap-4 pt-4">
						<Button asChild className="flex-1">
							<Link href="/orders">View Orders</Link>
						</Button>
						<Button asChild variant="outline" className="flex-1">
							<Link href="/products">Continue Shopping</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
