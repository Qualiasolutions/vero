import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartContent } from "@/ui/cart/cart-content";

export default function CartPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-[var(--selfridges-background)] to-[var(--selfridges-bg-secondary)] py-8 sm:py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
				{/* Header */}
				<div className="mb-8 sm:mb-12">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 rounded-xl bg-gradient-to-br from-[#dfbc3f]/10 to-[#dfbc3f]/5 border border-[#dfbc3f]/20">
							<ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-[#dfbc3f]" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[var(--selfridges-text-primary)] uppercase tracking-wider">
								Shopping Cart
							</h1>
							<p className="text-sm sm:text-base text-[var(--selfridges-text-muted)] mt-1">
								Review your premium collectibles
							</p>
						</div>
					</div>

					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-[var(--selfridges-text-muted)]">
						<Link href="/" className="hover:text-[#dfbc3f] transition-colors">
							Home
						</Link>
						<span>/</span>
						<span className="text-[var(--selfridges-text-primary)] font-medium">Cart</span>
					</div>
				</div>

				{/* Cart Content */}
				<div className="bg-white rounded-2xl shadow-xl border border-[#dfbc3f]/10 overflow-hidden">
					<CartContent />
				</div>
			</div>
		</div>
	);
}
