import React, { useState } from 'react';
import { syncRsvpToSupabase } from '../supabase';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    attending: true,
    guests_count: 0,
    dietary: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ID removed: Database handles auto-incrementing 'bigint' IDs automatically
      await syncRsvpToSupabase({
        guest_name: formData.name,
        attending: formData.attending,
        dietary: formData.dietary,
        guests_count: formData.guests_count,
        message: formData.message,
        created_at: new Date().toISOString()
      });
      
      alert('RSVP sent successfully!');
      // Reset form fields
      setFormData({ name: '', attending: true, guests_count: 0, dietary: '', message: '' });
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Failed to send RSVP. Please check the console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-burgundy-900 p-8 rounded-xl border border-burgundy-700 max-w-lg mx-auto shadow-2xl">
      <h2 className="font-serif-lux text-3xl text-gold-400 mb-6 text-center">Confirm Attendance</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Full Name</label>
          <input 
            className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100 focus:border-gold-400 outline-none transition"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g., Karim El-Shamy" 
            required 
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Are you attending?</label>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, attending: true})}
              className={`flex-1 p-3 rounded font-sans transition ${formData.attending ? 'bg-gold-400 text-burgundy-950 font-bold' : 'bg-burgundy-950 border border-burgundy-700'}`}
            >YES, ATTENDING</button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, attending: false})}
              className={`flex-1 p-3 rounded font-sans transition ${!formData.attending ? 'bg-gold-400 text-burgundy-950 font-bold' : 'bg-burgundy-950 border border-burgundy-700'}`}
            >NO, DECLINING</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Extra Guests</label>
            <select 
              className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100"
              value={formData.guests_count} 
              onChange={(e) => setFormData({...formData, guests_count: parseInt(e.target.value)})}
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
              value={formData.dietary} 
              onChange={(e) => setFormData({...formData, dietary: e.target.value})} 
              placeholder="e.g., Gluten Free" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-burgundy-300 mb-2">Congratulatory Note</label>
          <textarea 
            className="w-full bg-burgundy-950 border border-burgundy-700 p-3 rounded text-burgundy-100 h-24 focus:border-gold-400 outline-none"
            value={formData.message} 
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Write a sweet message..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gold-400 hover:bg-gold-500 text-burgundy-950 font-bold py-4 rounded transition uppercase tracking-widest mt-2"
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT RSVP ANSWER'}
        </button>
      </form>
    </div>
  );
}
