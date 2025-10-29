import { supabase } from '@/integrations/supabase/client';
import { MedicalRecord } from '@/types/database';

export async function createMedicalRecord(data: {
  patient_id: string;
  doctor_id: string;
  chief_complaint_encrypted?: string;
  diagnosis_encrypted?: string;
  treatment_plan_encrypted?: string;
  vital_signs_encrypted?: string;
  notes_encrypted?: string;
  follow_up_date?: string;
}) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  const { data: record, error } = await supabase
    .from('medical_records')
    .insert([{
      ...data,
      created_by: currentUser.user.id,
    }])
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return record;
}

export async function getMedicalRecordsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('patient_id', patientId)
    .order('visit_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMedicalRecordById(recordId: string) {
  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('id', recordId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateMedicalRecord(
  recordId: string,
  updates: Partial<MedicalRecord>
) {
  const { data, error } = await supabase
    .from('medical_records')
    .update(updates)
    .eq('id', recordId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return data;
}