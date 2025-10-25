"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import { logger } from "@/lib/logger";
import { YnsLink } from "@/ui/yns-link";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		logger.error("Application error occurred", { error: error.message, digest: error.digest });
	}, [error]);

	const t = useTranslations("Global.error");

	return (
		<main className="mx-auto max-w-xl flex-auto text-center">
			<h1 className="mb-8 mt-8 text-4xl font-black">{t("title")}</h1>
			<Button variant="link" asChild>
				<YnsLink href="/">{t("goBackLink")}</YnsLink>
			</Button>
		</main>
	);
}
