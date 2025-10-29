import { supabase } from '@/integrations/supabase/client';

export async function encryptField(plainText: string): Promise<string> {
  const { data, error } = await supabase.rpc('encrypt_text', {
    plain_text: plainText
  });

  if (error) throw error;
  return data;
}

export async function decryptField(encryptedText: string): Promise<string> {
  const { data, error } = await supabase.rpc('decrypt_text', {
    encrypted_text: encryptedText
  });

  if (error) throw error;
  return data;
}