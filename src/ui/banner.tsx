"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { YnsLink } from "./yns-link";

export const Banner = () => {
	const [isOpen, setIsOpen] = useState(() => localStorage.getItem("banner") !== "true");

	if (!isOpen) return null;

	const handleClose = () => {
		setIsOpen(false);
		localStorage.setItem("banner", "true");
	};

	return (
		<div className="bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] px-4 py-3 text-[#F5E6D3] border-b border-[#C4A962]/30">
			<div className="flex items-center justify-between gap-x-4">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-x-4">
					<div className="flex items-center gap-x-4">
						<p className="text-center text-sm font-medium">
							🎉 Premium 1:18 Scale Die-Cast Model Cars - Collector's Edition
						</p>
						<YnsLink
							href="/new-arrivals"
							className="flex-none rounded-full bg-[#C4A962] px-3 py-1 text-sm font-semibold text-white shadow-md hover:bg-[#D4B673] transition-all duration-300"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
				<button
					onClick={handleClose}
					className="flex-none rounded-full justify-self-end bg-[#C4A962] p-1 text-white shadow-md hover:bg-[#D4B673] transition-all duration-300"
					aria-label="Close banner"
					type="button"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	);
};
