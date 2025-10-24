"use client";
import { useActionState } from "react";
import { signup } from "@/actions/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [state, action, isPending] = useActionState(signup, {});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="vero-glass-card">
				<div className="mb-8">
					<h2 className="text-3xl font-light text-[#111827] mb-2 tracking-wide">Create Account</h2>
					<p className="text-[#6B7280]">Join the Veromodels collector community</p>
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
								<Label htmlFor="name" className="text-[#111827] font-medium text-sm">
									Full Name
								</Label>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
									className="vero-input h-12"
									disabled={isPending}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="email" className="text-[#111827] font-medium text-sm">
									Email Address
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="your@email.com"
									required
									className="vero-input h-12"
									disabled={isPending}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password" className="text-[#111827] font-medium text-sm">
									Password
								</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Minimum 8 characters"
									required
									minLength={8}
									className="vero-input h-12"
									disabled={isPending}
								/>
								<p className="text-xs text-[#6B7280]">Must be at least 8 characters long</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="confirm-password" className="text-[#111827] font-medium text-sm">
									Confirm Password
								</Label>
								<Input
									id="confirm-password"
									name="confirmPassword"
									type="password"
									placeholder="Re-enter your password"
									required
									minLength={8}
									className="vero-input h-12"
									disabled={isPending}
								/>
							</div>

							<Button
								type="submit"
								className="w-full vero-button h-12 text-sm font-semibold tracking-wide mt-2"
								disabled={isPending}
							>
								{isPending ? "Creating Account..." : "Create Account"}
							</Button>
						</div>

						{/* Divider */}
						<div className="relative my-2">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-[#C4A962]/20" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-3 text-[#6B7280]">Already a member?</span>
							</div>
						</div>

						{/* Sign In Link */}
						<div className="text-center">
							<a
								href="/login"
								className="inline-flex items-center justify-center w-full h-12 px-6 text-sm font-semibold text-[#C4A962] border-2 border-[#C4A962]/30 rounded-lg hover:bg-[#C4A962]/5 hover:border-[#C4A962] transition-all duration-300"
							>
								Sign In
							</a>
						</div>
					</div>
				</form>
			</div>

			<div className="text-balance text-center text-xs text-[#6B7280] [&_a]:text-[#C4A962] [&_a]:hover:text-[#A89050] [&_a]:transition-colors">
				By creating an account, you agree to our <a href="/terms">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
