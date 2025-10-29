import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/database';

export async function createPatient(data: {
  profile_id: string;
  patient_number: string;
  blood_group?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  insurance_provider?: string;
  primary_doctor_id?: string;
}) {
  const { data: patient, error } = await supabase
    .from('patients')
    .insert([data])
    .select('*, profile:profiles(*), primary_doctor:doctors(*, profile:profiles(*))')
    .single();

  if (error) throw error;
  return patient;
}

export async function getPatientByProfileId(profileId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles(*), primary_doctor:doctors(*, profile:profiles(*))')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPatientById(patientId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles(*), primary_doctor:doctors(*, profile:profiles(*))')
    .eq('id', patientId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updatePatient(patientId: string, updates: Partial<Patient>) {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patientId)
    .select('*, profile:profiles(*), primary_doctor:doctors(*, profile:profiles(*))')
    .single();

  if (error) throw error;
  return data;
}

export async function getAllPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*, profile:profiles(*), primary_doctor:doctors(*, profile:profiles(*))')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function generatePatientNumber(): Promise<string> {
  const { count } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true });

  const patientCount = (count || 0) + 1;
  return `PAT${String(patientCount).padStart(6, '0')}`;
}