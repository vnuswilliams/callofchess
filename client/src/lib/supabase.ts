import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// These are browser-safe public variables. Authorization is enforced by
// Supabase Auth and Row Level Security, never by hiding values in the bundle.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase public configuration is missing.");
}

// Keep one client instance so auth state and progress queries share the
// same persisted session throughout the SPA.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    experimental: { passkey: true },
  },
});

export type SupabaseUser = Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"];
