import React from "react";
import { motion } from "motion/react";

interface OurStoryProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function OurStory({ mediaErrors, handleMediaError }: OurStoryProps) {
  return (
    <section id="our-story" className="relative min-h-screen flex items-center bg-burgundy-950 overflow-hidden py-24 px-6 md:px-16">
      
      {/* Flowers decoration overlay on bottom left */}
      <div className="absolute bottom-0 left-0 w-80 md:w-96 z-0 pointer-events-none opacity-80">
        {!mediaErrors["flowers"] ? (
          <img 
            src="/media/flowers.png" 
            alt="Floral decoration"
            onError={() => handleMediaError("flowers")}
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback vector style flowers styling using CSS in left corner */
          <div className="absolute bottom-0 left-0 p-8 text-[11px] text-gold-400/40 select-none font-serif-lux">
            🌹 Upload '/media/flowers.png'
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto w-full relative z-10 text-center space-y-8">

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">OUR JOURNEY</span>
            <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide">
              Our Story
            </h2>
            <div className="h-[1px] w-20 bg-gold-400 mx-auto my-4" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-4 text-burgundy-100/90 text-sm md:text-base leading-relaxed font-light"
          >
            <p>
              Yara and Ahmed's paths first crossed beneath the warm, sunlit canopies of Cairo. What began as a simple conversation over coffee quickly blossomed into an inseparable connection, bound by shared dreams, endless laughter, and a profound understanding of each other's souls.
            </p>
            <p>
              Through long strolls along the majestic Nile, family gatherings, and support during life's seasons, they realized they had found their home in one another. Today, they stand ready to pledge a lifetime of devotion and invite you to witness the beginning of their forever.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
