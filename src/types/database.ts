export type UserRole = 'patient' | 'doctor' | 'nurse' | 'receptionist' | 'admin';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type BillingStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'insurance_pending';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone_encrypted?: string;
  address_encrypted?: string;
  date_of_birth?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  profile_id: string;
  license_number: string;
  specialization: string[];
  department?: string;
  consultation_fee?: number;
  available_hours?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Patient {
  id: string;
  profile_id: string;
  patient_number: string;
  ssn_encrypted?: string;
  blood_group?: string;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact_encrypted?: string;
  insurance_provider?: string;
  insurance_policy_encrypted?: string;
  medical_history_encrypted?: string;
  primary_doctor_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  primary_doctor?: Doctor;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  appointment_type: string;
  reason?: string;
  notes_encrypted?: string;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  chief_complaint_encrypted?: string;
  diagnosis_encrypted?: string;
  treatment_plan_encrypted?: string;
  vital_signs_encrypted?: string;
  notes_encrypted?: string;
  follow_up_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medical_record_id?: string;
  medication_name_encrypted: string;
  dosage_encrypted: string;
  frequency_encrypted: string;
  duration: string;
  instructions_encrypted?: string;
  refills_allowed: number;
  pharmacy_name?: string;
  prescribed_date: string;
  valid_until?: string;
  status: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface MedicalReport {
  id: string;
  patient_id: string;
  doctor_id?: string;
  report_type: string;
  report_date: string;
  title: string;
  findings_encrypted?: string;
  interpretation_encrypted?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  is_reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Billing {
  id: string;
  patient_id: string;
  appointment_id?: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: BillingStatus;
  services: Record<string, any>;
  insurance_claim_encrypted?: string;
  payment_method?: string;
  paid_at?: string;
  due_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  appointment?: Appointment;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}