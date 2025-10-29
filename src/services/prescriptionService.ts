import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/database';

export async function createPrescription(data: {
  patient_id: string;
  doctor_id: string;
  medical_record_id?: string;
  medication_name_encrypted: string;
  dosage_encrypted: string;
  frequency_encrypted: string;
  duration: string;
  instructions_encrypted?: string;
  refills_allowed?: number;
  pharmacy_name?: string;
  valid_until?: string;
}) {
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .insert([data])
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return prescription;
}

export async function getPrescriptionsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('patient_id', patientId)
    .order('prescribed_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActivePrescriptionsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('patient_id', patientId)
    .eq('status', 'active')
    .order('prescribed_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updatePrescription(
  prescriptionId: string,
  updates: Partial<Prescription>
) {
  const { data, error } = await supabase
    .from('prescriptions')
    .update(updates)
    .eq('id', prescriptionId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return data;
}