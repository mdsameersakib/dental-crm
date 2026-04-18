import { getPublishedDentists } from "./dentist-queries";
import {
  getLandingBookingContactInfo,
  getLandingContactInfo,
} from "./landing-queries";
import { getPublishedServices } from "./service-queries";
import type {
  PublicDentist,
  PublicDentistDetail,
  PublicService,
} from "./types";

export async function getLandingPageData() {
  const [landing, services, dentists] = await Promise.all([
    getLandingContactInfo(),
    getPublishedServices(6),
    getPublishedDentists(6),
  ]);

  return {
    landing,
    services,
    dentists,
  };
}

export async function getPublicDirectoryData() {
  const [services, dentists] = await Promise.all([
    getPublishedServices(),
    getPublishedDentists(),
  ]);

  return {
    services,
    dentists,
  };
}

export async function getBookingPageData() {
  const [{ services, dentists }, landing] = await Promise.all([
    getPublicDirectoryData(),
    getLandingBookingContactInfo(),
  ]);

  return {
    services,
    dentists,
    contactPhone: landing.contactPhone,
    contactEmail: landing.contactEmail,
  };
}

export { getPublicDentistDetail } from "./dentist-queries";
export { getLandingSettingsForStaff } from "./landing-queries";
export type { PublicDentist, PublicDentistDetail, PublicService };
