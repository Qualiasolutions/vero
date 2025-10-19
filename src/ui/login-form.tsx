"use client";
import { useActionState } from "react";
import { login } from "@/actions/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [state, action, isPending] = useActionState(login, {});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="vero-glass-card">
				<div className="mb-8">
					<h2 className="text-3xl font-light text-[#212529] mb-2 tracking-wide">Sign In</h2>
					<p className="text-[#6C757D]">Access your premium collection</p>
				</div>

				<form action={action}>
					<div className="grid gap-6">
						{state?.error && (
							<Alert variant="destructive" className="border-red-500/50 bg-red-50/80 backdrop-blur-sm">
								<AlertDescription>{state.error}</AlertDescription>
							</Alert>
						)}

						<div className="grid gap-5">
							<div className="grid gap-2">
								<Label htmlFor="email" className="text-[#212529] font-medium text-sm">
									Email Address
								</Label>
								<Input
									name="email"
									type="email"
									placeholder="your@email.com"
									required
									className="vero-input h-12"
									disabled={isPending}
								/>
							</div>

							<div className="grid gap-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password" className="text-[#212529] font-medium text-sm">
										Password
									</Label>
									<a href="#" className="text-xs text-[#D4AF37] hover:text-[#B8941F] transition-colors">
										Forgot password?
									</a>
								</div>
								<Input
									name="password"
									type="password"
									placeholder="Enter your password"
									required
									className="vero-input h-12"
									disabled={isPending}
								/>
							</div>

							<Button
								type="submit"
								className="w-full vero-button h-12 text-sm font-semibold tracking-wide mt-2"
								disabled={isPending}
							>
								{isPending ? "Signing In..." : "Sign In"}
							</Button>
						</div>

						{/* Divider */}
						<div className="relative my-2">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-[#D4AF37]/20" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-3 text-[#6C757D]">New to Veromodels?</span>
							</div>
						</div>

						{/* Sign Up Link */}
						<div className="text-center">
							<a
								href="/signup"
								className="inline-flex items-center justify-center w-full h-12 px-6 text-sm font-semibold text-[#D4AF37] border-2 border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] transition-all duration-300"
							>
								Create Account
							</a>
						</div>
					</div>
				</form>
			</div>

			<div className="text-balance text-center text-xs text-[#6C757D] [&_a]:text-[#D4AF37] [&_a]:hover:text-[#B8941F] [&_a]:transition-colors">
				By signing in, you agree to our <a href="/terms">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
