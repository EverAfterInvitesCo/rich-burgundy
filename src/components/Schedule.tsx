import React from "react";
import { motion } from "motion/react";

interface ScheduleProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

const scheduleItems = [
  { time: "5:00 PM", title: "Guest Arrival", desc: "Welcome refreshments & light soft music under Heliopolis sun." },
  { time: "6:00 PM", title: "The Royal Zaffa", desc: "A traditional lively Egyptian drumming escort for Yara & Ahmed." },
  { time: "7:00 PM", title: "Grand Ceremony", desc: "The official ring exchange and matrimonial vows signing." },
  { time: "8:00 PM", title: "Gala Dinner", desc: "A curated gourmet feast featuring fine Egyptian & Mediterranean cuisine." },
  { time: "9:30 PM", title: "Cake & Dances", desc: "Traditional wedding cake cutting and opening of the dance floor." },
  { time: "11:30 PM", title: "The Send-off", desc: "Sparkler exit and final celebratory farewell as husband & wife." },
];

export default function Schedule({ mediaErrors, handleMediaError }: ScheduleProps) {
  return (
    <section id="schedule" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      
      {/* Re-adding Decorative Fan with explicit path check */}
      {!mediaErrors["fan"] && (
        <div className="absolute bottom-0 right-0 w-64 md:w-96 pointer-events-none z-0">
          <img 
            src={`${import.meta.env.BASE_URL}media/fan.png`} 
            alt="Decorative Fan" 
            onError={() => handleMediaError("fan")}
            className="w-full h-auto opacity-90"
          />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-gold-300 tracking-[0.2em] text-xs uppercase">The Celebration Flow</span>
          <h2 className="font-serif-lux text-4xl md:text-5xl text-white">Celebration Schedule</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {scheduleItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-burgundy-900/50 p-6 rounded-2xl border border-gold-900/20 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] tracking-widest text-gold-400 font-bold bg-burgundy-950 px-2 py-1 rounded">
                  {item.time}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              </div>
              <h3 className="text-xl font-serif-lux text-white mb-2">{item.title}</h3>
              <p className="text-burgundy-200 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
