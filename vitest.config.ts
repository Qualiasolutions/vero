import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [
		react({
			jsxRuntime: "automatic",
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/setup-tests-new.ts"],
		include: ["**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", "dist", ".next", "tests/auth.spec.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/setup-tests.ts",
				"**/*.config.{ts,js}",
				"**/*.d.ts",
				"**/types/**",
				"**/__tests__/**",
			],
		},
	},
	resolve: {
		alias: [
			{ find: "@/components/ui", replacement: resolve(__dirname, "./src/ui/shadcn") },
			{ find: "@ui", replacement: resolve(__dirname, "./src/ui") },
			{ find: "@", replacement: resolve(__dirname, "./src") },
		],
	},
	esbuild: {
		jsx: "automatic",
	},
});
