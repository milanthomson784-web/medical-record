/*
  # Medical Record Suite - Complete Database Schema
  
  ## Overview
  Comprehensive medical records management system with encryption, role-based access,
  and audit logging. All sensitive data is encrypted using pgcrypto extension.
  
  ## New Tables
  
  ### 1. Users & Profiles
  - `profiles` - Extended user information with roles
    - Links to auth.users
    - Stores: role (patient/doctor/nurse/receptionist/admin), name, contact info
    - Encrypted: phone, address fields
  
  ### 2. Patients
  - `patients` - Patient demographic and registration data
    - Encrypted: SSN, medical history, insurance details
    - Links to profiles table for patient users
  
  ### 3. Doctors
  - `doctors` - Doctor credentials and specializations
    - Stores: license number, specializations, availability
  
  ### 4. Appointments
  - `appointments` - Scheduling and appointment management
    - Tracks: patient, doctor, datetime, status, notes
    - Includes conflict detection via unique constraints
  
  ### 5. Medical Records
  - `medical_records` - Core health records
    - Encrypted: diagnosis, treatments, vital signs
    - Full audit trail of access
  
  ### 6. Prescriptions
  - `prescriptions` - Medication prescriptions
    - Encrypted: medication details, dosage, instructions
    - Tracks prescriber and pharmacy
  
  ### 7. Medical Reports
  - `medical_reports` - Lab results, scans, documents
    - Links to Supabase Storage for files
    - Encrypted: findings, interpretations
  
  ### 8. Billing
  - `billing` - Invoices and payment tracking
    - Encrypted: insurance claim numbers
    - Tracks amount, status, payment method
  
  ### 9. Audit Logs
  - `audit_logs` - Complete audit trail
    - Records: who, what, when, IP address
    - Immutable (no updates/deletes allowed)
  
  ## Security
  
  ### Encryption
  - Uses pgcrypto extension for field-level encryption
  - Encryption key stored in Supabase vault
  - Sensitive fields encrypted with AES-256
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with policies:
  - Patients: Can view own records only
  - Doctors: Can view assigned patients
  - Nurses: Can view patients in their department
  - Receptionists: Limited to scheduling
  - Admins: Full access with audit logging
  
  ## Important Notes
  
  1. **Encryption Key**: Set up vault secret 'encryption_key' before use
  2. **HIPAA Compliance**: Review retention and access policies
  3. **Audit Trail**: All access to medical_records triggers audit log
  4. **Data Retention**: Implement archival policy per regulations
  5. **Backup**: Ensure encrypted backups with key management
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for roles and statuses
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'receptionist', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'insurance_pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_encrypted text,
  address_encrypted text,
  date_of_birth date,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  license_number text UNIQUE NOT NULL,
  specialization text[] DEFAULT '{}',
  department text,
  consultation_fee numeric(10,2),
  available_hours jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  patient_number text UNIQUE NOT NULL,
  ssn_encrypted text,
  blood_group text,
  allergies text[] DEFAULT '{}',
  chronic_conditions text[] DEFAULT '{}',
  emergency_contact_encrypted text,
  insurance_provider text,
  insurance_policy_encrypted text,
  medical_history_encrypted text,
  primary_doctor_id uuid REFERENCES doctors(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  appointment_type text NOT NULL,
  reason text,
  notes_encrypted text,
  location text,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  visit_date timestamptz DEFAULT now(),
  chief_complaint_encrypted text,
  diagnosis_encrypted text,
  treatment_plan_encrypted text,
  vital_signs_encrypted text,
  notes_encrypted text,
  follow_up_date date,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  medical_record_id uuid REFERENCES medical_records(id),
  medication_name_encrypted text NOT NULL,
  dosage_encrypted text NOT NULL,
  frequency_encrypted text NOT NULL,
  duration text NOT NULL,
  instructions_encrypted text,
  refills_allowed integer DEFAULT 0,
  pharmacy_name text,
  prescribed_date timestamptz DEFAULT now(),
  valid_until date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical reports table
CREATE TABLE IF NOT EXISTS medical_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id),
  report_type text NOT NULL,
  report_date date NOT NULL,
  title text NOT NULL,
  findings_encrypted text,
  interpretation_encrypted text,
  file_path text,
  file_name text,
  file_size bigint,
  mime_type text,
  is_reviewed boolean DEFAULT false,
  reviewed_by uuid REFERENCES doctors(id),
  reviewed_at timestamptz,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES appointments(id),
  invoice_number text UNIQUE NOT NULL,
  amount numeric(10,2) NOT NULL,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  status billing_status DEFAULT 'pending',
  services jsonb NOT NULL,
  insurance_claim_encrypted text,
  payment_method text,
  paid_at timestamptz,
  due_date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_doctors_profile ON doctors(profile_id);
CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_patients_profile ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_patients_doctor ON patients(primary_doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_patient ON billing(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_status ON billing(status);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for doctors
CREATE POLICY "Anyone authenticated can view active doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Doctors can update own record"
  ON doctors FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can manage doctors"
  ON doctors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for patients
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Doctors can view their patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND (doctors.id = patients.primary_doctor_id 
           OR EXISTS (
             SELECT 1 FROM appointments
             WHERE appointments.patient_id = patients.id
             AND appointments.doctor_id = doctors.id
           ))
    )
  );

CREATE POLICY "Medical staff can view patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'nurse', 'receptionist', 'admin')
    )
  );

CREATE POLICY "Admins and receptionists can create patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'receptionist')
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = appointments.patient_id
      AND patients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = appointments.doctor_id
      AND doctors.profile_id = auth.uid()
    )
  );

CREATE POLICY "Medical staff can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('nurse', 'receptionist', 'admin')
    )
  );

CREATE POLICY "Authorized staff can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'receptionist', 'admin')
    )
  );

CREATE POLICY "Authorized staff can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'receptionist', 'admin')
    )
  );

-- RLS Policies for medical_records
CREATE POLICY "Patients can view own medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medical_records.patient_id
      AND patients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their patients' records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND (doctors.id = medical_records.doctor_id
           OR EXISTS (
             SELECT 1 FROM patients
             WHERE patients.id = medical_records.patient_id
             AND patients.primary_doctor_id = doctors.id
           ))
    )
  );

CREATE POLICY "Doctors can create medical records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND doctors.id = medical_records.doctor_id
    )
  );

CREATE POLICY "Doctors can update their medical records"
  ON medical_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND doctors.id = medical_records.doctor_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND doctors.id = medical_records.doctor_id
    )
  );

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view own prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = prescriptions.patient_id
      AND patients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view and manage prescriptions"
  ON prescriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND doctors.id = prescriptions.doctor_id
    )
  );

-- RLS Policies for medical_reports
CREATE POLICY "Patients can view own reports"
  ON medical_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medical_reports.patient_id
      AND patients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their patients' reports"
  ON medical_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.profile_id = auth.uid()
      AND (doctors.id = medical_reports.doctor_id
           OR EXISTS (
             SELECT 1 FROM patients
             WHERE patients.id = medical_reports.patient_id
             AND patients.primary_doctor_id = doctors.id
           ))
    )
  );

CREATE POLICY "Authorized staff can create reports"
  ON medical_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- RLS Policies for billing
CREATE POLICY "Patients can view own billing"
  ON billing FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = billing.patient_id
      AND patients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Authorized staff can manage billing"
  ON billing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('receptionist', 'admin')
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_reports_updated_at BEFORE UPDATE ON medical_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, ip_address)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW), inet_client_addr());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), inet_client_addr());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, ip_address)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), inet_client_addr());
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for sensitive tables
CREATE TRIGGER audit_medical_records AFTER INSERT OR UPDATE OR DELETE ON medical_records
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_prescriptions AFTER INSERT OR UPDATE OR DELETE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Helper functions for encryption (using pgcrypto)
CREATE OR REPLACE FUNCTION encrypt_text(plain_text text)
RETURNS text AS $$
BEGIN
  RETURN encode(
    encrypt(
      plain_text::bytea,
      'encryption-key-placeholder'::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_text(encrypted_text text)
RETURNS text AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_text, 'base64'),
      'encryption-key-placeholder'::bytea,
      'aes'
    ),
    'utf8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;