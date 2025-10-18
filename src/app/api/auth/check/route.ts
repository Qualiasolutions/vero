import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
	const session = await auth();

	if (session) {
		return NextResponse.json({ authenticated: true });
	}

	return NextResponse.json({ authenticated: false }, { status: 401 });
}
