import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { Footer } from "@/ui/footer/footer";
import { accountToWebsiteJsonLd, JsonLd } from "@/ui/json-ld";
import { Nav } from "@/ui/nav/nav";

export default async function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Note: accountGet and fileGet not available in new SDK

	return (
		<CartProvider>
			<FavoritesProvider>
				<div className="relative min-h-screen bg-white">
					{/* Skip to main content link for keyboard navigation */}
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#D4AF37] focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
					>
						Skip to main content
					</a>
					<Nav />
					<TooltipProvider>
						<main id="main-content" className="flex w-full flex-1 flex-col relative bg-white">
							{children}
						</main>
						<Footer />
					</TooltipProvider>
					<JsonLd
						jsonLd={accountToWebsiteJsonLd({
							account: null,
							logoUrl: null,
						})}
					/>
				</div>
			</FavoritesProvider>
		</CartProvider>
	);
}
