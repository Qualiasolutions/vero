/**
 * Centralized error handling utilities
 *
 * Provides consistent error handling patterns across the application
 */

import { logger } from "./logger";

export class AppError extends Error {
	constructor(
		message: string,
		public code?: string,
		public statusCode?: number,
		public isOperational = true,
	) {
		super(message);
		this.name = "AppError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(
		message: string,
		public fields?: Record<string, string>,
	) {
		super(message, "VALIDATION_ERROR", 400);
		this.name = "ValidationError";
	}
}

export class AuthenticationError extends AppError {
	constructor(message = "Authentication required") {
		super(message, "AUTH_ERROR", 401);
		this.name = "AuthenticationError";
	}
}

export class AuthorizationError extends AppError {
	constructor(message = "You don't have permission to perform this action") {
		super(message, "AUTHORIZATION_ERROR", 403);
		this.name = "AuthorizationError";
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} not found`, "NOT_FOUND", 404);
		this.name = "NotFoundError";
	}
}

export class PaymentError extends AppError {
	constructor(
		message: string,
		public stripeError?: unknown,
	) {
		super(message, "PAYMENT_ERROR", 402);
		this.name = "PaymentError";
	}
}

/**
 * Handle errors in API routes
 */
export function handleApiError(error: unknown): {
	error: string;
	code?: string;
	statusCode: number;
} {
	// Known application errors
	if (error instanceof AppError) {
		logger.error(error.message, error, {
			code: error.code,
			statusCode: error.statusCode,
		});

		return {
			error: error.message,
			code: error.code,
			statusCode: error.statusCode || 500,
		};
	}

	// Unknown errors
	if (error instanceof Error) {
		logger.error("Unhandled error in API route", error);

		// Don't expose internal error details in production
		const message = process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred";

		return {
			error: message,
			code: "INTERNAL_ERROR",
			statusCode: 500,
		};
	}

	// Non-Error objects
	logger.error("Non-Error object thrown", undefined, { error });

	return {
		error: "An unexpected error occurred",
		code: "UNKNOWN_ERROR",
		statusCode: 500,
	};
}

/**
 * Handle errors in Server Actions
 */
export function handleServerActionError(error: unknown): never {
	if (error instanceof AppError) {
		logger.error(error.message, error, {
			code: error.code,
		});
		throw error;
	}

	if (error instanceof Error) {
		logger.error("Unhandled error in Server Action", error);
		throw new AppError(
			process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred",
			"INTERNAL_ERROR",
			500,
		);
	}

	logger.error("Non-Error object thrown in Server Action", undefined, { error });
	throw new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
}

/**
 * Async error handler wrapper
 * Use this to wrap async functions to ensure errors are caught and logged
 */
export function asyncHandler<T extends (...args: unknown[]) => Promise<unknown>>(fn: T): T {
	return ((...args: unknown[]) => {
		return Promise.resolve(fn(...args)).catch((error) => {
			handleServerActionError(error);
		});
	}) as T;
}

/**
 * Check if an error is a specific type
 */
export function isErrorOfType(error: unknown, type: typeof AppError): boolean {
	return error instanceof type;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
	if (error instanceof ValidationError) {
		const fieldErrors = error.fields
			? Object.entries(error.fields)
					.map(([field, msg]) => `${field}: ${msg}`)
					.join(", ")
			: "";
		return `${error.message}${fieldErrors ? ` (${fieldErrors})` : ""}`;
	}

	if (error instanceof AppError) {
		return error.message;
	}

	if (error instanceof Error) {
		return process.env.NODE_ENV === "development"
			? error.message
			: "An unexpected error occurred. Please try again.";
	}

	return "An unexpected error occurred. Please try again.";
}
