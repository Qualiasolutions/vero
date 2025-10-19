import Image from "next/image";
import { CartIcon } from "@/components/cart-icon";
import { FavoritesIcon } from "@/components/favorites-icon";
import { UserMenu } from "@/components/user-menu";
import { getUser } from "@/actions/auth-actions";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	const user = await getUser();

	return (
		<header className="z-50 py-5 sticky top-0 bg-white/98 backdrop-blur-lg border-b border-[#D4AF37]/20 shadow-lg shadow-black/5 transition-all duration-300">
			<div className="w-full flex items-center gap-3 px-4 flex-row sm:px-6 lg:px-8 xl:px-12">
				{/* Logo */}
				<YnsLink href="/" className="group flex items-center relative">
					<Image
						src="/veromodels-logo.webp"
						alt="Veromodels"
						width={320}
						height={107}
						className="h-16 w-auto sm:h-20 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(184,148,31,0.5)]"
						priority
					/>
					<SeoH1 className="sr-only">Veromodels</SeoH1>
					{/* Gold accent line on hover */}
					<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#B8941F] to-[#C9A961] transition-all duration-500 group-hover:w-full"></span>
				</YnsLink>

				{/* Navigation Menu */}
				<div className="flex-1 flex items-center justify-center sm:mr-auto max-sm:order-2">
					<NavMenu />
				</div>

				{/* Search */}
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>

				{/* Icons Group */}
				<div className="flex items-center gap-3 md:gap-4">
					<div className="hidden sm:flex items-center gap-3 md:gap-4 border-r border-[#D4AF37]/20 pr-3 md:pr-4">
						<FavoritesIcon />
						<CartIcon />
					</div>
					<div className="sm:hidden flex items-center gap-3">
						<FavoritesIcon />
						<CartIcon />
					</div>
					<UserMenu userEmail={user?.email} />
				</div>
			</div>
		</header>
	);
};
