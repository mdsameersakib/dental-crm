export type ServiceInput = {
  id: string | null;
  slug: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  recommendedAftercare: string | null;
  iconName: string | null;
  basePrice: number | null;
  durationMin: number | null;
  displayOrder: number;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
};

type ValidationResult =
  | { success: true; data: ServiceInput }
  | { success: false; error: string };

function getTrimmedField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function parseOptionalNumber(value: string, label: string) {
  if (!value) {
    return { success: true as const, value: null };
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return {
      success: false as const,
      error: `${label} must be a valid number.`,
    };
  }

  return { success: true as const, value: parsed };
}

export function validateServiceForm(formData: FormData): ValidationResult {
  const id = getTrimmedField(formData, "id");
  const slug = getTrimmedField(formData, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const name = getTrimmedField(formData, "name");
  const shortDescription = getTrimmedField(formData, "short_description");
  const fullDescription = getTrimmedField(formData, "full_description");
  const iconName = getTrimmedField(formData, "icon_name");
  const recommendedAftercare = getTrimmedField(
    formData,
    "recommended_aftercare",
  );
  const basePriceRaw = getTrimmedField(formData, "base_price");
  const durationMinRaw = getTrimmedField(formData, "duration_min");
  const displayOrderRaw = getTrimmedField(formData, "display_order");

  if (!name || !slug) {
    return {
      success: false,
      error: "Service name and slug are required.",
    };
  }

  const basePrice = parseOptionalNumber(basePriceRaw, "Base price");
  if (!basePrice.success) {
    return { success: false, error: basePrice.error };
  }

  const durationMin = parseOptionalNumber(durationMinRaw, "Duration");
  if (!durationMin.success) {
    return { success: false, error: durationMin.error };
  }

  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) : 0;
  if (Number.isNaN(displayOrder)) {
    return { success: false, error: "Display order must be a valid number." };
  }

  return {
    success: true,
    data: {
      id: id || null,
      slug,
      name,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      recommendedAftercare: recommendedAftercare || null,
      iconName: iconName || null,
      basePrice: basePrice.value,
      durationMin: durationMin.value,
      displayOrder,
      isActive: formData.get("is_active") === "on",
      isPublished: formData.get("is_published") === "on",
      isFeatured: formData.get("is_featured") === "on",
    },
  };
}
