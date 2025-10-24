/**
 * Structured logging utility for Veromodels
 *
 * Provides consistent, environment-aware logging with proper formatting
 * Use this instead of console.log/error/warn throughout the application
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
	[key: string]: unknown;
}

class Logger {
	private isDevelopment: boolean;
	private isProduction: boolean;

	constructor() {
		this.isDevelopment = process.env.NODE_ENV === "development";
		this.isProduction = process.env.NODE_ENV === "production";
	}

	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : "";
		return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
	}

	private shouldLog(level: LogLevel): boolean {
		// In production, only log warnings and errors
		if (this.isProduction) {
			return level === "warn" || level === "error";
		}
		// In development, log everything
		return true;
	}

	debug(message: string, context?: LogContext): void {
		if (this.shouldLog("debug")) {
			console.log(this.formatMessage("debug", message, context));
		}
	}

	info(message: string, context?: LogContext): void {
		if (this.shouldLog("info")) {
			console.info(this.formatMessage("info", message, context));
		}
	}

	warn(message: string, context?: LogContext): void {
		if (this.shouldLog("warn")) {
			console.warn(this.formatMessage("warn", message, context));
		}
	}

	error(message: string, error?: Error | unknown, context?: LogContext): void {
		if (this.shouldLog("error")) {
			const errorContext = {
				...context,
				error:
					error instanceof Error
						? {
								name: error.name,
								message: error.message,
								stack: this.isDevelopment ? error.stack : undefined,
							}
						: error,
			};
			console.error(this.formatMessage("error", message, errorContext));
		}
	}

	// Specialized logging methods for common scenarios

	cartAction(action: string, details: LogContext): void {
		this.info(`Cart action: ${action}`, details);
	}

	checkoutEvent(event: string, details: LogContext): void {
		this.info(`Checkout event: ${event}`, details);
	}

	authEvent(event: string, details: LogContext): void {
		this.info(`Auth event: ${event}`, details);
	}

	apiRequest(method: string, path: string, duration?: number): void {
		this.debug(`API ${method} ${path}`, duration ? { duration: `${duration}ms` } : undefined);
	}

	apiError(method: string, path: string, error: Error | unknown): void {
		this.error(`API ${method} ${path} failed`, error);
	}

	performanceMetric(metric: string, value: number, unit = "ms"): void {
		this.debug(`Performance: ${metric}`, { value, unit });
	}
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
