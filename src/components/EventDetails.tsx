import React from "react";
import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";

export default function EventDetails() {
  return (
    <section id="event-details" className="relative min-h-screen flex items-center bg-burgundy-900 overflow-hidden py-24 px-6 md:px-16">
      
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Event details */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">WHERE & WHEN</span>
            <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide">
              Event Details
            </h2>
            <div className="h-[1px] w-20 bg-gold-400 mx-auto lg:mx-0 my-4" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="space-y-6 text-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 bg-burgundy-950/40 border border-gold-400/10 p-5 rounded-2xl">
              <div className="p-3 bg-burgundy-900 border border-gold-400/20 text-gold-400 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1 md:text-left">
                <h4 className="font-serif-lux text-lg text-gold-200">The Wedding Date</h4>
                <p className="text-burgundy-100">Wednesday, September 9, 2026</p>
                <p className="text-xs text-burgundy-300">Gates open at 5:00 PM | Ceremony begins at 6:00 PM</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-burgundy-950/40 border border-gold-400/10 p-5 rounded-2xl">
              <div className="p-3 bg-burgundy-900 border border-gold-400/20 text-gold-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1 md:text-left">
                <h4 className="font-serif-lux text-lg text-gold-200">The Royal Hall, Cairo</h4>
                <p className="text-burgundy-100">The Baron Palace Grand Lawn & Hall, Heliopolis, Egypt</p>
                <p className="text-xs text-burgundy-300">Heliopolis Palace District, Cairo Governor, Egypt</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Google Maps Embed and Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <div className="border border-gold-400/20 rounded-2xl overflow-hidden shadow-2xl bg-burgundy-950 h-72">
            <iframe 
              title="Google Maps Venue Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.339794301646!2d31.33005822535496!3d30.086431974903332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e2e02df35ef%3A0xc66c1b3f9bfbe1bb!2sBaron%20Empain%20Palace!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "contrast(1.1) brightness(0.9)" }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <a 
            href="https://maps.app.goo.gl/9TqNfE8uYy6T8gYn7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-burgundy-950 font-bold rounded-xl text-center flex items-center justify-center gap-2 text-xs tracking-wider transition-all shadow-md cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            GET DIRECTIONS ON GOOGLE MAPS
          </a>
        </motion.div>

      </div>
    </section>
  );
}
