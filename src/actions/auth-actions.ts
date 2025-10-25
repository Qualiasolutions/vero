"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

function validatePassword(password: string): string | null {
	if (password.length < 8) {
		return "Password must be at least 8 characters long";
	}
	if (!PASSWORD_REGEX.test(password)) {
		return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
	}
	return null;
}

function sanitizeInput(input: string): string {
	return input.trim();
}

export async function signup(
	_state: unknown,
	formData: FormData,
): Promise<{ error?: string; success?: boolean } | undefined> {
	const supabase = await createClient();

	// Extract and sanitize inputs
	const name = sanitizeInput(formData.get("name") as string);
	const email = sanitizeInput(formData.get("email") as string).toLowerCase();
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	// Validation
	if (!name || !email || !password || !confirmPassword) {
		return { error: "All fields are required" };
	}

	if (name.length < 2) {
		return { error: "Name must be at least 2 characters long" };
	}

	if (!validateEmail(email)) {
		return { error: "Please enter a valid email address" };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match" };
	}

	const passwordError = validatePassword(password);
	if (passwordError) {
		return { error: passwordError };
	}

	try {
		// Sign up with Supabase Auth
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: name,
				},
				emailRedirectTo: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/auth/callback`,
			},
		});

		if (error) {
			// Handle specific Supabase errors
			if (error.message.includes("already registered")) {
				return { error: "This email is already registered. Please sign in instead." };
			}
			if (error.message.includes("Invalid email")) {
				return { error: "Please enter a valid email address" };
			}
			// Generic error for production (don't expose internal details)
			return { error: "Unable to create account. Please try again later." };
		}

		if (!data.user) {
			return { error: "Failed to create account. Please try again." };
		}

		// Check if email confirmation is required
		if (data.user.identities && data.user.identities.length === 0) {
			return { error: "This email is already registered. Please sign in instead." };
		}

		// Revalidate the cache
		revalidatePath("/", "layout");

		// Redirect to home page after successful signup
		redirect("/");
	} catch (error) {
		// Catch unexpected errors
		logger.error("Unexpected signup error", error, { email });
		return { error: "An unexpected error occurred. Please try again." };
	}
}

export async function login(_state: unknown, formData: FormData): Promise<{ error?: string } | undefined> {
	const supabase = await createClient();

	// Extract and sanitize inputs
	const email = sanitizeInput(formData.get("email") as string).toLowerCase();
	const password = formData.get("password") as string;

	// Validation
	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	if (!validateEmail(email)) {
		return { error: "Please enter a valid email address" };
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			// Handle specific errors
			if (error.message.includes("Invalid login credentials")) {
				return { error: "Invalid email or password" };
			}
			if (error.message.includes("Email not confirmed")) {
				return { error: "Please verify your email address before signing in" };
			}
			if (error.message.includes("Email link is invalid or has expired")) {
				return { error: "Your session has expired. Please try again." };
			}
			// Generic error for production
			return { error: "Unable to sign in. Please try again later." };
		}

		if (!data.user) {
			return { error: "Authentication failed. Please try again." };
		}

		// Revalidate the cache
		revalidatePath("/", "layout");

		// Redirect to home page after successful login
		redirect("/");
	} catch (error) {
		// Catch unexpected errors
		logger.error("Unexpected login error", error, { email });
		return { error: "An unexpected error occurred. Please try again." };
	}
}

export async function logout() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		logger.error("Logout error", error);
		redirect("/");
	}

	// Revalidate the cache
	revalidatePath("/", "layout");
	redirect("/");
}

export async function getUser() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}
