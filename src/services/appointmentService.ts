import { supabase } from '@/integrations/supabase/client';
import { Appointment, AppointmentStatus } from '@/types/database';

export async function createAppointment(data: {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_type: string;
  reason?: string;
  location?: string;
}) {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  const conflict = await checkAppointmentConflict(
    data.doctor_id,
    data.appointment_date,
    data.start_time,
    data.end_time
  );

  if (conflict) {
    throw new Error('Time slot is already booked');
  }

  const { data: appointment, error } = await supabase
    .from('appointments')
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
  return appointment;
}

export async function checkAppointmentConflict(
  doctorId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string
): Promise<boolean> {
  let query = supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', date)
    .neq('status', 'cancelled' as AppointmentStatus)
    .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

  if (excludeAppointmentId) {
    query = query.neq('id', excludeAppointmentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data && data.length > 0;
}

export async function getAppointmentsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAppointmentsByDoctor(doctorId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUpcomingAppointments(limit = 10) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .gte('appointment_date', today)
    .in('status', ['scheduled', 'confirmed'])
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppointment(
  appointmentId: string,
  updates: Partial<Appointment>
) {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      doctor:doctors(*, profile:profiles(*))
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAppointment(appointmentId: string) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId);

  if (error) throw error;
}