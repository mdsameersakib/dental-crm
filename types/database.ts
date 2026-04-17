export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          payload: Json;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          payload?: Json;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          payload?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          booked_by: string | null;
          cancellation_reason: string | null;
          completed_at: string | null;
          confirmed_at: string | null;
          created_at: string;
          dentist_id: string;
          duration_min: number;
          end_at: string;
          id: string;
          is_recurring: boolean;
          notes: string | null;
          parent_appointment_id: string | null;
          patient_email: string | null;
          patient_id: string | null;
          patient_name: string | null;
          recurrence_rule: string | null;
          service_id: string | null;
          source: Database["public"]["Enums"]["appointment_source"];
          start_at: string;
          status: Database["public"]["Enums"]["appointment_status"];
          updated_at: string;
        };
        Insert: {
          booked_by?: string | null;
          cancellation_reason?: string | null;
          completed_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          dentist_id: string;
          duration_min?: number;
          end_at: string;
          id?: string;
          is_recurring?: boolean;
          notes?: string | null;
          parent_appointment_id?: string | null;
          patient_email?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          recurrence_rule?: string | null;
          service_id?: string | null;
          source?: Database["public"]["Enums"]["appointment_source"];
          start_at: string;
          status?: Database["public"]["Enums"]["appointment_status"];
          updated_at?: string;
        };
        Update: {
          booked_by?: string | null;
          cancellation_reason?: string | null;
          completed_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          dentist_id?: string;
          duration_min?: number;
          end_at?: string;
          id?: string;
          is_recurring?: boolean;
          notes?: string | null;
          parent_appointment_id?: string | null;
          patient_email?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          recurrence_rule?: string | null;
          service_id?: string | null;
          source?: Database["public"]["Enums"]["appointment_source"];
          start_at?: string;
          status?: Database["public"]["Enums"]["appointment_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_booked_by_fkey";
            columns: ["booked_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_dentist_id_fkey";
            columns: ["dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_parent_appointment_id_fkey";
            columns: ["parent_appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patient_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      booking_requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          notes: string | null;
          patient_name: string;
          phone: string | null;
          preferred_date: string | null;
          preferred_dentist_id: string | null;
          preferred_time: string | null;
          service_id: string | null;
          status: Database["public"]["Enums"]["booking_request_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          notes?: string | null;
          patient_name: string;
          phone?: string | null;
          preferred_date?: string | null;
          preferred_dentist_id?: string | null;
          preferred_time?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["booking_request_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          notes?: string | null;
          patient_name?: string;
          phone?: string | null;
          preferred_date?: string | null;
          preferred_dentist_id?: string | null;
          preferred_time?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["booking_request_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_requests_preferred_dentist_id_fkey";
            columns: ["preferred_dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_requests_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      clinic_settings: {
        Row: {
          booking_default_duration_min: number;
          booking_timezone: string;
          created_at: string;
          id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          booking_default_duration_min?: number;
          booking_timezone?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          booking_default_duration_min?: number;
          booking_timezone?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clinic_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dentist_profiles: {
        Row: {
          bio: string | null;
          consultation_fee: number | null;
          created_at: string;
          display_order: number;
          education: Json;
          id: string;
          is_accepting_patients: boolean;
          is_featured: boolean;
          is_published: boolean;
          license_number: string;
          profile_id: string;
          profile_photo_path: string | null;
          short_bio: string | null;
          slug: string | null;
          specializations: string[];
          updated_at: string;
          years_of_experience: number | null;
        };
        Insert: {
          bio?: string | null;
          consultation_fee?: number | null;
          created_at?: string;
          display_order?: number;
          education?: Json;
          id?: string;
          is_accepting_patients?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          license_number: string;
          profile_id: string;
          profile_photo_path?: string | null;
          short_bio?: string | null;
          slug?: string | null;
          specializations?: string[];
          updated_at?: string;
          years_of_experience?: number | null;
        };
        Update: {
          bio?: string | null;
          consultation_fee?: number | null;
          created_at?: string;
          display_order?: number;
          education?: Json;
          id?: string;
          is_accepting_patients?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          license_number?: string;
          profile_id?: string;
          profile_photo_path?: string | null;
          short_bio?: string | null;
          slug?: string | null;
          specializations?: string[];
          updated_at?: string;
          years_of_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "dentist_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dentist_schedules: {
        Row: {
          created_at: string;
          day_of_week: Database["public"]["Enums"]["day_of_week"];
          dentist_id: string;
          end_time: string;
          id: string;
          is_available: boolean;
          slot_duration_min: number;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          day_of_week: Database["public"]["Enums"]["day_of_week"];
          dentist_id: string;
          end_time: string;
          id?: string;
          is_available?: boolean;
          slot_duration_min?: number;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          day_of_week?: Database["public"]["Enums"]["day_of_week"];
          dentist_id?: string;
          end_time?: string;
          id?: string;
          is_available?: boolean;
          slot_duration_min?: number;
          start_time?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dentist_schedules_dentist_id_fkey";
            columns: ["dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dentist_time_off: {
        Row: {
          created_at: string;
          dentist_id: string;
          end_at: string;
          id: string;
          reason: string | null;
          start_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          dentist_id: string;
          end_at: string;
          id?: string;
          reason?: string | null;
          start_at: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          dentist_id?: string;
          end_at?: string;
          id?: string;
          reason?: string | null;
          start_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dentist_time_off_dentist_id_fkey";
            columns: ["dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      landing_settings: {
        Row: {
          clinic_address: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          clinic_address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          clinic_address?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "landing_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at: string;
          id: string;
          meta: Json;
          read_at: string | null;
          scheduled_for: string | null;
          sent_at: string | null;
          status: Database["public"]["Enums"]["notification_status"];
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          id?: string;
          meta?: Json;
          read_at?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["notification_status"];
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          id?: string;
          meta?: Json;
          read_at?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["notification_status"];
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      patient_documents: {
        Row: {
          appointment_id: string | null;
          bucket_name: string;
          document_type: Database["public"]["Enums"]["document_type"];
          file_name: string;
          file_size_bytes: number | null;
          id: string;
          is_visible_to_patient: boolean;
          mime_type: string | null;
          notes: string | null;
          patient_id: string;
          storage_path: string;
          treatment_id: string | null;
          updated_at: string;
          uploaded_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          appointment_id?: string | null;
          bucket_name: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          file_name: string;
          file_size_bytes?: number | null;
          id?: string;
          is_visible_to_patient?: boolean;
          mime_type?: string | null;
          notes?: string | null;
          patient_id: string;
          storage_path: string;
          treatment_id?: string | null;
          updated_at?: string;
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          appointment_id?: string | null;
          bucket_name?: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          file_name?: string;
          file_size_bytes?: number | null;
          id?: string;
          is_visible_to_patient?: boolean;
          mime_type?: string | null;
          notes?: string | null;
          patient_id?: string;
          storage_path?: string;
          treatment_id?: string | null;
          updated_at?: string;
          uploaded_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "patient_documents_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patient_documents_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patient_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patient_documents_treatment_id_fkey";
            columns: ["treatment_id"];
            isOneToOne: false;
            referencedRelation: "treatments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patient_documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      patient_profiles: {
        Row: {
          address: string | null;
          allergies: string[];
          blood_type: string | null;
          created_at: string;
          current_medications: string[];
          date_of_birth: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          gender: string | null;
          id: string;
          insurance_number: string | null;
          insurance_provider: string | null;
          medical_notes: string | null;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          allergies?: string[];
          blood_type?: string | null;
          created_at?: string;
          current_medications?: string[];
          date_of_birth?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          gender?: string | null;
          id?: string;
          insurance_number?: string | null;
          insurance_provider?: string | null;
          medical_notes?: string | null;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          allergies?: string[];
          blood_type?: string | null;
          created_at?: string;
          current_medications?: string[];
          date_of_birth?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          gender?: string | null;
          id?: string;
          insurance_number?: string | null;
          insurance_provider?: string | null;
          medical_notes?: string | null;
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patient_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          is_active: boolean;
          last_name: string;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          staff_onboarding_completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email: string;
          first_name?: string;
          id: string;
          is_active?: boolean;
          last_name?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          staff_onboarding_completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          is_active?: boolean;
          last_name?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          staff_onboarding_completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          base_price: number | null;
          created_at: string;
          created_by: string | null;
          display_order: number;
          duration_min: number | null;
          full_description: string | null;
          icon_name: string | null;
          id: string;
          image_path: string | null;
          is_active: boolean;
          is_featured: boolean;
          is_published: boolean;
          name: string;
          short_description: string | null;
          slug: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          base_price?: number | null;
          created_at?: string;
          created_by?: string | null;
          display_order?: number;
          duration_min?: number | null;
          full_description?: string | null;
          icon_name?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          name: string;
          short_description?: string | null;
          slug: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          base_price?: number | null;
          created_at?: string;
          created_by?: string | null;
          display_order?: number;
          duration_min?: number | null;
          full_description?: string | null;
          icon_name?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          name?: string;
          short_description?: string | null;
          slug?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "services_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      treatments: {
        Row: {
          aftercare_instructions: string | null;
          appointment_id: string | null;
          cost: number | null;
          created_at: string;
          dentist_id: string;
          description: string | null;
          follow_up_date: string | null;
          id: string;
          patient_id: string;
          performed_at: string | null;
          service_id: string | null;
          status: Database["public"]["Enums"]["treatment_status"];
          status_notes: string | null;
          tooth_number: number | null;
          treatment_code: string | null;
          treatment_name: string;
          updated_at: string;
        };
        Insert: {
          aftercare_instructions?: string | null;
          appointment_id?: string | null;
          cost?: number | null;
          created_at?: string;
          dentist_id: string;
          description?: string | null;
          follow_up_date?: string | null;
          id?: string;
          patient_id: string;
          performed_at?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["treatment_status"];
          status_notes?: string | null;
          tooth_number?: number | null;
          treatment_code?: string | null;
          treatment_name: string;
          updated_at?: string;
        };
        Update: {
          aftercare_instructions?: string | null;
          appointment_id?: string | null;
          cost?: number | null;
          created_at?: string;
          dentist_id?: string;
          description?: string | null;
          follow_up_date?: string | null;
          id?: string;
          patient_id?: string;
          performed_at?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["treatment_status"];
          status_notes?: string | null;
          tooth_number?: number | null;
          treatment_code?: string | null;
          treatment_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "treatments_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treatments_dentist_id_fkey";
            columns: ["dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treatments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patient_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "treatments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          created_at: string;
          dentist_id: string | null;
          id: string;
          notes: string | null;
          patient_id: string;
          preferred_date_range: unknown;
          service_id: string | null;
          status: Database["public"]["Enums"]["waitlist_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          dentist_id?: string | null;
          id?: string;
          notes?: string | null;
          patient_id: string;
          preferred_date_range?: unknown;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["waitlist_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          dentist_id?: string | null;
          id?: string;
          notes?: string | null;
          patient_id?: string;
          preferred_date_range?: unknown;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["waitlist_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "waitlist_dentist_id_fkey";
            columns: ["dentist_id"];
            isOneToOne: false;
            referencedRelation: "dentist_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "waitlist_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patient_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "waitlist_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_role: {
        Args: never;
        Returns: Database["public"]["Enums"]["app_role"];
      };
      is_admin_or_receptionist: {
        Args: never;
        Returns: boolean;
      };
      is_staff: {
        Args: never;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "patient" | "dentist" | "receptionist" | "admin";
      appointment_source:
        | "public_booking"
        | "patient_portal"
        | "staff_manual"
        | "waitlist";
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show";
      booking_request_status: "new" | "contacted" | "converted" | "rejected";
      day_of_week: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
      document_type:
        | "xray"
        | "scan"
        | "report"
        | "consent_form"
        | "photo"
        | "invoice"
        | "other";
      notification_channel: "in_app" | "email" | "sms" | "whatsapp";
      notification_status: "queued" | "sent" | "failed" | "read";
      treatment_status: "planned" | "in_progress" | "completed";
      waitlist_status: "waiting" | "notified" | "booked" | "expired";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "dentist", "receptionist", "admin"],
      appointment_source: [
        "public_booking",
        "patient_portal",
        "staff_manual",
        "waitlist",
      ],
      appointment_status: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      booking_request_status: ["new", "contacted", "converted", "rejected"],
      day_of_week: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      document_type: [
        "xray",
        "scan",
        "report",
        "consent_form",
        "photo",
        "invoice",
        "other",
      ],
      notification_channel: ["in_app", "email", "sms", "whatsapp"],
      notification_status: ["queued", "sent", "failed", "read"],
      treatment_status: ["planned", "in_progress", "completed"],
      waitlist_status: ["waiting", "notified", "booked", "expired"],
    },
  },
} as const;
