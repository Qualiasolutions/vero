import { NextResponse } from "next/server";
import { getUser } from "@/actions/auth-actions";

export async function GET() {
	const user = await getUser();

	if (user) {
		return NextResponse.json({ authenticated: true, user: { email: user.email } });
	}

	return NextResponse.json({ authenticated: false }, { status: 401 });
}
