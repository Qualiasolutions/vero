import { UserIcon } from "lucide-react";
import Image from "next/image";
import { CartIcon } from "@/components/cart-icon";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";

export const Nav = async () => {
	return (
		<header className="z-50 py-6 sticky top-0 bg-white/95 backdrop-blur-lg border-b border-[#D4AF37]/20 shadow-sm">
			<div className="mx-auto flex max-w-7xl items-center gap-2 px-4 flex-row sm:px-6 lg:px-8">
				<YnsLink href="/" className="group flex items-center">
					<Image
						src="/veromodels-logo.webp"
						alt="Veromodels"
						width={180}
						height={60}
						className="h-10 w-auto sm:h-12 transition-transform group-hover:scale-105"
						priority
					/>
					<SeoH1 className="sr-only">Veromodels</SeoH1>
				</YnsLink>

				<div className="max-w-full flex shrink w-auto sm:mr-auto overflow-auto max-sm:order-2">
					<NavMenu />
				</div>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<CartIcon />
				<YnsLink href="/login" className="text-[#D4AF37] hover:text-[#B8941F] transition-colors">
					<UserIcon className="w-5 h-5" />
				</YnsLink>
			</div>
		</header>
	);
};
