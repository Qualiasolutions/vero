import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/ui/signup-form";

export default async function SignupPage() {
	// Redirect if already logged in
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/");
	}

	return (
		<div className="vero-split-screen">
			{/* Left Side - Branding */}
			<div className="vero-split-left hidden lg:flex">
				<div className="relative z-10 max-w-lg text-center">
					<Link href="/" className="inline-block mb-8">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={480}
							height={160}
							className="h-40 w-auto"
							priority
						/>
					</Link>
					<h1 className="text-4xl font-light text-white mb-4 tracking-wide">Join Our Collection</h1>
					<p className="text-lg text-[#E6C757] mb-8 leading-relaxed">
						Start your journey into the world of premium 1:18 scale die-cast models
					</p>

					{/* Benefits List */}
					<div className="text-left space-y-4 mt-12">
						<div className="flex items-start gap-4">
							<div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
								<svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<div className="text-white font-medium mb-1">Exclusive Access</div>
								<div className="text-sm text-white/70">Limited edition models and pre-orders</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
								<svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<div className="text-white font-medium mb-1">Secure Payments</div>
								<div className="text-sm text-white/70">Safe checkout with Stripe integration</div>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
								<svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<div className="text-white font-medium mb-1">Order Tracking</div>
								<div className="text-sm text-white/70">Track your collection and orders</div>
							</div>
						</div>
					</div>
				</div>
				{/* Decorative pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 right-20 w-64 h-64 border border-[#D4AF37] rounded-full" />
					<div className="absolute bottom-20 left-20 w-48 h-48 border border-[#D4AF37] rounded-full" />
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="vero-split-right">
				<div className="w-full max-w-md">
					{/* Mobile Logo */}
					<Link href="/" className="flex flex-col items-center gap-3 mb-8 lg:hidden">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={200}
							height={67}
							className="h-14 w-auto"
							priority
						/>
						<p className="text-sm text-[#6C757D] text-center">Premium Diecast Car Models</p>
					</Link>

					<SignupForm />
				</div>
			</div>
		</div>
	);
}
