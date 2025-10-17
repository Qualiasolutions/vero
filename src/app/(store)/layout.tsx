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
					<Nav />
					<TooltipProvider>
						<main className="mx-auto flex w-full flex-1 flex-col px-4 pb-6 pt-2 sm:px-6 lg:px-8 xl:px-12 relative bg-white">
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
