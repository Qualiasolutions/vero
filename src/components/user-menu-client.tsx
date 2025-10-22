"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/actions/auth-actions";
import { UserMenu } from "@/components/user-menu";

interface UserMenuClientProps {
	variant?: "icon" | "pill";
}

export function UserMenuClient({ variant = "icon" }: UserMenuClientProps) {
	const [userEmail, setUserEmail] = useState<string | undefined>();

	useEffect(() => {
		async function fetchUser() {
			try {
				const user = await getUser();
				setUserEmail(user?.email);
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		}
		fetchUser();
	}, []);

	return <UserMenu userEmail={userEmail} variant={variant} />;
}
