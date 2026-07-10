import React from "react";
import { motion } from "motion/react";

interface ScheduleProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function Schedule({ mediaErrors, handleMediaError }: ScheduleProps) {
  return (
    <section id="schedule" className="relative min-h-screen flex items-center bg-burgundy-950 overflow-hidden py-24 px-6 md:px-16">
      
      {/* Fan decoration overlay on bottom right */}
      <div className="absolute bottom-0 right-0 w-80 md:w-96 z-0 pointer-events-none opacity-80">
        {!mediaErrors["fan"] ? (
          <img 
            src="/media/fan.png" 
            alt="Fan decorations"
            onError={() => handleMediaError("fan")}
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback fan text */
          <div className="absolute bottom-0 right-0 p-8 text-[11px] text-gold-400/40 select-none font-serif-lux">
            🪭 Upload '/media/fan.png'
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">THE CELEBRATION FLOW</span>
          <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide">
            Celebration Schedule
          </h2>
          <div className="h-[1px] w-20 bg-gold-400 mx-auto my-4" />
        </div>

        {/* Interactive Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {[
            { time: "5:00 PM", title: "Guest Arrival", desc: "Welcome refreshments & light soft music under Heliopolis sun." },
            { time: "6:00 PM", title: "The Royal Zaffa", desc: "A traditional lively Egyptian drumming escort for Yara & Ahmed." },
            { time: "7:00 PM", title: "Grand Ceremony", desc: "The official ring exchange and matrimonial vows signing." },
            { time: "8:00 PM", title: "Gala Dinner", desc: "A curated gourmet feast featuring fine Egyptian & Mediterranean cuisine." },
            { time: "9:30 PM", title: "Cake & Dances", desc: "Traditional wedding cake cutting and opening of the dance floor." },
            { time: "11:30 PM", title: "The Send-off", desc: "Sparkler exit and final celebratory farewell as husband & wife." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="bg-burgundy-900/50 border border-gold-400/10 p-6 rounded-2xl hover:border-gold-400/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-gold-400 font-semibold bg-burgundy-950 px-3 py-1 rounded-full border border-gold-400/10">
                  {item.time}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 group-hover:scale-150 transition-transform" />
              </div>
              <h4 className="font-serif-lux text-lg text-white font-medium group-hover:text-gold-200 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-burgundy-100/70 leading-relaxed mt-2">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
