import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hero from "./components/Hero";
import SaveTheDate from "./components/SaveTheDate";
import OurStory from "./components/OurStory";
import EventDetails from "./components/EventDetails";
import Schedule from "./components/Schedule";
import RSVP from "./components/RSVP";
import GuestGallery from "./components/GuestGallery";

export default function App() {
  const [curtainEnded, setCurtainEnded] = useState(false);
  const [skipCurtain, setSkipCurtain] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const [rsvpForm, setRsvpForm] = useState({ guestName: "", attending: true, dietary: "", guestsCount: 0, message: "" });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [uploaderName, setUploaderName] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photosList, setPhotosList] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const isVideoFile = (url: string) => {
    const trimmed = url.toLowerCase().split('?')[0];
    return trimmed.endsWith(".mp4") || trimmed.endsWith(".webm");
  };

  const handleMediaError = (key: string) => setMediaErrors((prev) => ({ ...prev, [key]: true }));
  const showMainSite = curtainEnded || skipCurtain;

  useEffect(() => {
    if (showMainSite && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [showMainSite]);

  return (
    <div className="min-h-screen bg-burgundy-950 text-burgundy-50 font-sans relative overflow-x-hidden">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}media/sparks.mp3`}
        loop
        preload="auto"
      />

      <AnimatePresence>
        {!showMainSite && (
          <motion.div 
            key="curtains-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy-950 overflow-hidden"
          >
            <video 
              src={`${import.meta.env.BASE_URL}media/curtains.mp4`}
              autoPlay 
              muted 
              playsInline
              onEnded={() => setCurtainEnded(true)}
              onError={() => handleMediaError("curtains")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button 
              onClick={() => setSkipCurtain(true)}
              className="relative z-10 text-gold-300 border border-gold-300 px-8 py-3 rounded-full hover:bg-gold-300 hover:text-burgundy-950 transition-all uppercase tracking-widest text-sm"
            >
              Enter Wedding
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showMainSite && (
        <div className="relative">
          <Hero mediaErrors={mediaErrors} handleMediaError={handleMediaError} isVideoFile={isVideoFile} />
          <SaveTheDate mediaErrors={mediaErrors} handleMediaError={handleMediaError} countdown={{ days: 0, hours: 0, minutes: 0, seconds: 0 }} />
          <OurStory mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
          <EventDetails />
          <Schedule mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
          <RSVP 
            rsvpForm={rsvpForm} 
            setRsvpForm={setRsvpForm} 
            rsvpSubmitting={rsvpSubmitting} 
            rsvpSuccess={rsvpSuccess} 
            setRsvpSuccess={setRsvpSuccess} 
            handleRsvpSubmit={() => {}} 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
          />
          <GuestGallery 
            uploaderName={uploaderName} 
            setUploaderName={setUploaderName} 
            photoCaption={photoCaption} 
            setPhotoCaption={setPhotoCaption} 
            photoBase64={photoBase64} 
            isUploadingPhoto={isUploadingPhoto} 
            fileInputRef={fileInputRef} 
            handlePhotoSelect={() => {}} 
            handlePhotoSubmit={() => {}} 
            photosList={photosList} 
            selectedPhoto={selectedPhoto} 
            setSelectedPhoto={setSelectedPhoto} 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
          />
        </div>
      )}
    </div>
  );
}
