import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
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
						<div className="w-16 h-16 rounded-full bg-[#8B4513]/10 flex items-center justify-center mx-auto mb-4 border border-[#8B4513]/30">
							<svg className="w-8 h-8 text-[#A0522D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<h1 className="text-2xl font-light text-white mb-2 tracking-wide">Authentication Error</h1>
						<p className="text-[#C9A961] mb-6 font-light">The verification link is invalid or has expired.</p>
					</div>

					<div className="space-y-4 text-sm text-white/60 mb-8 font-light">
						<p>This can happen if:</p>
						<ul className="list-disc list-inside text-left space-y-2">
							<li>The link has already been used</li>
							<li>The link has expired (valid for 24 hours)</li>
							<li>The link was copied incorrectly</li>
						</ul>
					</div>

					<div className="space-y-3">
						<Button asChild className="w-full vero-button h-12">
							<Link href="/signup">Try Signing Up Again</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="w-full h-12 border-[#A89050]/30 hover:border-[#C9A961]"
						>
							<Link href="/login">Back to Login</Link>
						</Button>
					</div>
				</div>

				<p className="text-center text-sm text-white/50 mt-6 font-light">
					Need help?{" "}
					<a href="mailto:support@veromodels.com" className="text-[#C9A961] hover:text-[#C4A962]">
						Contact Support
					</a>
				</p>
			</div>
		</div>
	);
}
