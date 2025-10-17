import { UserIcon } from "lucide-react";
import Image from "next/image";
import { CartIcon } from "@/components/cart-icon";
import { FavoritesIcon } from "@/components/favorites-icon";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	return (
		<header className="z-50 py-6 sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm">
			<div className="w-full flex items-center gap-2 px-4 flex-row sm:px-6 lg:px-8 xl:px-12">
				<YnsLink href="/" className="group flex items-center">
					<Image
						src="/veromodels-logo.webp"
						alt="Veromodels"
						width={240}
						height={80}
						className="h-14 w-auto sm:h-16 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
						priority
					/>
					<SeoH1 className="sr-only">Veromodels</SeoH1>
				</YnsLink>

				<div className="flex-1 flex items-center justify-center sm:mr-auto max-sm:order-2">
					<NavMenu />
				</div>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<div className="flex items-center gap-4">
					<FavoritesIcon />
					<CartIcon />
					<YnsLink
						href="/login"
						className="text-[#D4AF37] hover:text-[#E6C757] transition-all duration-300 hover:scale-110"
					>
						<UserIcon className="w-5 h-5" />
					</YnsLink>
				</div>
			</div>
		</header>
	);
};
