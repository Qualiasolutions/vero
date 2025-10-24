"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/cart-icon";
import { FavoritesIcon } from "@/components/favorites-icon";
import { UserMenuClient } from "@/components/user-menu-client";
import StoreConfig from "@/store.config";
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
		...StoreConfig.categories.map((cat) => ({
			label: cat.name,
			href: `/category/${cat.slug}`,
		})),
		{
			label: "All Models",
			href: "/products",
		},
	];

	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full transition-all duration-300 ${
					isScrolled
						? "bg-white/98 backdrop-blur-xl shadow-lg border-b border-[var(--vero-gold-accent)]/30"
						: "bg-white/95 backdrop-blur-md border-b border-[var(--vero-gold-accent)]/20"
				}`}
			>
				<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
					{/* Main Navigation */}
					<div className="flex items-center justify-between h-20 lg:h-24">
						{/* Logo - Left */}
						<Link
							href="/"
							className="flex items-center rounded-xl hover:scale-105 transition-all duration-500 flex-shrink-0 group"
						>
							<div className="relative">
								<Image
									src="/veromodels-logo.webp"
									alt="Veromodels"
									width={320}
									height={112}
									className="h-14 lg:h-16 w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_4px_20px_var(--vero-gold-accent-glow)]"
									priority
									unoptimized={false}
								/>
								{!isScrolled && (
									<div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--vero-gold-accent)] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
								)}
							</div>
							<SeoH1 className="sr-only">Veromodels</SeoH1>
						</Link>

						{/* Desktop Navigation - Center */}
						<nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8">
							<ul className="flex items-center gap-1 lg:gap-1.5 xl:gap-2">
								{navLinks.map((link) => (
									<li key={link.href} className="relative whitespace-nowrap">
										<Link
											href={link.href}
											className="group relative px-2.5 lg:px-3 xl:px-4 py-2 lg:py-2.5 xl:py-3 text-sm lg:text-sm xl:text-base font-medium text-[var(--selfridges-text-primary)] transition-all duration-300 hover:text-[var(--vero-gold-accent)] rounded-full hover:bg-[var(--vero-gold-accent)]/10 flex items-center justify-center min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vero-gold-accent)]/50"
										>
											<span className="truncate text-center">{link.label}</span>
											<span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--vero-gold-accent)] to-[var(--vero-gold-accent-dark)] transform -translate-x-1/2 transition-all duration-300 group-hover:w-6 xl:group-hover:w-8"></span>
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
									<input
										type="search"
										placeholder="Search models..."
										className="w-48 xl:w-64 h-10 px-4 pr-10 text-sm border border-[var(--vero-gold-accent)]/20 rounded-full focus:outline-none focus:border-[var(--vero-gold-accent)] focus:ring-2 focus:ring-[var(--vero-gold-accent-glow)] transition-all duration-300 group-hover:border-[var(--vero-gold-accent)]/40 bg-[var(--selfridges-white)] placeholder-[var(--selfridges-text-muted)]"
									/>
									<button
										type="button"
										className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full text-[var(--selfridges-text-muted)] hover:text-[var(--vero-gold-accent)] hover:bg-[var(--vero-gold-accent)]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vero-gold-accent)]/50"
									>
										<Search className="h-4 w-4" />
									</button>
								</div>
							</div>

							{/* Mobile Search Toggle */}
							<button
								type="button"
								onClick={() => setIsSearchOpen(!isSearchOpen)}
								className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vero-gold-accent)]/20 text-[var(--selfridges-text-muted)] hover:border-[var(--vero-gold-accent)] hover:bg-[var(--vero-gold-accent)]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vero-gold-accent)]/50"
							>
								<Search className="h-4 w-4" />
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
								className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vero-gold-accent)]/20 text-[var(--selfridges-text-muted)] hover:border-[var(--vero-gold-accent)] hover:bg-[var(--vero-gold-accent)]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vero-gold-accent)]/50"
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
						<div className="lg:hidden py-3 border-t border-[var(--vero-gold-accent)]/10 animate-fade-in">
							<div className="relative">
								<input
									type="search"
									placeholder="Search models..."
									className="w-full h-12 px-4 pr-12 text-sm border border-[var(--vero-gold-accent)]/20 rounded-full focus:outline-none focus:border-[var(--vero-gold-accent)] focus:ring-2 focus:ring-[var(--vero-gold-accent-glow)] transition-all duration-300"
									autoFocus
								/>
								<button
									type="button"
									className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full text-[var(--selfridges-text-muted)] hover:text-[var(--vero-gold-accent)] hover:bg-[var(--vero-gold-accent)]/10 transition-all duration-300"
								>
									<Search className="h-4 w-4" />
								</button>
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
