import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/products", "/category", "/search"],
				disallow: ["/api", "/auth", "/checkout", "/cart", "/orders", "/admin", "/_next", "/favicon.ico"],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: ["/api", "/auth", "/checkout", "/cart", "/orders", "/admin"],
			},
			{
				userAgent: "Googlebot-Image",
				allow: "/",
			},
			{
				userAgent: "Bingbot",
				allow: "/",
				disallow: ["/api", "/auth", "/checkout", "/cart", "/orders", "/admin"],
			},
		],
		sitemap: publicUrl + "/sitemap.xml",
		host: publicUrl,
	};
}
