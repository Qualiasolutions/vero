"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(
	_state: unknown,
	formData: FormData,
): Promise<{ error?: string; success?: boolean } | undefined> {
	const supabase = await createClient();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	// Validation
	if (!name || !email || !password || !confirmPassword) {
		return { error: "All fields are required" };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match" };
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters" };
	}

	// Sign up with Supabase Auth
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				full_name: name,
			},
		},
	});

	if (error) {
		console.error("Signup error:", error);
		return { error: error.message };
	}

	if (!data.user) {
		return { error: "Failed to create account. Please try again." };
	}

	// Revalidate the cache
	revalidatePath("/", "layout");

	// Redirect to home page after successful signup
	redirect("/");
}

export async function login(_state: unknown, formData: FormData): Promise<{ error?: string } | undefined> {
	const supabase = await createClient();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.error("Login error:", error);
		return { error: "Invalid email or password" };
	}

	// Revalidate the cache
	revalidatePath("/", "layout");

	// Redirect to home page after successful login
	redirect("/");
}

export async function logout() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("Logout error:", error);
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
