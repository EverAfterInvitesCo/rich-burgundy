import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Lock, 
  Instagram, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  addRsvp, 
  getRsvps, 
  deleteRsvp, 
  addPhoto, 
  subscribeToPhotos, 
  deletePhoto 
} from "./firebase";
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  syncRsvpToSupabase,
  syncPhotoToSupabase,
  deleteRsvpFromSupabase,
  deletePhotoFromSupabase,
  fetchSupabaseRsvps,
  fetchSupabasePhotos
} from "./supabase";

// Import modular wedding site sections
import Hero from "./components/Hero";
import SaveTheDate from "./components/SaveTheDate";
import OurStory from "./components/OurStory";
import EventDetails from "./components/EventDetails";
import Schedule from "./components/Schedule";
import RSVP from "./components/RSVP";
import GuestGallery from "./components/GuestGallery";
import OrganizerPortal from "./components/OrganizerPortal";

const SAMPLE_GALLERY = [
  {
    id: "sample-1",
    guestName: "Yara & Ahmed",
    caption: "Our Engagement Session in Cairo",
    photoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "sample-2",
    guestName: "Nour & Karim",
    caption: "Can't wait to celebrate with you!",
    photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "sample-3",
    guestName: "Ever After Invites",
    caption: "Perfect day for a perfect couple",
    photoUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [curtainEnded, setCurtainEnded] = useState(false);
  const [skipCurtain, setSkipCurtain] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpForm, setRsvpForm] = useState({ guestName: "", attending: true, dietary: "", guestsCount: 0, message: "" });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [uploaderName, setUploaderName] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photosList, setPhotosList] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [organizerPasscode, setOrganizerPasscode] = useState("");
  const [isOrganizerAuthed, setIsOrganizerAuthed] = useState(false);
  const [rsvpsList, setRsvpsList] = useState<any[]>([]);
  const [adminPhotosList, setAdminPhotosList] = useState<any[]>([]);
  const [organizerError, setOrganizerError] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState("");
  const [supabaseTestLoading, setSupabaseTestLoading] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [supabaseSyncError, setSupabaseSyncError] = useState("");
  const [supabaseSyncSuccess, setSupabaseSyncSuccess] = useState("");
  const [currentBackend, setCurrentBackend] = useState<"firebase" | "supabase">("firebase");
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
    }
  };

  useEffect(() => {
    const showMain = curtainEnded || skipCurtain;
    if (showMain && audioRef.current) {
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [curtainEnded, skipCurtain]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) setScrollProgress(window.scrollY / totalHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-09-09T18:00:00+02:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMediaError = (key: string) => setMediaErrors((prev) => ({ ...prev, [key]: true }));

  const isVideoFile = (url: string) => {
    const trimmed = url.toLowerCase().split('?')[0];
    return trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.endsWith(".mov");
  };

  const showMainSite = curtainEnded || skipCurtain;

  return (
    <div className="min-h-screen bg-burgundy-950 text-burgundy-50 font-sans relative overflow-x-hidden selection:bg-gold-500 selection:text-burgundy-950">
      
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
            transition={{ duration: 0.7, ease: "easeInOut" }}
            onClick={() => setSkipCurtain(true)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-burgundy-950 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full object-cover">
              {!mediaErrors["curtains"] ? (
                isVideoFile(`${import.meta.env.BASE_URL}media/curtains.MOV`) ? (
                  <video 
                    src={`${import.meta.env.BASE_URL}media/curtains.MOV`}
                    autoPlay 
                    muted 
                    playsInline
                    onEnded={() => setCurtainEnded(true)}
                    onError={() => handleMediaError("curtains")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={`${import.meta.env.BASE_URL}media/curtains.MOV`} 
                    alt="Wedding Curtains"
                    onError={() => handleMediaError("curtains")}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950 via-burgundy-800 to-burgundy-950 flex justify-between opacity-95">
                  <div className="w-1/2 h-full border-r border-gold-300/30 shadow-2xl" />
                  <div className="w-1/2 h-full border-l border-gold-300/30 shadow-2xl" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showMainSite && (
        <div className="relative">
          {/* Main sections remain unchanged... */}
          <Hero mediaErrors={mediaErrors} handleMediaError={handleMediaError} isVideoFile={isVideoFile} />
          {/* Add BASE_URL prefix to any other media inside Hero, SaveTheDate, etc. if needed */}
          <SaveTheDate mediaErrors={mediaErrors} handleMediaError={handleMediaError} countdown={countdown} />
          <OurStory mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
          <EventDetails />
          <Schedule mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
          <RSVP rsvpForm={rsvpForm} setRsvpForm={setRsvpForm} rsvpSubmitting={rsvpSubmitting} rsvpSuccess={rsvpSuccess} setRsvpSuccess={setRsvpSuccess} handleRsvpSubmit={handleRsvpSubmit} mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
          <GuestGallery uploaderName={uploaderName} setUploaderName={setUploaderName} photoCaption={photoCaption} setPhotoCaption={setPhotoCaption} photoBase64={photoBase64} isUploadingPhoto={isUploadingPhoto} fileInputRef={fileInputRef} handlePhotoSelect={handlePhotoSelect} handlePhotoSubmit={handlePhotoSubmit} photosList={photosList} selectedPhoto={selectedPhoto} setSelectedPhoto={setSelectedPhoto} mediaErrors={mediaErrors} handleMediaError={handleMediaError} />
        </div>
      )}
    </div>
  );
}
