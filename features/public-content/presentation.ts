export const publicLandingHeroImage =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80";

export const publicLandingContactImage =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=80";

export const publicLandingTrustHighlights = [
  {
    icon: "biotech",
    title: "Advanced diagnostics",
    description:
      "Modern tools and evidence-based planning for clear treatment decisions.",
  },
  {
    icon: "stethoscope",
    title: "Trusted clinicians",
    description:
      "Experienced dental specialists focused on safe and effective care.",
  },
  {
    icon: "dentistry",
    title: "Comfortable visits",
    description:
      "Patient-first appointments designed for confidence and comfort.",
  },
  {
    icon: "fact_check",
    title: "Clear treatment plans",
    description:
      "Step-by-step care plans with transparent next steps and outcomes.",
  },
] as const;

export function buildMapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
