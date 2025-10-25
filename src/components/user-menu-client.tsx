"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/actions/auth-actions";
import { UserMenu } from "@/components/user-menu";
import { logger } from "@/lib/logger";

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
				logger.error("Error fetching user", { error });
			}
		}
		fetchUser();
	}, []);

	return <UserMenu userEmail={userEmail} variant={variant} />;
}
