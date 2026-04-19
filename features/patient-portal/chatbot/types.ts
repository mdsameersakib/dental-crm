export type PatientAssistantDentistContext = {
  name: string;
  specialty: string;
  education: string[];
  acceptingPatients: boolean;
  weeklyAvailability: string[];
};

export type PatientAssistantContext = {
  patientName: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  services: Array<{
    name: string;
    priceLabel: string;
    durationLabel: string;
    shortDescription: string;
    recommendedAftercare: string | null;
  }>;
  dentists: PatientAssistantDentistContext[];
  upcomingAppointments: Array<{
    serviceName: string | null;
    dentistName: string;
    startAt: string;
  }>;
  recentTreatments: Array<{
    treatmentName: string;
    serviceName: string | null;
    dentistName: string;
    aftercareInstructions: string | null;
    followUpDate: string | null;
  }>;
};
