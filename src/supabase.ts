import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('wedding_supabase_url') || '';
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('wedding_supabase_anon_key') || '';
  return { url, key };
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    supabaseClient = createClient(url, key, { auth: { persistSession: false } });
    return supabaseClient;
  }
  return null;
}

export async function syncRsvpToSupabase(rsvp: {
  id: string;
  guest_name: string;
  attending: boolean;
  dietary: string;
  guests_count: number;
  message: string;
  created_at: string;
}) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');
  const { error } = await client.from('rsvps').upsert(rsvp);
  if (error) throw new Error(error.message);
}
