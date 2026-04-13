import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export type StaffService = Pick<
  ServiceRow,
  | "id"
  | "slug"
  | "name"
  | "short_description"
  | "full_description"
  | "icon_name"
  | "image_path"
  | "base_price"
  | "duration_min"
  | "is_active"
  | "is_published"
  | "is_featured"
  | "display_order"
>;

export async function getServicesForStaff() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select(
      "id, slug, name, short_description, full_description, icon_name, image_path, base_price, duration_min, is_active, is_published, is_featured, display_order",
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (data ?? []) as StaffService[];
}

export async function getServiceForStaff(serviceId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select(
      "id, slug, name, short_description, full_description, icon_name, image_path, base_price, duration_min, is_active, is_published, is_featured, display_order",
    )
    .eq("id", serviceId)
    .maybeSingle();

  return (data as StaffService | null) ?? null;
}
