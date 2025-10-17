"use server";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

if (!process.env.SECRET) {
	throw new Error("SECRET must be defined");
}

const key = new TextEncoder().encode(process.env.SECRET);
const SessionDuration = 24 * 60 * 60 * 1000;

interface User {
	email: string;
}

interface SessionData extends JWTPayload {
	user: User;
	expires: number;
}

export async function encrypt(payload: SessionData): Promise<string> {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(payload.expires)
		.sign(key);
}

export async function decrypt(input: string): Promise<SessionData | null | undefined> {
	try {
		const r = await jwtVerify(input, key, {
			algorithms: ["HS256"],
		});
		return r.payload as SessionData;
	} catch (e) {
		if (e instanceof Error) {
			console.log(e.message);
		}
	}
}

export async function login(_state: unknown, formData: FormData): Promise<{ error?: string } | undefined> {
	"use server";

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
		return { error: "Invalid credentials" };
	}

	const expires = Date.now() + SessionDuration;
	const session = await encrypt({ user: { email }, expires });

	(await cookies()).set("session", session, {
		expires: new Date(expires),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	redirect("/orders");
	return;
}

export async function signup(
	_state: unknown,
	formData: FormData,
): Promise<{ error?: string; success?: boolean } | undefined> {
	"use server";

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

	// In a real app, you would:
	// 1. Hash the password
	// 2. Store user in database
	// 3. Send verification email
	// For now, we'll just auto-login if the email matches the admin email
	if (email === process.env.EMAIL) {
		return { error: "This email is already registered. Please sign in instead." };
	}

	// For demo purposes, automatically log the user in after signup
	const expires = Date.now() + SessionDuration;
	const session = await encrypt({ user: { email }, expires });

	(await cookies()).set("session", session, {
		expires: new Date(expires),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	redirect("/orders");
	return;
}

export async function logout() {
	"use server";
	(await cookies()).delete("session");
	redirect("/login");
}

export async function auth() {
	const session = (await cookies()).get("session")?.value;
	if (!session) return null;

	const data = await decrypt(session);
	if (!data || data.expires < Date.now()) {
		(await cookies()).delete("session");
		return null;
	}

	return data;
}

export async function updateSession(request: NextRequest) {
	const session = (await cookies()).get("session")?.value;
	if (!session) return;

	const data = await decrypt(session);
	if (!data) return;

	if (data.expires - Date.now() < 60 * 60 * 1000) {
		data.expires = Date.now() + SessionDuration;

		const res = NextResponse.next();
		res.cookies.set({
			name: "session",
			value: await encrypt(data),
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			expires: new Date(data.expires),
		});
		return res;
	}

	return NextResponse.next();
}
