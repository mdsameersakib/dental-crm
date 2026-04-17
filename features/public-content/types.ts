export type PublicService = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl: string | null;
  durationLabel: string;
  priceLabel: string;
};

export type PublicDentist = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  education: string;
  shortBio: string;
  imageUrl: string;
};

export type PublicDentistDetail = PublicDentist & {
  bio: string;
  yearsOfExperience: string;
  consultationFee: string;
  isAcceptingPatients: boolean;
  educationItems: string[];
  specialties: string[];
  availability: {
    day: string;
    label: string;
    isAvailable: boolean;
  }[];
};

export type StaffLandingSettings = {
  id: string | null;
  contactPhone: string;
  contactEmail: string;
  clinicAddress: string;
};
