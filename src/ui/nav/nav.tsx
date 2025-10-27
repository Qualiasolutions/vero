"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/cart-icon";
import { FavoritesIcon } from "@/components/favorites-icon";
import { UserMenuClient } from "@/components/user-menu-client";
import StoreConfig from "@/store.config";
import { SearchInput } from "@/ui/nav/search-input.client";
import { SeoH1 } from "@/ui/seo-h1";

export const Nav = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMenuOpen]);

	const navLinks = [
		{
			label: "Collection",
			href: "/products",
		},
		...StoreConfig.categories.map((cat) => ({
			label: cat.name,
			href: `/category/${cat.slug}`,
		})),
	];

	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full transition-all duration-300 ${
					isScrolled
						? "bg-gradient-to-r from-[var(--selfridges-bg-secondary)] via-[var(--selfridges-background)] to-[var(--selfridges-bg-secondary)] backdrop-blur-xl shadow-xl shadow-[#dfbc3f]/10 border-b border-[var(--vero-gold-accent)]/30"
						: "bg-gradient-to-r from-[var(--selfridges-bg-secondary)] via-[var(--selfridges-background)] to-[var(--selfridges-bg-secondary)] backdrop-blur-md border-b border-[var(--vero-gold-accent)]/20"
				}`}
			>
				<div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
					{/* Main Navigation */}
					<div className="flex items-center justify-between h-20 sm:h-24 lg:h-28">
						{/* Logo - Left */}
						<Link
							href="/"
							className="flex items-center rounded-xl hover:scale-105 transition-all duration-500 flex-shrink-0 group mr-4 lg:mr-6"
						>
							<div className="relative">
								<Image
									src="/veromodels-logo.webp"
									alt="Veromodels"
									width={400}
									height={140}
									className="h-14 sm:h-16 lg:h-20 xl:h-24 w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_8px_32px_#dfbc3f]"
									priority
									unoptimized={false}
								/>
								<div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#dfbc3f] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
							</div>
							<SeoH1 className="sr-only">Veromodels</SeoH1>
						</Link>

						{/* Desktop Navigation - Left aligned */}
						<nav className="hidden lg:flex items-center flex-1 mx-2 xl:mx-4">
							<ul className="flex items-center gap-1 xl:gap-2">
								{navLinks.map((link) => (
									<li key={link.href} className="relative whitespace-nowrap">
										<Link
											href={link.href}
											className="group relative px-3 xl:px-4 py-2 text-sm xl:text-base font-semibold text-[var(--selfridges-text-primary)] transition-all duration-300 hover:text-[#dfbc3f] flex items-center justify-center min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbc3f]/50"
										>
											<span className="truncate text-center uppercase tracking-wider">{link.label}</span>
											<span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#dfbc3f] to-[#c4a535] transform -translate-x-1/2 transition-all duration-300 group-hover:w-8 xl:group-hover:w-10"></span>
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Right Side Actions */}
						<div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
							{/* Desktop Search */}
							<div className="hidden lg:block">
								<div className="relative group">
									<SearchInput placeholder="Search models..." />
									<div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full text-[#dfbc3f] pointer-events-none">
										<Search className="h-4 w-4" />
									</div>
								</div>
							</div>

							{/* Mobile Search Toggle */}
							<button
								type="button"
								onClick={() => setIsSearchOpen(!isSearchOpen)}
								className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#dfbc3f]/30 text-[#dfbc3f] hover:border-[#dfbc3f] hover:bg-[#dfbc3f]/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbc3f]/50 bg-white"
							>
								<Search className="h-5 w-5" />
							</button>

							{/* Favorites */}
							<FavoritesIcon variant="icon" />

							{/* Cart */}
							<CartIcon variant="icon" />

							{/* User Account */}
							<UserMenuClient variant="icon" />

							{/* Mobile Menu Toggle */}
							<button
								type="button"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#dfbc3f]/30 text-[#dfbc3f] hover:border-[#dfbc3f] hover:bg-[#dfbc3f]/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbc3f]/50 bg-white"
							>
								{isMenuOpen ? (
									<X className="h-5 w-5 transition-transform duration-300 rotate-180" />
								) : (
									<Menu className="h-5 w-5 transition-transform duration-300" />
								)}
							</button>
						</div>
					</div>

					{/* Mobile Search Bar */}
					{isSearchOpen && (
						<div className="lg:hidden py-3 border-t border-[var(--vero-gold-accent)]/20 animate-fade-in">
							<div className="relative">
								<SearchInput placeholder="Search models..." />
								<div className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full text-[#dfbc3f] pointer-events-none">
									<Search className="h-4 w-4" />
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Mobile Menu Overlay */}
				{isMenuOpen && (
					<div
						className="lg:hidden fixed inset-0 top-20 bg-black/50 backdrop-blur-sm z-40"
						onClick={() => setIsMenuOpen(false)}
					>
						<div
							className="mobile-menu absolute top-0 left-0 right-0 bg-white border-b border-[var(--vero-gold-accent)]/20 shadow-xl"
							onClick={(e) => e.stopPropagation()}
						>
							<nav className="px-4 py-6">
								<ul className="flex flex-col gap-2">
									{navLinks.map((link, index) => (
										<li key={link.href}>
											<Link
												href={link.href}
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center justify-between h-14 px-4 text-base font-medium text-[var(--selfridges-text-primary)] border border-[var(--vero-gold-accent)]/10 rounded-xl transition-all duration-300 hover:border-[var(--vero-gold-accent)]/30 hover:bg-[var(--vero-gold-accent)]/5 hover:text-[var(--vero-gold-accent)] group"
											>
												<span className="flex items-center gap-3">
													<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--vero-gold-accent)]/10 text-black text-sm font-semibold group-hover:bg-[var(--vero-gold-accent)] group-hover:text-white transition-colors duration-300">
														{String(index + 1).padStart(2, "0")}
													</span>
													{link.label}
												</span>
												<svg
													className="h-4 w-4 text-black/40 group-hover:text-[var(--vero-gold-accent)] transition-colors duration-300"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</div>
				)}
			</header>
		</>
	);
};
