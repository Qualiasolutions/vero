import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/ui/signup-form";

export default function SignupPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#FDFBF7] to-white p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link href="/" className="flex flex-col items-center gap-4 self-center">
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
	);
}
