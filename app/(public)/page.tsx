import { LandingContactSection } from "@/components/public/landing/landing-contact-section";
import { LandingFeaturedDentistsSection } from "@/components/public/landing/landing-featured-dentists-section";
import { LandingFeaturedServicesSection } from "@/components/public/landing/landing-featured-services-section";
import { LandingHeroSection } from "@/components/public/landing/landing-hero-section";
import { LandingTrustHighlightsSection } from "@/components/public/landing/landing-trust-highlights-section";
import { LandingInteractive } from "@/components/public/landing-interactive";
import {
  publicLandingContactImage,
  publicLandingHeroImage,
  publicLandingTrustHighlights,
} from "@/features/public-content/presentation";
import { getLandingPageData } from "@/features/public-content/queries";

export default async function PublicLandingPage() {
  const { landing, services, dentists } = await getLandingPageData();

  return (
    <main className="pt-20" id="top">
      <LandingHeroSection
        imageSrc={publicLandingHeroImage}
        servicesCount={services.length}
        dentistsCount={dentists.length}
      />
      <LandingTrustHighlightsSection items={publicLandingTrustHighlights} />
      <LandingFeaturedServicesSection services={services.slice(0, 3)} />
      <LandingFeaturedDentistsSection dentists={dentists.slice(0, 3)} />

      <LandingInteractive />
      <LandingContactSection
        clinicAddress={landing.clinicAddress}
        contactEmail={landing.contactEmail}
        contactPhone={landing.contactPhone}
        imageSrc={publicLandingContactImage}
      />
    </main>
  );
}
