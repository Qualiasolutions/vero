import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";

export const metadata: Metadata = {
	title: "All Models - Veromodels",
	description: "Browse our complete collection of premium 1:18 scale diecast model cars",
	alternates: { canonical: `${publicUrl}/products` },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
