export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string
          created_by: string
          doctor_id: string
          end_time: string
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          reason: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string
          created_by: string
          doctor_id: string
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          reason?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string
          created_by?: string
          doctor_id?: string
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          reason?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      billing: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          due_date: string
          id: string
          insurance_claim_encrypted: string | null
          invoice_number: string
          paid_at: string | null
          patient_id: string
          payment_method: string | null
          services: Json
          status: Database["public"]["Enums"]["billing_status"]
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          due_date: string
          id?: string
          insurance_claim_encrypted?: string | null
          invoice_number: string
          paid_at?: string | null
          patient_id: string
          payment_method?: string | null
          services: Json
          status?: Database["public"]["Enums"]["billing_status"]
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          due_date?: string
          id?: string
          insurance_claim_encrypted?: string | null
          invoice_number?: string
          paid_at?: string | null
          patient_id?: string
          payment_method?: string | null
          services?: Json
          status?: Database["public"]["Enums"]["billing_status"]
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          license_number: string
          profile_id: string
          qualifications: string[] | null
          specialization: string
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          license_number: string
          profile_id: string
          qualifications?: string[] | null
          specialization: string
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          license_number?: string
          profile_id?: string
          qualifications?: string[] | null
          specialization?: string
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          chief_complaint_encrypted: string | null
          created_at: string
          created_by: string
          diagnosis_encrypted: string | null
          doctor_id: string
          follow_up_date: string | null
          id: string
          notes_encrypted: string | null
          patient_id: string
          treatment_plan_encrypted: string | null
          updated_at: string
          visit_date: string
          vital_signs_encrypted: string | null
        }
        Insert: {
          chief_complaint_encrypted?: string | null
          created_at?: string
          created_by: string
          diagnosis_encrypted?: string | null
          doctor_id: string
          follow_up_date?: string | null
          id?: string
          notes_encrypted?: string | null
          patient_id: string
          treatment_plan_encrypted?: string | null
          updated_at?: string
          visit_date?: string
          vital_signs_encrypted?: string | null
        }
        Update: {
          chief_complaint_encrypted?: string | null
          created_at?: string
          created_by?: string
          diagnosis_encrypted?: string | null
          doctor_id?: string
          follow_up_date?: string | null
          id?: string
          notes_encrypted?: string | null
          patient_id?: string
          treatment_plan_encrypted?: string | null
          updated_at?: string
          visit_date?: string
          vital_signs_encrypted?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string[] | null
          blood_group: string | null
          chronic_conditions: string[] | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_encrypted: string | null
          id: string
          insurance_policy_encrypted: string | null
          insurance_provider_encrypted: string | null
          is_active: boolean | null
          medical_history_encrypted: string | null
          patient_number: string
          primary_doctor_id: string | null
          profile_id: string
          ssn_encrypted: string | null
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_encrypted?: string | null
          id?: string
          insurance_policy_encrypted?: string | null
          insurance_provider_encrypted?: string | null
          is_active?: boolean | null
          medical_history_encrypted?: string | null
          patient_number: string
          primary_doctor_id?: string | null
          profile_id: string
          ssn_encrypted?: string | null
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_encrypted?: string | null
          id?: string
          insurance_policy_encrypted?: string | null
          insurance_provider_encrypted?: string | null
          is_active?: boolean | null
          medical_history_encrypted?: string | null
          patient_number?: string
          primary_doctor_id?: string | null
          profile_id?: string
          ssn_encrypted?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor_id: string
          dosage_encrypted: string
          duration_days: number | null
          frequency_encrypted: string
          id: string
          instructions_encrypted: string | null
          is_active: boolean | null
          medical_record_id: string | null
          medication_name_encrypted: string
          patient_id: string
          pharmacy: string | null
          prescribed_date: string
          refills_allowed: number | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          doctor_id: string
          dosage_encrypted: string
          duration_days?: number | null
          frequency_encrypted: string
          id?: string
          instructions_encrypted?: string | null
          is_active?: boolean | null
          medical_record_id?: string | null
          medication_name_encrypted: string
          patient_id: string
          pharmacy?: string | null
          prescribed_date?: string
          refills_allowed?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          doctor_id?: string
          dosage_encrypted?: string
          duration_days?: number | null
          frequency_encrypted?: string
          id?: string
          instructions_encrypted?: string | null
          is_active?: boolean | null
          medical_record_id?: string | null
          medication_name_encrypted?: string
          patient_id?: string
          pharmacy?: string | null
          prescribed_date?: string
          refills_allowed?: number | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_text: { Args: { encrypted_text: string }; Returns: string }
      encrypt_text: { Args: { plain_text: string }; Returns: string }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      billing_status:
        | "pending"
        | "paid"
        | "overdue"
        | "cancelled"
        | "insurance_pending"
      user_role: "patient" | "doctor" | "nurse" | "receptionist" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      billing_status: [
        "pending",
        "paid",
        "overdue",
        "cancelled",
        "insurance_pending",
      ],
      user_role: ["patient", "doctor", "nurse", "receptionist", "admin"],
    },
  },
} as const
