-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'receptionist', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE billing_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'insurance_pending');

-- Encryption functions using a fixed key (REPLACE IN PRODUCTION WITH VAULT)
CREATE OR REPLACE FUNCTION encrypt_text(plain_text TEXT)
RETURNS TEXT AS $$
DECLARE
  encryption_key TEXT := 'temp_dev_key_32_bytes_length!!';
BEGIN
  RETURN encode(pgp_sym_encrypt(plain_text, encryption_key), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_text(encrypted_text TEXT)
RETURNS TEXT AS $$
DECLARE
  encryption_key TEXT := 'temp_dev_key_32_bytes_length!!';
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted_text, 'base64'), encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_number TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  blood_group TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  ssn_encrypted TEXT,
  medical_history_encrypted TEXT,
  emergency_contact_encrypted TEXT,
  insurance_provider_encrypted TEXT,
  insurance_policy_encrypted TEXT,
  primary_doctor_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL UNIQUE,
  specialization TEXT NOT NULL,
  qualifications TEXT[],
  years_of_experience INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  appointment_type TEXT NOT NULL,
  reason TEXT,
  location TEXT,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medical records table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  chief_complaint_encrypted TEXT,
  diagnosis_encrypted TEXT,
  treatment_plan_encrypted TEXT,
  vital_signs_encrypted TEXT,
  notes_encrypted TEXT,
  follow_up_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prescriptions table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  medical_record_id UUID REFERENCES medical_records(id),
  medication_name_encrypted TEXT NOT NULL,
  dosage_encrypted TEXT NOT NULL,
  frequency_encrypted TEXT NOT NULL,
  duration_days INTEGER,
  instructions_encrypted TEXT,
  refills_allowed INTEGER DEFAULT 0,
  pharmacy TEXT,
  prescribed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Billing table
CREATE TABLE billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  services JSONB NOT NULL,
  status billing_status NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  insurance_claim_encrypted TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Patients can view own record" ON patients FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Medical staff can view all patients" ON patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'nurse', 'receptionist', 'admin'))
);
CREATE POLICY "Admin can insert patients" ON patients FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
);
CREATE POLICY "Admin can update patients" ON patients FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'receptionist'))
);

-- RLS Policies for appointments  
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (
  patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
);
CREATE POLICY "Doctors can view their appointments" ON appointments FOR SELECT USING (
  doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
);
CREATE POLICY "Staff can view all appointments" ON appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('nurse', 'receptionist', 'admin'))
);
CREATE POLICY "Staff can create appointments" ON appointments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('receptionist', 'admin', 'doctor'))
);
CREATE POLICY "Staff can update appointments" ON appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('receptionist', 'admin', 'doctor'))
);

-- RLS Policies for medical records
CREATE POLICY "Patients can view own records" ON medical_records FOR SELECT USING (
  patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
);
CREATE POLICY "Doctors can view their patient records" ON medical_records FOR SELECT USING (
  doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
);
CREATE POLICY "Doctors can create records" ON medical_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Doctors can update own records" ON medical_records FOR UPDATE USING (
  doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
);

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view own prescriptions" ON prescriptions FOR SELECT USING (
  patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
);
CREATE POLICY "Doctors can view prescriptions" ON prescriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Doctors can create prescriptions" ON prescriptions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);

-- RLS Policies for billing
CREATE POLICY "Patients can view own billing" ON billing FOR SELECT USING (
  patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
);
CREATE POLICY "Staff can view all billing" ON billing FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);
CREATE POLICY "Staff can manage billing" ON billing FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('receptionist', 'admin'))
);

-- RLS Policies for audit logs
CREATE POLICY "Only admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Indexes for performance
CREATE INDEX idx_patients_profile ON patients(profile_id);
CREATE INDEX idx_doctors_profile ON doctors(profile_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_billing_patient ON billing(patient_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();