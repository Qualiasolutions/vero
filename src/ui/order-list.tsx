"use client";

import { ChevronLeft, ChevronRight, Package, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Real orders will be fetched from Stripe via server actions
// For now, showing empty state until Stripe orders integration is implemented
const orders: Array<{ id: string; customer: string; date: string; total: number; status: string }> = [];

export function OrderList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);
	const ordersPerPage = 5;

	const filteredOrders = orders.filter(
		(order) =>
			(order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.includes(searchTerm)) &&
			(statusFilter === "All" || order.status === statusFilter),
	);

	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

	const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
						<SelectItem value="Completed">Completed</SelectItem>
						<SelectItem value="Processing">Processing</SelectItem>
						<SelectItem value="Shipped">Shipped</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentOrders.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.customer}</TableCell>
								<TableCell>{order.date}</TableCell>
								<TableCell>${order.total.toFixed(2)}</TableCell>
								<TableCell>{order.status}</TableCell>
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
