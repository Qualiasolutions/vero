import { createClient } from "@supabase/supabase-js";

// Validate Supabase environment variables at module load time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	const missing = [];
	if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
	if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
	throw new Error(
		`Missing required Supabase environment variables: ${missing.join(", ")}. ` +
			"Please check your .env.local file and ensure all required variables are set.",
	);
}

// Validate URL format
try {
	new URL(supabaseUrl);
} catch (_error) {
	throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}. Must be a valid URL.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
