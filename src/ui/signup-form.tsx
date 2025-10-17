"use client";
import { useActionState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [state, action, isPending] = useActionState(signup, {});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-[#D4AF37]/20">
				<CardHeader>
					<CardTitle className="text-2xl text-[#212529]">Create Account</CardTitle>
					<CardDescription className="text-[#6C757D]">Join Veromodels to start collecting</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className="grid gap-6">
							{state?.error && (
								<Alert variant="destructive" className="border-red-500/50 bg-red-50">
									<AlertDescription>{state.error}</AlertDescription>
								</Alert>
							)}
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="name" className="text-[#212529]">
										Full Name
									</Label>
									<Input
										id="name"
										name="name"
										type="text"
										placeholder="John Doe"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
										disabled={isPending}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email" className="text-[#212529]">
										Email
									</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="your@email.com"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
										disabled={isPending}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password" className="text-[#212529]">
										Password
									</Label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="Minimum 8 characters"
										required
										minLength={8}
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
										disabled={isPending}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="confirm-password" className="text-[#212529]">
										Confirm Password
									</Label>
									<Input
										id="confirm-password"
										name="confirmPassword"
										type="password"
										placeholder="Re-enter your password"
										required
										minLength={8}
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
										disabled={isPending}
									/>
								</div>
								<Button type="submit" className="w-full vero-button" disabled={isPending}>
									{isPending ? "Creating Account..." : "Create Account"}
								</Button>
							</div>
						</div>
					</form>
					<div className="mt-6 text-center text-sm text-[#6C757D]">
						Already have an account?{" "}
						<a href="/login" className="text-[#D4AF37] hover:text-[#B8941F] font-medium">
							Sign in
						</a>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-[#6C757D] [&_a]:text-[#D4AF37] [&_a]:hover:text-[#B8941F]">
				By creating an account, you agree to our <a href="/terms">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
