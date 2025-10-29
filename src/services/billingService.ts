import { supabase } from '@/integrations/supabase/client';
import { Billing, BillingStatus } from '@/types/database';

export async function createBilling(data: {
  patient_id: string;
  appointment_id?: string;
  amount: number;
  tax_amount?: number;
  services: Record<string, any>;
  due_date: string;
  insurance_claim_encrypted?: string;
}) {
  const invoiceNumber = await generateInvoiceNumber();
  const taxAmount = data.tax_amount || 0;
  const totalAmount = data.amount + taxAmount;

  const { data: billing, error } = await supabase
    .from('billing')
    .insert([{
      ...data,
      invoice_number: invoiceNumber,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    }])
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      appointment:appointments(*, doctor:doctors(*, profile:profiles(*)))
    `)
    .single();

  if (error) throw error;
  return billing;
}

export async function getBillingByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('billing')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      appointment:appointments(*, doctor:doctors(*, profile:profiles(*)))
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPendingBilling() {
  const { data, error } = await supabase
    .from('billing')
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      appointment:appointments(*, doctor:doctors(*, profile:profiles(*)))
    `)
    .in('status', ['pending', 'overdue'])
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateBillingStatus(
  billingId: string,
  status: BillingStatus,
  paymentMethod?: string
) {
  const updates: Partial<Billing> = { status };

  if (status === 'paid') {
    updates.paid_at = new Date().toISOString();
    if (paymentMethod) {
      updates.payment_method = paymentMethod;
    }
  }

  const { data, error } = await supabase
    .from('billing')
    .update(updates)
    .eq('id', billingId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      appointment:appointments(*, doctor:doctors(*, profile:profiles(*)))
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBilling(
  billingId: string,
  updates: Partial<Billing>
) {
  const { data, error } = await supabase
    .from('billing')
    .update(updates)
    .eq('id', billingId)
    .select(`
      *,
      patient:patients(*, profile:profiles(*)),
      appointment:appointments(*, doctor:doctors(*, profile:profiles(*)))
    `)
    .single();

  if (error) throw error;
  return data;
}

async function generateInvoiceNumber(): Promise<string> {
  const { count } = await supabase
    .from('billing')
    .select('*', { count: 'exact', head: true });

  const invoiceCount = (count || 0) + 1;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return `INV-${year}${month}-${String(invoiceCount).padStart(5, '0')}`;
}