import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { mapPublicServices } from "./mappers";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

async function readPublishedServices(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select(
      "id, slug, name, short_description, full_description, recommended_aftercare, icon_name, image_path, base_price, duration_min",
    )
    .eq("is_active", true)
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data ?? []) as Pick<
    ServiceRow,
    | "id"
    | "slug"
    | "name"
    | "short_description"
    | "full_description"
    | "recommended_aftercare"
    | "icon_name"
    | "image_path"
    | "base_price"
    | "duration_min"
  >[];
}

export async function getPublishedServices(limit?: number) {
  const services = await readPublishedServices(limit);
  return mapPublicServices(services);
}
