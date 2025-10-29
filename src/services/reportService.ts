import { supabase } from '@/integrations/supabase/client';
import { MedicalReport } from '@/types/database';

export async function uploadMedicalReport(
  file: File,
  patientId: string,
  reportData: {
    doctor_id?: string;
    report_type: string;
    report_date: string;
    title: string;
    findings_encrypted?: string;
    interpretation_encrypted?: string;
  }
) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${patientId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `medical-reports/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('medical-reports')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: report, error: dbError } = await supabase
    .from('medical_reports')
    .insert([{
      ...reportData,
      patient_id: patientId,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      created_by: currentUser.user.id,
    }])
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (dbError) {
    await supabase.storage.from('medical-reports').remove([filePath]);
    throw dbError;
  }

  return report;
}

export async function getReportsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('medical_reports')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('patient_id', patientId)
    .order('report_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReportDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('medical-reports')
    .createSignedUrl(filePath, 300);

  if (error) throw error;
  return data.signedUrl;
}

export async function updateReport(
  reportId: string,
  updates: Partial<MedicalReport>
) {
  const { data, error } = await supabase
    .from('medical_reports')
    .update(updates)
    .eq('id', reportId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReport(reportId: string) {
  const { data: report } = await supabase
    .from('medical_reports')
    .select('file_path')
    .eq('id', reportId)
    .maybeSingle();

  if (report?.file_path) {
    await supabase.storage.from('medical-reports').remove([report.file_path]);
  }

  const { error } = await supabase
    .from('medical_reports')
    .delete()
    .eq('id', reportId);

  if (error) throw error;
}