import { Search } from "lucide-react";
import { getTranslations } from "@/i18n/server";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";

export const SearchNav = async () => {
	const t = await getTranslations("Global.nav.search");

	return (
		<div className="relative group w-64 lg:w-80">
			<Input
				type="search"
				placeholder={t("placeholder")}
				className="vero-input h-10 px-4 pr-12 text-sm border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 shadow-sm group-hover:border-[#D4AF37]/40 group-hover:shadow-md"
			/>
			<Button
				type="submit"
				size="sm"
				variant="ghost"
				className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 text-[#6C757D] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100"
			>
				<Search className="h-4 w-4 transition-transform duration-300" />
			</Button>
		</div>
	);
};
