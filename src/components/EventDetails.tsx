import React from "react";
import { MapPin, Calendar } from "lucide-react";

export default function EventDetails() {
  return (
    <section id="event-details" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      {/* Decorative Goose - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-48 md:w-72 pointer-events-none z-0 opacity-80">
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
                <p className="text-gold-500 text-xs mt-1">Heliopolis Palace District, Cairo Governor, Egypt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-burgundy-900/30 p-4 rounded-2xl border border-gold-900/20 h-full min-h-[300px] flex items-center justify-center">
          <p className="text-gold-400/50 font-serif-lux italic">Map Loading...</p>
        </div>
      </div>
    </section>
  );
}
