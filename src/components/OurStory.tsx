import React from "react";
import { motion } from "motion/react";

interface OurStoryProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function OurStory({ mediaErrors, handleMediaError }: OurStoryProps) {
  return (
    <section id="our-story" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      {/* Decorative Flower - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-64 md:w-96 pointer-events-none z-0">
        <img 
          src={`${import.meta.env.BASE_URL}media/flower.png`} 
          alt="Floral Detail" 
          onError={() => handleMediaError("flower")}
          className="w-full h-auto opacity-100"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-2xl mx-auto text-center space-y-8"
      >
        <div className="space-y-2">
          <span className="text-gold-300 tracking-[0.2em] text-xs uppercase">Our Journey</span>
          <h2 className="font-serif-lux text-4xl md:text-5xl text-white">Our Story</h2>
        </div>

        <div className="space-y-6 text-burgundy-100 font-light leading-relaxed max-w-lg mx-auto">
          <p>
            Yara and Ahmed’s paths first crossed beneath the warm, sunlit canopies of Cairo. 
            What began as a simple conversation over coffee quickly blossomed into an 
            inseparable connection, bound by shared dreams, endless laughter, and a profound 
            understanding of each other’s souls.
          </p>
          <p>
            Through long strolls along the majestic Nile, family gatherings, and support during 
            life’s seasons, they realized they had found their home in one another. Today, they 
            stand ready to pledge a lifetime of devotion and invite you to witness the beginning 
            of their forever.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
