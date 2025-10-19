"use server";

import * as bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Session configuration
export interface SessionData {
	userId?: string;
	email?: string;
	role?: "USER" | "ADMIN";
	isLoggedIn: boolean;
}

const sessionOptions = {
	password: process.env.IRON_SESSION_PASSWORD || "complex-password-at-least-32-characters-long",
	cookieName: "veromodels-session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax" as const,
		maxAge: 60 * 60 * 24 * 30, // 30 days
	},
};

// Get session helper
export async function getSession() {
	const cookieStore = await cookies();
	return getIronSession<SessionData>(cookieStore, sessionOptions);
}

// Cache the auth check for the request
export const auth = cache(async () => {
	const session = await getSession();

	if (!session.isLoggedIn || !session.userId) {
		return null;
	}

	// Verify user still exists
	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			emailVerified: true,
		},
	});

	if (!user) {
		session.destroy();
		return null;
	}

	return user;
});

// Login schema
const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

// Signup schema
const signupSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// Login function
export async function login(
	_state: unknown,
	formData: FormData,
): Promise<{ error?: string; success?: boolean } | undefined> {
	try {
		const rawData = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		// Validate input
		const validatedData = loginSchema.parse(rawData);

		// Find user
		const user = await prisma.user.findUnique({
			where: { email: validatedData.email.toLowerCase() },
		});

		if (!user) {
			return { error: "Invalid email or password" };
		}

		// Verify password
		const passwordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
		if (!passwordValid) {
			return { error: "Invalid email or password" };
		}

		// Create session
		const session = await getSession();
		session.userId = user.id;
		session.email = user.email;
		session.role = user.role;
		session.isLoggedIn = true;
		await session.save();

		// If user has a cart, merge it with any guest cart
		await mergeGuestCart(user.id);

		redirect("/orders");
		return;
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.issues[0]?.message || "Invalid input" };
		}
		console.error("Login error:", error);
		return { error: "An error occurred during login" };
	}
}

// Signup function
export async function signup(
	_state: unknown,
	formData: FormData,
): Promise<{ error?: string; success?: boolean } | undefined> {
	try {
		const rawData = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			confirmPassword: formData.get("confirmPassword") as string,
		};

		// Validate input
		const validatedData = signupSchema.parse(rawData);

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email.toLowerCase() },
		});

		if (existingUser) {
			return { error: "This email is already registered. Please sign in instead." };
		}

		// Hash password
		const passwordHash = await bcrypt.hash(validatedData.password, 12);

		// Create user
		const user = await prisma.user.create({
			data: {
				name: validatedData.name,
				email: validatedData.email.toLowerCase(),
				passwordHash,
				// First user becomes admin (for initial setup)
				role: (await prisma.user.count()) === 0 ? "ADMIN" : "USER",
			},
		});

		// Create session
		const session = await getSession();
		session.userId = user.id;
		session.email = user.email;
		session.role = user.role;
		session.isLoggedIn = true;
		await session.save();

		// Merge any guest cart
		await mergeGuestCart(user.id);

		redirect("/orders");
		return;
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.issues[0]?.message || "Invalid input" };
		}
		console.error("Signup error:", error);
		return { error: "An error occurred during signup" };
	}
}

// Logout function
export async function logout() {
	const session = await getSession();
	session.destroy();
	redirect("/login");
}

// Password reset request
export async function requestPasswordReset(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (!user) {
			// Don't reveal if user exists
			return { success: true };
		}

		// TODO: Generate reset token and send email
		// For now, just return success
		return { success: true };
	} catch (error) {
		console.error("Password reset error:", error);
		return { error: "An error occurred" };
	}
}

// Merge guest cart with user cart
async function mergeGuestCart(userId: string) {
	try {
		const cookieStore = await cookies();
		const guestCartId = cookieStore.get("yns_cart_id")?.value;

		if (!guestCartId) return;

		// Find guest cart
		const guestCart = await prisma.cart.findUnique({
			where: { sessionId: guestCartId },
			include: { items: true },
		});

		if (!guestCart || guestCart.items.length === 0) return;

		// Find or create user cart
		let userCart = await prisma.cart.findUnique({
			where: { userId },
		});

		if (!userCart) {
			userCart = await prisma.cart.create({
				data: { userId },
			});
		}

		// Merge items
		for (const item of guestCart.items) {
			const existingItem = await prisma.cartItem.findUnique({
				where: {
					cartId_variantId: {
						cartId: userCart.id,
						variantId: item.variantId,
					},
				},
			});

			if (existingItem) {
				// Update quantity
				await prisma.cartItem.update({
					where: { id: existingItem.id },
					data: {
						quantity: existingItem.quantity + item.quantity,
					},
				});
			} else {
				// Create new item
				await prisma.cartItem.create({
					data: {
						cartId: userCart.id,
						productId: item.productId,
						variantId: item.variantId,
						quantity: item.quantity,
						metadata: item.metadata as any,
					},
				});
			}
		}

		// Delete guest cart
		await prisma.cart.delete({
			where: { id: guestCart.id },
		});

		// Clear guest cart cookie
		cookieStore.delete("yns_cart_id");
	} catch (error) {
		console.error("Error merging carts:", error);
	}
}

// Check if user is authenticated (for middleware)
export async function isAuthenticated(): Promise<boolean> {
	const user = await auth();
	return !!user;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
	const user = await auth();
	return user?.role === "ADMIN";
}

// Update user profile
export async function updateProfile(data: { name?: string; email?: string }) {
	const user = await auth();
	if (!user) throw new Error("Not authenticated");

	const updated = await prisma.user.update({
		where: { id: user.id },
		data: {
			name: data.name,
			email: data.email?.toLowerCase(),
		},
	});

	// Update session
	const session = await getSession();
	if (data.email) {
		session.email = updated.email;
	}
	await session.save();

	return updated;
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
	const user = await auth();
	if (!user) throw new Error("Not authenticated");

	const fullUser = await prisma.user.findUnique({
		where: { id: user.id },
	});

	if (!fullUser) throw new Error("User not found");

	// Verify current password
	const passwordValid = await bcrypt.compare(currentPassword, fullUser.passwordHash);
	if (!passwordValid) {
		throw new Error("Current password is incorrect");
	}

	// Hash new password
	const passwordHash = await bcrypt.hash(newPassword, 12);

	// Update password
	await prisma.user.update({
		where: { id: user.id },
		data: { passwordHash },
	});

	return { success: true };
}
