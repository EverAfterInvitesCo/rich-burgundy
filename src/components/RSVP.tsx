import React, { useState } from 'react';
import { syncRsvpToSupabase } from '../lib/supabase';

export function RSVPForm() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked!"); // Check if this shows in console
    
    setIsSubmitting(true);

    try {
      // Small delay or check to ensure client is ready
      await syncRsvpToSupabase({
        id: crypto.randomUUID(),
        guest_name: name,
        attending: true,
        dietary: '',
        guests_count: 1,
        message: '',
        created_at: new Date().toISOString()
      });
      
      console.log("Supabase sync successful!");
      alert('RSVP sent successfully!');
      setName(''); // Clear form on success
    } catch (err) {
      console.error("Submission Error:", err); // Look here if it reloads
      alert('Failed to send RSVP. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Guest Name" 
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Submit RSVP'}
      </button>
    </form>
  );
}
