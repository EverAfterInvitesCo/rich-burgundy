import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SaveTheDateProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function SaveTheDate({ mediaErrors, handleMediaError }: SaveTheDateProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-09-19T00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="save-the-date" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      {/* Clear Decorative Lace Panel on the Right */}
      <div className="absolute top-0 right-0 h-full w-48 md:w-64 pointer-events-none">
        <img 
          src={`${import.meta.env.BASE_URL}media/lace.png`} 
          alt="Lace Detail" 
          onError={() => handleMediaError("lace")}
          className="w-full h-full object-cover object-left opacity-100"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-xl mx-auto text-center space-y-8"
      >
        <div className="space-y-2">
          <span className="text-gold-300 tracking-[0.2em] text-xs uppercase">September 19, 2026</span>
          <h2 className="font-serif-lux text-4xl md:text-5xl text-white">Save The Date</h2>
        </div>

        <p className="text-burgundy-200 max-w-lg mx-auto font-light leading-relaxed">
          Kindly mark your calendars and join us for an evening filled with laughter, love, and dance as we embark on our journey together forever.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mt-8 bg-burgundy-900/50 p-6 rounded-2xl border border-gold-900/20">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINS", value: timeLeft.minutes },
            { label: "SECS", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif-lux text-gold-200">{item.value}</span>
              <span className="text-[10px] tracking-widest text-gold-400/70 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
