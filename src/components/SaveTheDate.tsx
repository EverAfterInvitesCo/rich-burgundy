import React from "react";
import { motion } from "motion/react";
import { CountdownData } from "../types";

interface SaveTheDateProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
  countdown: CountdownData;
}

export default function SaveTheDate({ mediaErrors, handleMediaError, countdown }: SaveTheDateProps) {
  return (
    <section id="save-the-date" className="relative min-h-screen flex items-center bg-burgundy-900 overflow-hidden py-20 px-6 md:px-16">
      
      {/* Right Lace Asset Column - Placed directly as child of relative section for perfect corner alignment */}
      <div className="absolute top-0 right-0 z-0 pointer-events-none">
        {!mediaErrors["lace"] ? (
          <img 
            src="/media/lace.png" 
            alt="Elegant Lace Detail"
            onError={() => handleMediaError("lace")}
            className="w-32 sm:w-44 md:w-56 lg:w-64 h-auto object-contain object-top object-right opacity-95 block"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Elegant lace placeholder */
          <div className="w-32 h-32 bg-burgundy-950/40 flex items-center justify-center p-4 text-center border-l border-b border-gold-400/20 rounded-bl-2xl">
            <div className="space-y-2">
              <span className="text-[8px] text-gold-400 tracking-widest block uppercase">Lace Panel</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-8 relative z-10 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">SEPTEMBER 9, 2026</span>
            <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide">
              Save The Date
            </h2>
            <div className="h-[1px] w-20 bg-gold-400 mx-auto lg:mx-0 my-4" />
            <p className="text-burgundy-100 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Kindly mark your calendars and join us for an evening filled with laughter, love, and dance as we embark on our journey together forever.
            </p>
          </motion.div>

          {/* COUNTDOWN TIMER WIDGET */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto lg:mx-0 bg-burgundy-950/60 backdrop-blur-md border border-gold-400/20 p-5 rounded-2xl shadow-xl"
          >
            <div className="text-center">
              <span className="font-serif-lux text-3xl md:text-4xl font-bold text-gold-300 block">{countdown.days}</span>
              <span className="text-[9px] md:text-[10px] text-burgundy-200 uppercase tracking-widest">Days</span>
            </div>
            <div className="text-center">
              <span className="font-serif-lux text-3xl md:text-4xl font-bold text-gold-300 block">{countdown.hours}</span>
              <span className="text-[9px] md:text-[10px] text-burgundy-200 uppercase tracking-widest">Hours</span>
            </div>
            <div className="text-center">
              <span className="font-serif-lux text-3xl md:text-4xl font-bold text-gold-300 block">{countdown.minutes}</span>
              <span className="text-[9px] md:text-[10px] text-burgundy-200 uppercase tracking-widest">Mins</span>
            </div>
            <div className="text-center">
              <span className="font-serif-lux text-3xl md:text-4xl font-bold text-gold-300 block">{countdown.seconds}</span>
              <span className="text-[9px] md:text-[10px] text-burgundy-200 uppercase tracking-widest">Secs</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
