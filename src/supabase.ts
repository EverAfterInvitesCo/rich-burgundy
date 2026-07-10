import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

// Get stored Supabase credentials
export function getSupabaseCredentials() {
  // Corrected: We look up the 'key name', not the value
  const url = localStorage.getItem('wedding_supabase_url') || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem('wedding_supabase_anon_key') || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
}

// Get or initialize Supabase Client
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false }
      });
      return supabaseClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

// Save credentials - This saves the actual values into storage
export function saveSupabaseCredentials(url: string, key: string) {
  localStorage.setItem('wedding_supabase_url', url.trim());
  localStorage.setItem('wedding_supabase_anon_key', key.trim());
  supabaseClient = null;
}

// Sync RSVP (Updated to match snake_case database columns)
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

  const { error } = await client
    .from('rsvps')
    .upsert({
      id: rsvp.id,
      guest_name: rsvp.guest_name,
      attending: rsvp.attending,
      dietary: rsvp.dietary || '',
      guests_count: rsvp.guests_count || 0,
      message: rsvp.message || '',
      created_at: rsvp.created_at
    });

  if (error) throw new Error(error.message);
}

// Sync Photo (Updated to match snake_case database columns)
export async function syncPhotoToSupabase(photo: {
  id: string;
  guest_name: string;
  photo_url: string;
  caption: string;
  created_at: string;
}) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');

  const { error } = await client
    .from('photos')
    .upsert({
      id: photo.id,
      guest_name: photo.guest_name,
      photo_url: photo.photo_url,
      caption: photo.caption || '',
      created_at: photo.created_at
    });

  if (error) throw new Error(error.message);
}

// Fetch Functions
export async function fetchSupabaseRsvps() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.from('rsvps').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchSupabasePhotos() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.from('photos').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
