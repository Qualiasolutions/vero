import MDX from "@next/mdx";
import type { NextConfig } from "next/types";
import path from "path";

const withMDX = MDX();

const nextConfig: NextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	...(process.env.DOCKER && { output: "standalone" as const }),
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		remotePatterns: [
			{ hostname: "files.stripe.com" },
			{ hostname: "d1wqzb5bdbcre6.cloudfront.net" },
			{ hostname: "*.blob.vercel-storage.com" },
			{ hostname: "images.squarespace-cdn.com" },
			{ hostname: "i.ibb.co" },
		],
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	transpilePackages: ["next-mdx-remote", "commerce-kit"],
	webpack: (config, { dev, isServer, webpack }) => {
		// Enhance webpack configuration for better performance
		config.resolve = {
			...config.resolve,
			extensionAlias: {
				".js": [".js", ".ts"],
				".jsx": [".jsx", ".tsx"],
			},
		};

		// Code splitting optimizations
		if (!isServer) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true,
						},
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: "vendors",
							priority: -10,
							chunks: "all",
						},
						common: {
							name: "common",
							minChunks: 2,
							chunks: "all",
							priority: -30,
							reuseExistingChunk: true,
						},
					},
				},
			};
		}

		// Improve module resolution
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "src"),
		};

		// Add compression for production
		if (!dev && !isServer) {
			config.plugins.push(
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 15,
				}),
			);
		}

		return config;
	},
	rewrites: async () => [
		{
			source: "/stats/:match*",
			destination: "https://eu.umami.is/:match*",
		},
	],
};

export default withMDX(nextConfig);
