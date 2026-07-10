import React from "react";
import { motion } from "motion/react";

interface OurStoryProps {
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function OurStory({ mediaErrors, handleMediaError }: OurStoryProps) {
  return (
    <section id="our-story" className="relative py-24 px-6 bg-burgundy-950 overflow-hidden">
      {/* Decorative Corner Lace - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-32 md:w-64 opacity-40 pointer-events-none transform rotate-180">
        <img 
          src={`${import.meta.env.BASE_URL}media/lace.png`} 
          alt="Lace Detail" 
          onError={() => handleMediaError("lace")}
          className="w-full h-auto"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <div className="space-y-2">
          <span className="text-gold-300 tracking-[0.2em] text-xs uppercase">Our Journey</span>
          <h2 className="font-serif-lux text-4xl md:text-5xl text-white">How It Started</h2>
        </div>

        <div className="space-y-6 text-burgundy-200 font-light leading-relaxed max-w-lg mx-auto">
          <p>
            It all began with a simple moment that turned into a lifetime of shared dreams. 
            From our first conversation, we knew we had found something truly special.
          </p>
          <p>
            Through every laughter, every challenge, and every milestone, our bond has 
            only grown stronger. We are so excited to begin this new chapter together.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
