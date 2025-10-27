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
			? "group inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#dfbc3f]/30 bg-white/10 backdrop-blur-sm px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:border-[#dfbc3f] hover:shadow-lg hover:shadow-[#dfbc3f]/20"
			: "flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#dfbc3f]/30 text-[#dfbc3f] hover:text-[#c4a535] hover:border-[#dfbc3f] hover:bg-[#dfbc3f]/20 transition-all duration-300 backdrop-blur-sm";

	const iconClasses =
		variant === "pill"
			? "h-5 w-5 text-[#dfbc3f] transition-colors duration-300 group-hover:text-[#c4a535]"
			: "h-5 w-5";

	const pillLabelClass =
		"hidden lg:inline text-sm font-medium text-white transition-colors duration-300 group-hover:text-[#dfbc3f]";

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
			<DropdownMenuContent
				align="end"
				className="w-56 border-2 border-[#dfbc3f]/30 bg-black/95 backdrop-blur-md"
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-semibold leading-none text-white">Account</p>
						<p className="text-xs leading-none text-white/60">{userEmail}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-[#dfbc3f]/30" />
				<DropdownMenuItem
					onClick={() => router.push("/profile")}
					className="cursor-pointer hover:bg-[#dfbc3f]/20 text-white/80 hover:text-[#dfbc3f] focus:bg-[#dfbc3f]/20 focus:text-[#dfbc3f]"
				>
					<User className="mr-2 h-4 w-4" />
					<span>My Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => router.push("/orders")}
					className="cursor-pointer hover:bg-[#dfbc3f]/20 text-white/80 hover:text-[#dfbc3f] focus:bg-[#dfbc3f]/20 focus:text-[#dfbc3f]"
				>
					<Package className="mr-2 h-4 w-4" />
					<span>My Orders</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-[#dfbc3f]/30" />
				<DropdownMenuItem
					onClick={async () => {
						await logout();
					}}
					className="cursor-pointer hover:bg-red-500/20 text-red-400 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign Out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
