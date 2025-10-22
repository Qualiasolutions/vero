import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConfirmEmailPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] px-4">
			<div className="max-w-md w-full">
				<div className="vero-glass-dark rounded-xl p-8 text-center">
					<Link href="/" className="inline-block mb-8">
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={200}
							height={67}
							className="h-16 w-auto mx-auto brightness-0 invert"
							priority
						/>
					</Link>

					<div className="mb-6">
						<div className="w-16 h-16 rounded-full bg-[#B8941F]/10 flex items-center justify-center mx-auto mb-4 border border-[#B8941F]/30">
							<svg className="w-8 h-8 text-[#C9A961]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-light text-white mb-2 tracking-wide">Check Your Email</h1>
						<p className="text-[#C9A961] mb-6 font-light">We've sent you a verification link</p>
					</div>

					<div className="space-y-4 text-sm text-white/60 mb-8 text-left font-light">
						<p>To complete your registration:</p>
						<ol className="list-decimal list-inside space-y-2">
							<li>Check your email inbox (and spam folder)</li>
							<li>Click the verification link we sent you</li>
							<li>You'll be redirected back to Veromodels</li>
						</ol>
						<p className="text-xs text-white/50 pt-4 font-light">
							The verification link is valid for 24 hours.
						</p>
					</div>

					<div className="space-y-3">
						<Button asChild className="w-full vero-button h-12">
							<Link href="/">Return to Home</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="w-full h-12 border-[#B8941F]/30 hover:border-[#C9A961]"
						>
							<Link href="/login">Go to Login</Link>
						</Button>
					</div>
				</div>

				<p className="text-center text-sm text-white/50 mt-6 font-light">
					Didn't receive the email?{" "}
					<a href="mailto:support@veromodels.com" className="text-[#C9A961] hover:text-[#D4AF37]">
						Contact Support
					</a>
				</p>
			</div>
		</div>
	);
}
