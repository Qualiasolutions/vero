"use client";

import { ChevronLeft, ChevronRight, Package, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrdersForUser } from "@/actions/checkout-actions";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItem {
	id: string;
	product_id: string;
	quantity: number;
	price_at_time: number;
	product_info?: {
		name: string;
		images: string[];
		description: string;
	};
}

interface Order {
	id: string;
	user_id: string;
	stripe_checkout_session_id: string;
	stripe_payment_intent_id: string;
	total_amount: number;
	currency: string;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	shipping_address?: any;
	billing_address?: any;
	created_at: string;
	updated_at: string;
	order_items: OrderItem[];
}

export function OrderList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const ordersPerPage = 5;

	// Fetch orders when component mounts
	useEffect(() => {
		async function fetchOrders() {
			try {
				const fetchedOrders = await getOrdersForUser();
				setOrders(fetchedOrders);
			} catch (error) {
				logger.error("Failed to fetch orders", error);
			} finally {
				setLoading(false);
			}
		}

		fetchOrders();
	}, []);

	const filteredOrders = orders.filter(
		(order) =>
			(order.order_items.some((item) =>
				item.product_info?.name.toLowerCase().includes(searchTerm.toLowerCase()),
			) ||
				order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(statusFilter === "All" || order.status === statusFilter),
	);

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

	// Loading state
	if (loading) {
		return (
			<div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dfbc3f] mb-4"></div>
				<h2 className="text-xl font-light text-[var(--selfridges-text-primary)] mb-2 uppercase tracking-wider">
					Loading Your Orders
				</h2>
				<p className="text-sm text-[var(--selfridges-text-muted)]">
					Please wait while we fetch your order history...
				</p>
			</div>
		);
	}

	// Empty state when no orders exist
	if (orders.length === 0) {
		return (
			<div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-12">
				<div className="mb-6 p-10 rounded-2xl bg-gradient-to-br from-[#dfbc3f]/10 to-[#dfbc3f]/5 border-2 border-[#dfbc3f]/20">
					<Package className="h-20 w-20 text-[#dfbc3f]" />
				</div>
				<h2 className="text-2xl md:text-3xl font-light text-[var(--selfridges-text-primary)] mb-4 uppercase tracking-wider">
					No Orders Yet
				</h2>
				<p className="text-base text-[var(--selfridges-text-muted)] mb-8 max-w-md leading-relaxed">
					You haven&apos;t placed any orders yet. Start exploring our premium collection of 1:18 scale diecast
					models!
				</p>
				<Link
					href="/products"
					className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#dfbc3f] to-[#c4a535] text-black font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
				>
					<Package className="h-5 w-5" />
					Browse Products
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search orders..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="processing">Processing</SelectItem>
						<SelectItem value="shipped">Shipped</SelectItem>
						<SelectItem value="delivered">Delivered</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Items</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
								<TableCell>
									<div className="max-w-xs">
										{order.order_items.slice(0, 2).map((item) => (
											<div key={item.id} className="text-sm truncate">
												{item.quantity}x {item.product_info?.name || "Product"}
											</div>
										))}
										{order.order_items.length > 2 && (
											<div className="text-xs text-muted-foreground">
												+{order.order_items.length - 2} more
											</div>
										)}
									</div>
								</TableCell>
								<TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
								<TableCell className="font-semibold">
									{order.currency === "eur" ? "€" : "$"}
									{(order.total_amount / 100).toFixed(2)}
								</TableCell>
								<TableCell>
									<Badge
										variant={
											order.status === "delivered"
												? "default"
												: order.status === "shipped"
													? "secondary"
													: order.status === "processing"
														? "outline"
														: order.status === "cancelled"
															? "destructive"
															: "default"
										}
										className={
											order.status === "pending"
												? "bg-yellow-100 text-yellow-800 border-yellow-200"
												: order.status === "processing"
													? "bg-blue-100 text-blue-800 border-blue-200"
													: order.status === "shipped"
														? "bg-purple-100 text-purple-800 border-purple-200"
														: order.status === "delivered"
															? "bg-green-100 text-green-800 border-green-200"
															: "bg-red-100 text-red-800 border-red-200"
										}
									>
										{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex justify-between items-center">
				<div className="text-sm text-muted-foreground">
					Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
					{filteredOrders.length} orders
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
