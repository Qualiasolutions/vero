"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Input } from "@/ui/shadcn/input";

const inputClasses = cn(
	"vero-search-input appearance-none rounded-lg absolute border-[#D4AF37]/20 bg-white/90 backdrop-blur-sm py-2 pl-4 pr-10 w-9 opacity-0 transition-all ease-linear shadow-sm",
	"max-sm:focus:w-[calc(100vw-2rem)] max-sm:cursor-default max-sm:focus:left-4 max-sm:focus:z-20 max-sm:focus:opacity-100",
	"sm:opacity-100 sm:w-full sm:pl-4 sm:pr-10 sm:inline-block sm:static",
	"md:pl-3 md:pr-9 md:max-w-xs lg:max-w-sm",
	"lg:pl-4 lg:pr-10 lg:max-w-md",
	"focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:shadow-lg focus:shadow-[#D4AF37]/10",
	"hover:border-[#E6C757]/40 placeholder:text-[#6C757D]/60 text-[#212529] h-9 text-sm",
);

export const SearchInputPlaceholder = ({ placeholder }: { placeholder: string }) => {
	return (
		<Input
			className={cn("pointer-events-none", inputClasses)}
			placeholder={placeholder}
			type="search"
			aria-busy
			aria-disabled
		/>
	);
};

export const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const searchParamQuery = searchParams.get("q") ?? "";

	const [query, setQuery] = useState(searchParamQuery);
	const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 100);

	useEffect(() => {
		router.prefetch(`/search?q=${encodeURIComponent(query)}`);
	}, [query, router]);

	useEffect(() => {
		if (debouncedQuery) {
			router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
		}
	}, [debouncedQuery, router]);

	useEffect(() => {
		if (pathname === "/search" && !query) {
			router.push(`/`, { scroll: true });
		}
	}, [pathname, query, router]);

	useEffect(() => {
		if (pathname !== "/search") {
			setQuery("");
		}
	}, [pathname]);

	return (
		<Input
			onChange={(e) => {
				const query = e.target.value;
				setQuery(query);
			}}
			className={inputClasses}
			placeholder={placeholder}
			type="search"
			enterKeyHint="search"
			name="search"
			value={query}
		/>
	);
};
