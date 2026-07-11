import { createClient } from '@supabase/supabase-js';

// Ensure your .env file has these variables set correctly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Synchronizes RSVP form data to the 'rsvps' table in Supabase.
 * The 'id' column is omitted here because it is set as an 
 * 'Identity' column in the database, meaning it auto-increments automatically.
 */
export async function syncRsvpToSupabase(rsvpData) {
  try {
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
      console.error('Supabase Error Details:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Submission Logic Error:', err);
    throw err;
  }
}
