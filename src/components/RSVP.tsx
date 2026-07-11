import React from 'react';
import { syncRsvpToSupabase } from '../supabase';

export default function RSVP({ 
  rsvpForm, 
  setRsvpForm, 
  rsvpSubmitting, 
  setRsvpSuccess, 
  mediaErrors, 
  handleMediaError 
}: any) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await syncRsvpToSupabase({
        guest_name: rsvpForm.guestName,
        attending: rsvpForm.attending,
        dietary: rsvpForm.dietary,
        guests_count: rsvpForm.guestsCount,
        message: rsvpForm.message,
        created_at: new Date().toISOString()
      });
      
      alert('RSVP sent successfully!');
      setRsvpSuccess(true);
      // Reset form fields
      setRsvpForm({ guestName: '', attending: true, guestsCount: 0, dietary: '', message: '' });
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Failed to send RSVP. Please check the console.');
    }
  };

  return (
    // The max-w-lg and mx-auto were removed so this fits in the flex container
    <div className="bg-burgundy-900 p-8 rounded-xl border border-burgundy-700 w-full shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Full Name</label>
          <input 
            className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100 focus:border-gold-400 outline-none transition"
            value={rsvpForm.guestName} 
            onChange={(e) => setRsvpForm({...rsvpForm, guestName: e.target.value})} 
            placeholder="e.g., Karim El-Shamy" 
            required 
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Are you attending?</label>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => setRsvpForm({...rsvpForm, attending: true})}
              className={`flex-1 p-3 rounded font-sans transition ${rsvpForm.attending ? 'bg-gold-400 text-burgundy-950 font-bold' : 'bg-burgundy-950 border border-burgundy-700'}`}
            >YES, ATTENDING</button>
            <button 
              type="button" 
              onClick={() => setRsvpForm({...rsvpForm, attending: false})}
              className={`flex-1 p-3 rounded font-sans transition ${!rsvpForm.attending ? 'bg-gold-400 text-burgundy-950 font-bold' : 'bg-burgundy-950 border border-burgundy-700'}`}
            >NO, DECLINING</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Extra Guests</label>
            <select 
              className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100"
              value={rsvpForm.guestsCount} 
              onChange={(e) => setRsvpForm({...rsvpForm, guestsCount: parseInt(e.target.value)})}
            >
              <option value={0}>Just Me (0 guests)</option>
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Dietary</label>
            <input 
              className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100 focus:border-gold-400 outline-none"
              value={rsvpForm.dietary} 
              onChange={(e) => setRsvpForm({...rsvpForm, dietary: e.target.value})} 
              placeholder="e.g., Gluten Free" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Congratulatory Note</label>
          <textarea 
            className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100 h-24 focus:border-gold-400 outline-none"
            value={rsvpForm.message} 
            onChange={(e) => setRsvpForm({...rsvpForm, message: e.target.value})}
            placeholder="Write a sweet message..."
          />
        </div>

        <button 
          type="submit" 
          disabled={rsvpSubmitting}
          className="w-full bg-gold-400 hover:bg-gold-500 text-burgundy-950 font-bold py-4 rounded transition uppercase tracking-widest mt-2"
        >
          {rsvpSubmitting ? 'SUBMITTING...' : 'SUBMIT RSVP ANSWER'}
        </button>
      </form>
    </div>
  );
}
