import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, RefreshCw } from "lucide-react";

interface RSVPProps {
  rsvpForm: {
    guestName: string;
    attending: boolean;
    dietary: string;
    guestsCount: number;
    message: string;
  };
  setRsvpForm: React.Dispatch<React.SetStateAction<{
    guestName: string;
    attending: boolean;
    dietary: string;
    guestsCount: number;
    message: string;
  }>>;
  rsvpSubmitting: boolean;
  rsvpSuccess: boolean;
  setRsvpSuccess: (val: boolean) => void;
  handleRsvpSubmit: (e: React.FormEvent) => void;
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function RSVP({
  rsvpForm,
  setRsvpForm,
  rsvpSubmitting,
  rsvpSuccess,
  setRsvpSuccess,
  handleRsvpSubmit,
  mediaErrors,
  handleMediaError
}: RSVPProps) {
  return (
    <section id="rsvp" className="relative min-h-screen flex items-center bg-burgundy-900 overflow-hidden py-24 px-6 md:px-16">
      
      {/* Tassles decoration overlay on the left */}
      <div className="absolute top-0 bottom-0 left-0 w-36 md:w-48 z-0 pointer-events-none opacity-90 flex flex-col justify-start pt-12">
        {!mediaErrors["tassles"] ? (
          <img 
            src="/media/tassles.png" 
            alt="Tassles accent decoration"
            onError={() => handleMediaError("tassles")}
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback tassles text */
          <div className="p-8 text-[11px] text-gold-400/40 select-none font-serif-lux">
            🎗️ Upload '/media/tassles.png'
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Column intro */}
        <div className="md:col-span-5 space-y-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">JOIN US</span>
            <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide leading-tight">
              Confirm Attendance
            </h2>
            <div className="h-[1px] w-20 bg-gold-400 mx-auto md:mx-0 my-4" />
            <p className="text-burgundy-100 text-xs md:text-sm leading-relaxed">
              Please RSVP by August 15, 2026. Your presence would make our celebrations infinitely complete.
            </p>
          </motion.div>
        </div>

        {/* Right Column RSVP Card Form */}
        <div className="md:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-burgundy-950 border border-gold-400/20 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Success Screen */}
            <AnimatePresence mode="wait">
              {rsvpSuccess ? (
                <motion.div 
                  key="rsvp-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-6 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full border border-gold-400 text-gold-400 flex items-center justify-center bg-burgundy-900 shadow-lg">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif-lux text-2xl text-gold-200">Shukran, RSVP Saved!</h3>
                    <p className="text-xs text-burgundy-200 max-w-sm">We are incredibly excited to celebrate Yara & Ahmed's beautiful wedding day together with you.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setRsvpSuccess(false)}
                    className="px-4 py-2 border border-gold-400/30 rounded-lg text-gold-300 text-xs hover:bg-gold-400/10 transition-colors"
                  >
                    Submit Another RSVP
                  </button>
                </motion.div>
              ) : (
                /* RSVP Form fields */
                <form key="rsvp-form" onSubmit={handleRsvpSubmit} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., Karim El-Shamy"
                      value={rsvpForm.guestName}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guestName: e.target.value })}
                      className="w-full bg-burgundy-900 border border-gold-400/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder-burgundy-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Are you attending?</label>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button 
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attending: true })}
                        className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                          rsvpForm.attending 
                            ? "bg-gold-400 border-gold-400 text-burgundy-950 shadow-md" 
                            : "bg-burgundy-900 border-gold-400/10 text-gold-200/80 hover:bg-burgundy-900/60"
                        }`}
                      >
                        YES, ATTENDING
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRsvpForm({ ...rsvpForm, attending: false })}
                        className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                          !rsvpForm.attending 
                            ? "bg-rose-600 border-rose-600 text-white shadow-md" 
                            : "bg-burgundy-900 border-gold-400/10 text-gold-200/80 hover:bg-burgundy-900/60"
                        }`}
                      >
                        NO, DECLINING
                      </button>
                    </div>
                  </div>

                  {rsvpForm.attending && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Extra Guests Accompanying</label>
                          <select 
                            value={rsvpForm.guestsCount}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, guestsCount: Number(e.target.value) })}
                            className="w-full bg-burgundy-900 border border-gold-400/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white"
                          >
                            <option value={0}>Just Me (0 guests)</option>
                            <option value={1}>+ 1 guest</option>
                            <option value={2}>+ 2 guests</option>
                            <option value={3}>+ 3 guests</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Dietary Requirements</label>
                          <input 
                            type="text"
                            placeholder="e.g., Vegetarian, Gluten Free"
                            value={rsvpForm.dietary}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, dietary: e.target.value })}
                            className="w-full bg-burgundy-900 border border-gold-400/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder-burgundy-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Congratulatory Note</label>
                    <textarea 
                      rows={3}
                      placeholder="Write a sweet message to Yara & Ahmed..."
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                      className="w-full bg-burgundy-900 border border-gold-400/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder-burgundy-300 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={rsvpSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:opacity-50 text-burgundy-950 font-bold rounded-xl text-xs tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {rsvpSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        SUBMIT RSVP ANSWER
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
