import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { env, publicUrl } from "@/env.mjs";
import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages } from "@/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
	const baseUrl = publicUrl;

	return {
		title: {
			default: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars | Dubai, UAE",
			template: "%s | Veromodels",
		},
		description:
			"Discover premium 1:18 scale die-cast model cars in Dubai, UAE. Shop exclusive collections from AutoArt, GT Spirit, Ottomobile, and more. Worldwide shipping available.",
		keywords: [
			"die-cast model cars",
			"1:18 scale models",
			"premium car models",
			"AutoArt models",
			"GT Spirit",
			"Ottomobile",
			"dubai model cars",
			"UAE die-cast",
			"collectible cars",
			"scale models",
			"luxury car replicas",
			"veromodels",
		],
		authors: [{ name: "Veromodels" }],
		creator: "Veromodels",
		publisher: "Veromodels",
		metadataBase: new URL(baseUrl),
		openGraph: {
			type: "website",
			locale: "en_US",
			url: baseUrl,
			siteName: "Veromodels",
			title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
			description:
				"Discover premium 1:18 scale die-cast model cars in Dubai, UAE. Shop exclusive collections from AutoArt, GT Spirit, Ottomobile, and more.",
			images: [
				{
					url: "/og-image.jpg",
					width: 1200,
					height: 630,
					alt: "Veromodels - Premium Die-Cast Model Cars",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Veromodels - Premium 1:18 Scale Die-Cast Model Cars",
			description:
				"Discover premium 1:18 scale die-cast model cars in Dubai, UAE. Shop exclusive collections.",
			images: ["/og-image.jpg"],
			creator: "@veromodels",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		verification: {
			google: "your-google-verification-code",
			yandex: "your-yandex-verification-code",
			yahoo: "your-yahoo-verification-code",
		},
	};
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = await getMessages();
	const baseUrl = publicUrl;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: "Veromodels",
		description: "Premium 1:18 scale die-cast model cars in Dubai, UAE",
		url: baseUrl,
		telephone: "+971-XXXXXXXXX",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Dubai",
			addressCountry: "AE",
		},
		image: `${baseUrl}/og-image.jpg`,
		sameAs: [
			"https://instagram.com/veromodels",
			"https://facebook.com/veromodels",
			"https://x.com/veromodels",
		],
		priceRange: "$$$$",
		areaServed: {
			"@type": "Country",
			name: "United Arab Emirates",
		},
	};

	return (
		<html lang={locale} className="h-full antialiased scroll-smooth">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
			</head>
			<body className="flex min-h-full flex-col bg-white text-gray-900 selection:bg-yellow-300 selection:text-black">
				<IntlClientProvider messages={messages} locale={locale}>
					<div className="flex min-h-full flex-1 flex-col" vaul-drawer-wrapper="">
						{children}
					</div>
					<Toaster position="top-center" offset={10} />
				</IntlClientProvider>
				{env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						async
						src="/stats/script.js"
						data-host-url={publicUrl + "/stats"}
						data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					/>
				)}
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
