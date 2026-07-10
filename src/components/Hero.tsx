import React from "react";
import { Sparkle } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
  isVideoFile: (url: string) => boolean;
}

export default function Hero({ mediaErrors, handleMediaError, isVideoFile }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-burgundy-950">
      {/* Chandelier Video/Image Background */}
      <div className="absolute inset-0 z-0 bg-burgundy-950">
        {!mediaErrors["chandelier"] ? (
          isVideoFile("/media/chandelier.MOV") ? (
            <video 
              src="/media/chandelier.MOV" 
              autoPlay 
              loop 
              muted 
              playsInline
              onError={() => handleMediaError("chandelier")}
              className="w-full h-full object-contain opacity-100"
            />
          ) : (
            <img 
              src="/media/chandelier.MOV" 
              alt="Luxury Chandelier Background"
              onError={() => handleMediaError("chandelier")}
              className="w-full h-full object-contain opacity-100"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          /* Pure Luxury Chandelier Fallback Animation/Design */
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-900 via-burgundy-950 to-burgundy-950 flex flex-col items-center justify-start pt-24 opacity-90">
            {/* Dynamic styled CSS Chandelier chandelier */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-32 h-32 flex flex-col items-center relative opacity-20"
            >
              <div className="w-1 h-20 bg-gradient-to-b from-transparent via-gold-400 to-gold-300" />
              <div className="w-16 h-1 bg-gold-300 rounded-full" />
              <div className="flex gap-4 -mt-0.5">
                <span className="w-2 h-4 bg-gold-400 rounded-full animate-ping" />
                <span className="w-2 h-4 bg-gold-400 rounded-full" />
                <span className="w-2 h-4 bg-gold-400 rounded-full animate-ping" />
              </div>
            </motion.div>
          </div>
        )}
        {/* Overlay shading specifically covering the lower/burgundy parts matching plan.png layout */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
      </div>

      {/* Chandelier Text Overlay - "Yara and Ahmed are getting married" */}
      <div className="relative z-10 max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[480px] w-full mx-auto space-y-6 pt-32 px-4">

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-gold-300 text-[10px] sm:text-xs tracking-[0.2em] uppercase">
            <Sparkle className="w-2.5 h-2.5 fill-gold-400 text-gold-400 shrink-0" />
            <span className="truncate">THE CELEBRATION OF LOVE</span>
            <Sparkle className="w-2.5 h-2.5 fill-gold-400 text-gold-400 shrink-0" />
          </div>

          {/* Elegant White typography exactly over the burgundy part */}
          <h1 className="font-serif-lux text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight drop-shadow-md">
            Yara <span className="text-gold-200 font-serif-lux italic">&</span> Ahmed
          </h1>
          
          <h3 className="font-serif-lux text-sm sm:text-base md:text-lg text-gold-100 tracking-[0.15em] font-light mt-4 drop-shadow">
            ARE GETTING MARRIED
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="pt-16 flex flex-col items-center gap-2 text-gold-300/60 font-serif-lux tracking-[0.15em] text-xs"
        >
          <span>SCROLL TO DISCOVER</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-6 bg-gradient-to-b from-gold-400 to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
