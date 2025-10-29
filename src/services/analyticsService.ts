import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  pendingBills: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: totalPatients },
    { count: totalAppointments },
    { count: upcomingAppointments },
    { count: completedAppointments },
    { data: billing },
  ] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('appointment_date', today)
      .in('status', ['scheduled', 'confirmed']),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),
    supabase.from('billing').select('total_amount, status'),
  ]);

  const totalRevenue = billing
    ?.filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

  const pendingBills = billing
    ?.filter(b => b.status === 'pending' || b.status === 'overdue')
    .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

  return {
    totalPatients: totalPatients || 0,
    totalAppointments: totalAppointments || 0,
    upcomingAppointments: upcomingAppointments || 0,
    completedAppointments: completedAppointments || 0,
    totalRevenue,
    pendingBills,
  };
}

export interface AppointmentsByDay {
  date: string;
  count: number;
}

export async function getAppointmentsByWeek(): Promise<AppointmentsByDay[]> {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_date')
    .gte('appointment_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('appointment_date');

  if (error) throw error;

  const countsByDate: Record<string, number> = {};
  data?.forEach(apt => {
    countsByDate[apt.appointment_date] = (countsByDate[apt.appointment_date] || 0) + 1;
  });

  return Object.entries(countsByDate).map(([date, count]) => ({
    date,
    count,
  }));
}

export interface PatientsByCondition {
  condition: string;
  count: number;
}

export async function getPatientsByCondition(): Promise<PatientsByCondition[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('chronic_conditions')
    .eq('is_active', true);

  if (error) throw error;

  const conditionCounts: Record<string, number> = {};
  data?.forEach(patient => {
    patient.chronic_conditions?.forEach((condition: string) => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
  });

  return Object.entries(conditionCounts)
    .map(([condition, count]) => ({ condition, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export async function getRevenueByMonth(months = 6): Promise<RevenueByMonth[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('billing')
    .select('created_at, total_amount, status')
    .gte('created_at', startDate.toISOString())
    .eq('status', 'paid');

  if (error) throw error;

  const revenueByMonth: Record<string, number> = {};
  data?.forEach(bill => {
    const month = new Date(bill.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(bill.total_amount);
  });

  return Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getAuditLogs(limit = 50) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}