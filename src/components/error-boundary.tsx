"use client";

import { Component, type ReactNode } from "react";
import { logger } from "@/lib/logger";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

/**
 * Error Boundary component to catch React errors
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error to monitoring service
		logger.error("React Error Boundary caught an error", error, {
			componentStack: errorInfo.componentStack,
		});

		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			// Render custom fallback UI or default error message
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="container mx-auto px-4 py-16">
					<div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
						<div className="space-y-4">
							<div>
								<h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
								<p className="text-sm text-muted-foreground">
									We're sorry for the inconvenience. An error occurred while loading this page.
								</p>
							</div>

							{process.env.NODE_ENV === "development" && this.state.error && (
								<div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto">
									<p className="font-bold text-red-600">{this.state.error.message}</p>
									<pre className="mt-2 text-gray-700">{this.state.error.stack}</pre>
								</div>
							)}

							<div className="flex gap-4 mt-4">
								<button
									type="button"
									onClick={() => window.location.reload()}
									className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
								>
									Reload Page
								</button>
								<a href="/" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
									Go to Homepage
								</a>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode) {
	return function WithErrorBoundary(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};
}
