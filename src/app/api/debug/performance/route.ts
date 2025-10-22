import { NextResponse } from "next/server";
import { performanceMonitor } from "@/lib/performance";
import { cacheUtils } from "@/lib/product-service";

interface AggregatedOperationStats {
	count: number;
	totalDuration: number;
	avgDuration: number;
	minDuration: number;
	maxDuration: number;
	sources: Record<string, number>;
}

export async function GET() {
	// Only allow in development
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json(
			{ error: "Performance debugging is only available in development" },
			{ status: 403 },
		);
	}

	const metrics = performanceMonitor.getMetrics();
	const slowOperations = performanceMonitor.getSlowOperations(1000);
	const cacheStats = cacheUtils.getCacheStats();

	// Calculate statistics
	const operationStats = metrics.reduce<Record<string, AggregatedOperationStats>>((acc, metric) => {
		let stats = acc[metric.operation];
		if (!stats) {
			stats = {
				count: 0,
				totalDuration: 0,
				avgDuration: 0,
				minDuration: Infinity,
				maxDuration: 0,
				sources: {},
			};
			acc[metric.operation] = stats;
		}
		stats.count++;
		stats.totalDuration += metric.duration;
		stats.avgDuration = stats.totalDuration / stats.count;
		stats.minDuration = Math.min(stats.minDuration, metric.duration);
		stats.maxDuration = Math.max(stats.maxDuration, metric.duration);

		const source =
			typeof metric.metadata?.source === "string" ? (metric.metadata.source as string) : undefined;
		if (source) {
			const current = stats.sources[source] ?? 0;
			stats.sources[source] = current + 1;
		}

		return acc;
	}, {});

	return NextResponse.json({
		timestamp: new Date().toISOString(),
		totalOperations: metrics.length,
		slowOperations: {
			count: slowOperations.length,
			operations: slowOperations.map((op) => ({
				operation: op.operation,
				duration: op.duration.toFixed(2) + "ms",
				timestamp: new Date(op.timestamp).toISOString(),
				metadata: op.metadata,
			})),
		},
		cache: {
			stats: cacheStats,
			hitRate: cacheStats.total > 0 ? ((cacheStats.valid / cacheStats.total) * 100).toFixed(1) + "%" : "0%",
		},
		operations: Object.entries(operationStats).map(([operation, stats]) => ({
			operation,
			count: stats.count,
			avgDuration: stats.avgDuration.toFixed(2) + "ms",
			minDuration: stats.minDuration.toFixed(2) + "ms",
			maxDuration: stats.maxDuration.toFixed(2) + "ms",
			sources: stats.sources,
		})),
	});
}

export async function DELETE() {
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json(
			{ error: "Performance debugging is only available in development" },
			{ status: 403 },
		);
	}

	performanceMonitor.clear();
	cacheUtils.invalidateAll();

	return NextResponse.json({
		message: "Performance metrics and cache cleared",
		timestamp: new Date().toISOString(),
	});
}
