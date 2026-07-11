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
      await syncRsvpToSupabase({
        id: Math.random().toString(36).substring(2, 15),
        guest_name: formData.name,
        attending: formData.attending,
        dietary: formData.dietary,
        guests_count: formData.guests_count,
        message: formData.message,
        created_at: new Date().toISOString()
      });
      alert('RSVP sent successfully!');
      // Reset form
      setFormData({ name: '', attending: true, guests_count: 0, dietary: '', message: '' });
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Failed to send RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-header">
        <h2>Confirm Attendance</h2>
        <p>Please RSVP by August 15, 2026.</p>
      </div>

      <form onSubmit={handleSubmit} className="rsvp-form">
        <label>FULL NAME</label>
        <input 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          placeholder="e.g., Karim El-Shamy" 
          required 
        />

        <label>ARE YOU ATTENDING?</label>
        <div className="attending-buttons">
          <button type="button" onClick={() => setFormData({...formData, attending: true})}>YES, ATTENDING</button>
          <button type="button" onClick={() => setFormData({...formData, attending: false})}>NO, DECLINING</button>
        </div>

        <div className="form-row">
          <div>
            <label>EXTRA GUESTS</label>
            <select value={formData.guests_count} onChange={(e) => setFormData({...formData, guests_count: parseInt(e.target.value)})}>
              <option value={0}>Just Me (0 guests)</option>
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
            </select>
          </div>
          <div>
            <label>DIETARY REQUIREMENTS</label>
            <input 
              value={formData.dietary} 
              onChange={(e) => setFormData({...formData, dietary: e.target.value})} 
              placeholder="e.g., Vegetarian, Gluten Free" 
            />
          </div>
        </div>

        <label>CONGRATULATORY NOTE</label>
        <textarea 
          value={formData.message} 
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Write a sweet message to Yara & Ahmed..."
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT RSVP ANSWER'}
        </button>
      </form>
    </div>
  );
}
