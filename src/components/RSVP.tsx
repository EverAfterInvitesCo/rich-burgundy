import React, { useState } from 'react';
// We use a relative path that looks specifically for the file in the parent directory
import { syncRsvpToSupabase } from '../supabase';

export default function RSVP() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await syncRsvpToSupabase({
        id: Math.random().toString(36).substring(2, 15),
        guest_name: name,
        attending: true,
        dietary: '',
        guests_count: 1,
        message: '',
        created_at: new Date().toISOString()
      });
      alert('RSVP sent successfully!');
      setName('');
    } catch (err) {
      console.error('Submission Error:', err);
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
