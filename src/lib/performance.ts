/**
 * Performance monitoring utilities for tracking slow operations
 */

export interface PerformanceMetrics {
	operation: string;
	duration: number;
	timestamp: number;
	metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
	private metrics: PerformanceMetrics[] = [];
	private static instance: PerformanceMonitor;

	private constructor() {}

	static getInstance(): PerformanceMonitor {
		if (!PerformanceMonitor.instance) {
			PerformanceMonitor.instance = new PerformanceMonitor();
		}
		return PerformanceMonitor.instance;
	}

	startTimer(operation: string, metadata?: Record<string, unknown>): () => PerformanceMetrics {
		const startTime = performance.now();
		const timestamp = Date.now();

		return (): PerformanceMetrics => {
			const endTime = performance.now();
			const duration = endTime - startTime;

			const metric: PerformanceMetrics = {
				operation,
				duration,
				timestamp,
				metadata,
			};

			this.metrics.push(metric);

			// Log slow operations (> 1 second)
			if (duration > 1000) {
				console.warn(`🐌 Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`, metadata);
			}

			// Log very slow operations (> 3 seconds)
			if (duration > 3000) {
				console.error(`🚨 Very slow operation: ${operation} took ${duration.toFixed(2)}ms`, metadata);
			}

			return metric;
		};
	}

	getMetrics(): PerformanceMetrics[] {
		return [...this.metrics];
	}

	getSlowOperations(thresholdMs = 1000): PerformanceMetrics[] {
		return this.metrics.filter((m) => m.duration > thresholdMs);
	}

	getAverageDuration(operation: string): number {
		const operationMetrics = this.metrics.filter((m) => m.operation === operation);
		if (operationMetrics.length === 0) return 0;

		const total = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
		return total / operationMetrics.length;
	}

	clear(): void {
		this.metrics = [];
	}
}

export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * Decorator for measuring async function performance
 */
export function measurePerformance<TArgs extends unknown[], TResult>(
	operation: string,
	fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
	return async (...args: TArgs) => {
		const endTimer = performanceMonitor.startTimer(operation, { args: args.length });
		try {
			const result = await fn(...args);
			endTimer();
			return result;
		} catch (error) {
			const metric = endTimer();
			console.error(`Operation ${operation} failed after ${metric.duration.toFixed(2)}ms:`, error);
			throw error;
		}
	};
}
