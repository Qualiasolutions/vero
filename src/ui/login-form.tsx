"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [_state, action] = useActionState(login, {});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border-[#D4AF37]/20">
				<CardHeader>
					<CardTitle className="text-2xl text-[#212529]">Welcome Back</CardTitle>
					<CardDescription className="text-[#6C757D]">Sign in to your Veromodels account</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email" className="text-[#212529]">
										Email
									</Label>
									<Input
										name="email"
										type="email"
										placeholder="your@email.com"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="password" className="text-[#212529]">
											Password
										</Label>
										<a href="#" className="text-xs text-[#D4AF37] hover:text-[#B8941F]">
											Forgot password?
										</a>
									</div>
									<Input
										name="password"
										type="password"
										required
										className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
									/>
								</div>
								<Button type="submit" className="w-full vero-button">
									Sign In
								</Button>
							</div>
						</div>
					</form>
					<div className="mt-6 text-center text-sm text-[#6C757D]">
						Don't have an account?{" "}
						<a href="/signup" className="text-[#D4AF37] hover:text-[#B8941F] font-medium">
							Create account
						</a>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-[#6C757D] [&_a]:text-[#D4AF37] [&_a]:hover:text-[#B8941F]">
				By signing in, you agree to our <a href="/terms">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
