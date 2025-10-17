import { UserIcon } from "lucide-react";
import { CartIcon } from "@/components/cart-icon";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	return (
		<header className="z-50 py-6 sticky top-0 bg-black/80 backdrop-blur-lg border-b border-yellow-900/30">
			<div className="mx-auto flex max-w-7xl items-center gap-2 px-4 flex-row sm:px-6 lg:px-8">
				<YnsLink href="/" className="group">
					<SeoH1 className="-mt-0.5 whitespace-nowrap text-2xl font-light tracking-widest uppercase vero-text-gradient group-hover:scale-105 transition-transform">
						Veromodels
					</SeoH1>
				</YnsLink>

				<div className="max-w-full flex shrink w-auto sm:mr-auto overflow-auto max-sm:order-2">
					<NavMenu />
				</div>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<CartIcon />
				<YnsLink href="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
					<UserIcon className="w-5 h-5" />
				</YnsLink>
			</div>
		</header>
	);
};
