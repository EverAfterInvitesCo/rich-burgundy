import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to sync RSVP to Supabase
 * We remove the 'id' field entirely to let the DB auto-increment it.
 */
export async function syncRsvpToSupabase(rsvpData) {
  const { data, error } = await supabase
    .from('rsvps')
    .insert([
      {
        guest_name: rsvpData.guest_name,
        attending: rsvpData.attending,
        dietary: rsvpData.dietary,
        guests_count: rsvpData.guests_count,
        message: rsvpData.message,
        created_at: rsvpData.created_at
      }
    ]);

  if (error) {
    console.error('Supabase Error:', error);
    throw error;
  }
  return data;
}
