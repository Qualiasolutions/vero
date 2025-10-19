"use client";

import { Skeleton } from "@/ui/shadcn/skeleton";

export function ProductLoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<div
					key={index}
					className="vero-card rounded-lg overflow-hidden animate-pulse"
				>
					{/* Image skeleton */}
					<Skeleton className="w-full h-64 bg-gray-200" />

					{/* Content skeleton */}
					<div className="p-4 space-y-3">
						{/* Title skeleton */}
						<Skeleton className="h-6 bg-gray-200 rounded" />

						{/* Brand skeleton */}
						<Skeleton className="h-4 w-3/4 bg-gray-200 rounded" />

						{/* Price skeleton */}
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-20 bg-gray-200 rounded" />
							<Skeleton className="h-10 w-10 bg-gray-200 rounded-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}