import { createClient } from "@/lib/supabase/server";
import { InfoBillboardClient } from "./info-billboard-client";

async function getLiveStats() {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase.rpc("get_live_stats", {});

		if (error) {
			// Fallback query if RPC doesn't exist
			const [cartData, profileData, recentCartData] = await Promise.all([
				supabase.from("cart_items").select("id", { count: "exact", head: true }),
				supabase.from("profiles").select("id", { count: "exact", head: true }),
				supabase
					.from("cart_items")
					.select("id", { count: "exact", head: true })
					.gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
			]);

			return {
				active_carts: cartData.count || 0,
				total_collectors: profileData.count || 0,
				carts_24h: recentCartData.count || 0,
			};
		}

		return data?.[0] || { active_carts: 0, total_collectors: 0, carts_24h: 0 };
	} catch {
		return { active_carts: 0, total_collectors: 0, carts_24h: 0 };
	}
}

export async function InfoBillboard() {
	const stats = await getLiveStats();

	return <InfoBillboardClient stats={stats} />;
}
