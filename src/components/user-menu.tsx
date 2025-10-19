"use client";

import { LogOut, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth-actions";

interface UserMenuProps {
	userEmail?: string;
}

export function UserMenu({ userEmail }: UserMenuProps) {
	const router = useRouter();

	if (!userEmail) {
		// Not logged in - show login link
		return (
			<a
				href="/login"
				className="text-[#D4AF37] hover:text-[#E6C757] transition-all duration-300 hover:scale-110"
			>
				<User className="w-5 h-5" />
			</a>
		);
	}

	// Logged in - show dropdown menu
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="text-[#D4AF37] hover:text-[#E6C757] transition-all duration-300 hover:scale-110 outline-none">
				<User className="w-5 h-5" />
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
