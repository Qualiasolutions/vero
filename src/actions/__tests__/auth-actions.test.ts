import { describe, it, expect, beforeEach, vi } from "vitest";
import { signup, login, logout, getUser } from "../auth-actions";

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
	createClient: vi.fn(() => ({
		auth: {
			signUp: vi.fn(),
			signInWithPassword: vi.fn(),
			signOut: vi.fn(),
			getUser: vi.fn(),
		},
	})),
}));

// Mock Next.js functions
vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn((url: string) => {
		throw new Error(`REDIRECT:${url}`);
	}),
}));

describe("Authentication Actions", () => {
	describe("signup", () => {
		it("should validate required fields", async () => {
			const formData = new FormData();
			formData.append("name", "");
			formData.append("email", "");
			formData.append("password", "");
			formData.append("confirmPassword", "");

			const result = await signup(null, formData);

			expect(result).toEqual({ error: "All fields are required" });
		});

		it("should validate name length", async () => {
			const formData = new FormData();
			formData.append("name", "J");
			formData.append("email", "test@example.com");
			formData.append("password", "Password123");
			formData.append("confirmPassword", "Password123");

			const result = await signup(null, formData);

			expect(result).toEqual({ error: "Name must be at least 2 characters long" });
		});

		it("should validate email format", async () => {
			const formData = new FormData();
			formData.append("name", "John Doe");
			formData.append("email", "invalid-email");
			formData.append("password", "Password123");
			formData.append("confirmPassword", "Password123");

			const result = await signup(null, formData);

			expect(result).toEqual({ error: "Please enter a valid email address" });
		});

		it("should validate password match", async () => {
			const formData = new FormData();
			formData.append("name", "John Doe");
			formData.append("email", "test@example.com");
			formData.append("password", "Password123");
			formData.append("confirmPassword", "DifferentPassword123");

			const result = await signup(null, formData);

			expect(result).toEqual({ error: "Passwords do not match" });
		});

		it("should validate password strength", async () => {
			const formData = new FormData();
			formData.append("name", "John Doe");
			formData.append("email", "test@example.com");
			formData.append("password", "weak");
			formData.append("confirmPassword", "weak");

			const result = await signup(null, formData);

			expect(result?.error).toContain("Password must");
		});

		it("should sanitize and lowercase email", async () => {
			const { createClient } = await import("@/lib/supabase/server");
			const mockSignUp = vi.fn().mockResolvedValue({
				data: { user: { id: "123", email: "test@example.com" } },
				error: null,
			});

			(createClient as any).mockReturnValue({
				auth: { signUp: mockSignUp },
			});

			const formData = new FormData();
			formData.append("name", "  John Doe  ");
			formData.append("email", "  TEST@EXAMPLE.COM  ");
			formData.append("password", "Password123");
			formData.append("confirmPassword", "Password123");

			try {
				await signup(null, formData);
			} catch (error: any) {
				expect(error.message).toContain("REDIRECT");
			}

			expect(mockSignUp).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "Password123",
				options: expect.objectContaining({
					data: { full_name: "John Doe" },
				}),
			});
		});
	});

	describe("login", () => {
		it("should validate required fields", async () => {
			const formData = new FormData();
			formData.append("email", "");
			formData.append("password", "");

			const result = await login(null, formData);

			expect(result).toEqual({ error: "Email and password are required" });
		});

		it("should validate email format", async () => {
			const formData = new FormData();
			formData.append("email", "invalid-email");
			formData.append("password", "password123");

			const result = await login(null, formData);

			expect(result).toEqual({ error: "Please enter a valid email address" });
		});

		it("should handle invalid credentials", async () => {
			const { createClient } = await import("@/lib/supabase/server");
			const mockSignIn = vi.fn().mockResolvedValue({
				data: { user: null },
				error: { message: "Invalid login credentials" },
			});

			(createClient as any).mockReturnValue({
				auth: { signInWithPassword: mockSignIn },
			});

			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "wrongpassword");

			const result = await login(null, formData);

			expect(result).toEqual({ error: "Invalid email or password" });
		});

		it("should successfully login with valid credentials", async () => {
			const { createClient } = await import("@/lib/supabase/server");
			const mockSignIn = vi.fn().mockResolvedValue({
				data: { user: { id: "123", email: "test@example.com" } },
				error: null,
			});

			(createClient as any).mockReturnValue({
				auth: { signInWithPassword: mockSignIn },
			});

			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "Password123");

			try {
				await login(null, formData);
			} catch (error: any) {
				expect(error.message).toContain("REDIRECT:/");
			}
		});
	});

	describe("logout", () => {
		it("should call signOut and redirect", async () => {
			const { createClient } = await import("@/lib/supabase/server");
			const mockSignOut = vi.fn().mockResolvedValue({ error: null });

			(createClient as any).mockReturnValue({
				auth: { signOut: mockSignOut },
			});

			try {
				await logout();
			} catch (error: any) {
				expect(error.message).toContain("REDIRECT");
			}

			expect(mockSignOut).toHaveBeenCalled();
		});
	});

	describe("getUser", () => {
		it("should return current user", async () => {
			const { createClient } = await import("@/lib/supabase/server");
			const mockUser = { id: "123", email: "test@example.com" };
			const mockGetUser = vi.fn().mockResolvedValue({
				data: { user: mockUser },
			});

			(createClient as any).mockReturnValue({
				auth: { getUser: mockGetUser },
			});

			const user = await getUser();

			expect(user).toEqual(mockUser);
			expect(mockGetUser).toHaveBeenCalled();
		});
	});
});
