import React from "react";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

export default function EventDetails() {
  return (
    <section id="event-details" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      
      {/* Fixed Goose Positioned in Bottom Right */}
      <div className="absolute bottom-4 right-4 w-32 md:w-48 pointer-events-none z-0">
        <img 
          src={`${import.meta.env.BASE_URL}media/goose.png`} 
          alt="Decorative Goose" 
          className="w-full h-auto"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-gold-300 tracking-[0.2em] text-xs uppercase">Where & When</span>
            <h2 className="font-serif-lux text-4xl md:text-5xl text-white">Event Details</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-burgundy-900/50 p-6 rounded-2xl border border-gold-900/20 flex gap-4">
              <Calendar className="text-gold-400 shrink-0" />
              <div>
                <h3 className="text-gold-200 font-medium">The Wedding Date</h3>
                <p className="text-burgundy-200 text-sm mt-1">Wednesday, September 9, 2026</p>
                <p className="text-gold-500 text-xs mt-1">Gates open at 5:00 PM | Ceremony begins at 6:00 PM</p>
              </div>
            </div>

            <div className="bg-burgundy-900/50 p-6 rounded-2xl border border-gold-900/20 flex gap-4">
              <MapPin className="text-gold-400 shrink-0" />
              <div>
                <h3 className="text-gold-200 font-medium">The Royal Hall, Cairo</h3>
                <p className="text-burgundy-200 text-sm mt-1">The Baron Palace Grand Lawn & Hall, Heliopolis, Egypt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Google Maps Embed */}
        <div className="bg-burgundy-900/30 p-2 rounded-2xl border border-gold-900/20 h-[300px] w-full overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.124673808064!2d31.32395537568551!3d30.082729315668146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e7428f731a5%3A0xe51f0445d045c719!2sBaron%20Empain%20Palace!5e0!3m2!1sen!2seg!4v1720637158732!5m2!1sen!2seg" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
