"use client";

import { LogOut, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth-actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
	userEmail?: string;
	variant?: "icon" | "pill";
}

export function UserMenu({ userEmail, variant = "icon" }: UserMenuProps) {
	const router = useRouter();

	const baseButtonClasses =
		variant === "pill"
			? "group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 text-sm font-semibold text-[#212529] shadow-sm transition-all duration-300 hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20"
			: "text-[#D4AF37] hover:text-[#E6C757] transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-[#D4AF37]/10";

	const iconClasses =
		variant === "pill"
			? "h-5 w-5 text-[#6C757D] transition-colors duration-300 group-hover:text-[#B8941F]"
			: "h-5 w-5";

	const pillLabelClass =
		"hidden lg:inline text-sm font-medium text-[#212529] transition-colors duration-300 group-hover:text-[#B8941F]";

	if (!userEmail) {
		// Not logged in - show login link
		return (
			<button
				onClick={() => router.push("/login")}
				className={baseButtonClasses}
				aria-label="Login"
				type="button"
			>
				<User className={iconClasses} />
				{variant === "pill" && <span className={pillLabelClass}>Login</span>}
			</button>
		);
	}

	// Logged in - show dropdown menu
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={baseButtonClasses} type="button" aria-label="Account menu">
					<User className={iconClasses} />
					{variant === "pill" && <span className={pillLabelClass}>Account</span>}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 border-[#D4AF37]/20">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none text-[#212529]">Account</p>
						<p className="text-xs leading-none text-[#6C757D]">{userEmail}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-[#D4AF37]/20" />
				<DropdownMenuItem
					onClick={() => router.push("/orders")}
					className="cursor-pointer hover:bg-[#D4AF37]/10"
				>
					<Package className="mr-2 h-4 w-4" />
					<span>My Orders</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-[#D4AF37]/20" />
				<DropdownMenuItem
					onClick={async () => {
						await logout();
					}}
					className="cursor-pointer hover:bg-red-50 text-red-600"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign Out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
