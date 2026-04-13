import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { getSupabaseEnv } from "./env";

export function createClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(env.url, env.publishableKey);
}
