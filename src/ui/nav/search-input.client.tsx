"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Input } from "@/ui/shadcn/input";

const inputClasses = cn(
	"w-full h-10 px-4 pr-11 text-sm border-2 border-[#dfbc3f]/30 rounded-full focus:outline-none focus:border-[#dfbc3f] focus:ring-2 focus:ring-[#dfbc3f]/20 transition-all duration-300 bg-white text-[var(--selfridges-text-primary)] placeholder-[var(--selfridges-text-muted)]",
	"group-hover:border-[#dfbc3f]/50",
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
	const [_isQueryPending, debouncedQuery] = useDebouncedValue(query, 300);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Only prefetch when query changes, not on every render
		if (query.trim()) {
			router.prefetch(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}, [query, router]);

	useEffect(() => {
		// Only navigate when debounced query changes and is not empty
		if (debouncedQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`, { scroll: false });
		} else if (pathname === "/search") {
			// Only navigate back to home if we're on search page and query is empty
			router.push(`/`, { scroll: true });
		}
	}, [debouncedQuery, pathname, router]);

	// Update query when URL search params change (e.g., when navigating back)
	useEffect(() => {
		const currentQuery = searchParams.get("q") ?? "";
		if (currentQuery !== query) {
			setQuery(currentQuery);
		}
	}, [searchParams, query]);

	// Keep focus on input when component re-renders
	useEffect(() => {
		if (inputRef.current && document.activeElement !== inputRef.current) {
			// Only focus if the input is not already focused and we have a query
			if (query.trim()) {
				inputRef.current.focus();
			}
		}
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setQuery(newQuery);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (query.trim()) {
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			}
		}
	};

	return (
		<Input
			ref={inputRef}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			className={inputClasses}
			placeholder={placeholder}
			type="search"
			enterKeyHint="search"
			name="search"
			value={query}
			autoComplete="off"
		/>
	);
};
