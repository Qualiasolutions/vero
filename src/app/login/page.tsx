import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/ui/login-form";

export default async function LoginPage() {
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
					<h1 className="text-4xl font-light text-white mb-4 tracking-wide">Welcome Back</h1>
					<p className="text-lg text-[#C9A961] mb-8 leading-relaxed">
						Access your collection of premium 1:18 scale die-cast models
					</p>
					<div className="grid grid-cols-3 gap-6 mt-12">
						<div className="text-center">
							<div className="text-3xl font-light text-[#C9A961] mb-2">500+</div>
							<div className="text-sm text-white/60 font-light">Premium Models</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-light text-[#C9A961] mb-2">10K+</div>
							<div className="text-sm text-white/60 font-light">Collectors</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-light text-[#C9A961] mb-2">98%</div>
							<div className="text-sm text-white/60 font-light">Satisfaction</div>
						</div>
					</div>
				</div>
				{/* Decorative pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-20 left-20 w-64 h-64 border border-[#B8941F] rounded-full" />
					<div className="absolute bottom-20 right-20 w-48 h-48 border border-[#B8941F] rounded-full" />
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
						<p className="text-sm text-[#6C757D] text-center font-light">Premium Diecast Car Models</p>
					</Link>

					<LoginForm />
				</div>
			</div>
		</div>
	);
}
