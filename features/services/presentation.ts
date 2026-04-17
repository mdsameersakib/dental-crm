export const serviceIconOptions = [
  { value: "medical_services", label: "Medical Services" },
  { value: "dentistry", label: "Dentistry" },
  { value: "health_and_safety", label: "Health & Safety" },
  { value: "monitor_heart", label: "Monitor Heart" },
  { value: "biotech", label: "Biotech" },
  { value: "radiology", label: "Radiology" },
  { value: "healing", label: "Healing" },
  { value: "favorite", label: "Favorite" },
  { value: "shield_with_heart", label: "Shield & Heart" },
  { value: "stethoscope", label: "Stethoscope" },
  { value: "local_hospital", label: "Hospital" },
  { value: "self_improvement", label: "Self Improvement" },
] as const;

export function getRenderableServiceIcon(iconName: string) {
  if (iconName === "toothbrush") {
    return "dentistry";
  }

  return iconName;
}
