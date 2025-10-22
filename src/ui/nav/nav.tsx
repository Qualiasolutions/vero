import Image from "next/image";
import { CartIcon } from "@/components/cart-icon";
import { FavoritesIcon } from "@/components/favorites-icon";
import { UserMenuClient } from "@/components/user-menu-client";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-white/95 backdrop-blur-md">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
				{/* Desktop Header - Single Row */}
				<div className="hidden lg:flex items-center justify-between py-6 w-full">
					{/* Logo - Far Left */}
					<YnsLink
						href="/"
						className="relative flex items-center rounded-full px-2 py-1 transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
					>
						<Image
							src="/veromodels-logo.webp"
							alt="Veromodels"
							width={260}
							height={90}
							className="h-14 w-auto object-contain transition-transform duration-500"
							priority
							unoptimized={false}
						/>
						<SeoH1 className="sr-only">Veromodels</SeoH1>
					</YnsLink>

					{/* Center Navigation */}
					<div className="flex items-center gap-6 flex-1 justify-center min-w-0 px-8">
						<NavMenu />
						<SearchNav />
					</div>

					{/* Account Icons - Far Right */}
					<div className="flex items-center gap-3 flex-shrink-0">
						<FavoritesIcon variant="pill" showLabel />
						<CartIcon variant="pill" showLabel />
						<UserMenuClient variant="pill" />
					</div>
				</div>

				{/* Mobile Header */}
				<div className="lg:hidden flex flex-col gap-3 py-3">
					<div className="flex items-center justify-between gap-4">
						<YnsLink
							href="/"
							className="flex items-center rounded-full px-2 py-1 transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
						>
							<Image
								src="/veromodels-logo.webp"
								alt="Veromodels"
								width={220}
								height={72}
								className="h-12 w-auto object-contain"
								priority
								unoptimized={false}
							/>
							<SeoH1 className="sr-only">Veromodels</SeoH1>
						</YnsLink>

						<div className="flex items-center gap-2 flex-shrink-0">
							<YnsLink
								href="/search"
								className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 text-[#6C757D] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
							>
								<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</YnsLink>
							<FavoritesIcon />
							<CartIcon />
							<UserMenuClient />
						</div>
					</div>

					<div className="border-t border-[#D4AF37]/10 pt-3">
						<NavMenu />
					</div>

					<div>
						<SearchNav />
					</div>
				</div>
			</div>
		</header>
	);
};
