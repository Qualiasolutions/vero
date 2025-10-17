"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		// TODO: Implement signup logic
		setTimeout(() => setIsLoading(false), 2000);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-[#D4AF37]/20">
				<CardHeader>
					<CardTitle className="text-2xl text-[#212529]">Create Account</CardTitle>
					<CardDescription className="text-[#6C757D]">Join Veromodels to start collecting</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="name" className="text-[#212529]">Full Name</Label>
									<Input
										id="name"
										name="name"
										type="text"
										placeholder="John Doe"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email" className="text-[#212529]">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="your@email.com"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password" className="text-[#212529]">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="Minimum 8 characters"
										required
										minLength={8}
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="confirm-password" className="text-[#212529]">Confirm Password</Label>
									<Input
										id="confirm-password"
										name="confirmPassword"
										type="password"
										placeholder="Re-enter your password"
										required
										minLength={8}
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<Button type="submit" className="w-full vero-button" disabled={isLoading}>
									{isLoading ? "Creating Account..." : "Create Account"}
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
