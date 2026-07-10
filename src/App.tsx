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

// High-resolution royal wedding preloaded images for gallery
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
  // State for Curtain Entrance
  const [curtainEnded, setCurtainEnded] = useState(false);
  const [skipCurtain, setSkipCurtain] = useState(false);
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle background music play/pause
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
        });
    }
  };

  // Autoplay audio once user clicks past curtains to enter
  useEffect(() => {
    const showMain = curtainEnded || skipCurtain;
    if (showMain && audioRef.current) {
      // Small timeout to ensure browser registers the click interaction perfectly
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlayingAudio(true);
            })
            .catch((err) => {
              console.log("Autoplay was prevented by browser policy:", err);
              setIsPlayingAudio(false);
            });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [curtainEnded, skipCurtain]);

  // Scroll position to trigger fade-ins
  const [, setScrollProgress] = useState(0);

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // RSVP Form state
  const [rsvpForm, setRsvpForm] = useState({
    guestName: "",
    attending: true,
    dietary: "",
    guestsCount: 0,
    message: ""
  });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Photobooth upload state
  const [uploaderName, setUploaderName] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guest photo gallery state
  const [photosList, setPhotosList] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  // Organizer state
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [organizerPasscode, setOrganizerPasscode] = useState("");
  const [isOrganizerAuthed, setIsOrganizerAuthed] = useState(false);
  const [rsvpsList, setRsvpsList] = useState<any[]>([]);
  const [adminPhotosList, setAdminPhotosList] = useState<any[]>([]);
  const [organizerError, setOrganizerError] = useState("");

  // Supabase states
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

  // Load Supabase credentials on start
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseAnonKey(creds.key);
    setIsSupabaseActive(isSupabaseConfigured());
  }, []);

  // Track media errors for rendering fallback placeholders
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});

  const handleMediaError = (key: string) => {
    setMediaErrors((prev) => ({ ...prev, [key]: true }));
  };

  // 1. Countdown Logic to Sept 9, 2026
  useEffect(() => {
    const targetDate = new Date("2026-09-09T18:00:00+02:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Real-time photobooth listener (Firebase or Supabase polling)
  useEffect(() => {
    if (curtainEnded || skipCurtain) {
      if (currentBackend === "supabase" && isSupabaseActive) {
        // Fetch from Supabase
        const loadSupabasePhotos = async () => {
          try {
            const sPhotos = await fetchSupabasePhotos();
            if (sPhotos && sPhotos.length > 0) {
              setPhotosList(sPhotos);
              setAdminPhotosList(sPhotos);
            } else {
              setPhotosList(SAMPLE_GALLERY);
              setAdminPhotosList([]);
            }
          } catch (err) {
            console.error("Supabase photos load error", err);
            setPhotosList(SAMPLE_GALLERY);
          }
        };
        loadSupabasePhotos();
        const interval = setInterval(loadSupabasePhotos, 8000); // 8-second polling
        return () => clearInterval(interval);
      } else {
        const unsubscribe = subscribeToPhotos(
          (updatedPhotos) => {
            setPhotosList(updatedPhotos.length > 0 ? updatedPhotos : SAMPLE_GALLERY);
            setAdminPhotosList(updatedPhotos);
          },
          (err) => {
            console.error("Gallery subscription error", err);
            setPhotosList(SAMPLE_GALLERY);
          }
        );
        return () => unsubscribe();
      }
    }
  }, [curtainEnded, skipCurtain, currentBackend, isSupabaseActive]);

  // 4. RSVP submission handler
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.guestName.trim()) return;

    setRsvpSubmitting(true);
    try {
      const rsvpId = await addRsvp({
        guestName: rsvpForm.guestName,
        attending: rsvpForm.attending,
        dietary: rsvpForm.dietary,
        guestsCount: Number(rsvpForm.guestsCount),
        message: rsvpForm.message
      });

      // Synchronize with Supabase if active
      if (rsvpId && isSupabaseActive) {
        try {
          await syncRsvpToSupabase({
            id: rsvpId,
            guestName: rsvpForm.guestName,
            attending: rsvpForm.attending,
            dietary: rsvpForm.dietary,
            guestsCount: Number(rsvpForm.guestsCount),
            message: rsvpForm.message,
            createdAt: new Date().toISOString()
          });
        } catch (sErr) {
          console.error("Failed syncing RSVP to Supabase:", sErr);
        }
      }

      setRsvpSuccess(true);
      // Reset form
      setRsvpForm({
        guestName: "",
        attending: true,
        dietary: "",
        guestsCount: 0,
        message: ""
      });
    } catch (err) {
      console.error(err);
      alert("There was an error saving your RSVP. Please try again.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  // 5. Guest photobooth file handling (convert to base64 with compression)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        // Compress using canvas to ensure it fits well inside the 1MB Firestore limit
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scale = MAX_WIDTH / img.width;
        
        if (img.width > MAX_WIDTH) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Output compressed jpeg base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        setPhotoBase64(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  // Submit Photo to guest gallery
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim() || !photoBase64) return;

    setIsUploadingPhoto(true);
    try {
      const photoId = await addPhoto({
        guestName: uploaderName,
        photoUrl: photoBase64,
        caption: photoCaption
      });

      // Synchronize with Supabase if active
      if (photoId && isSupabaseActive) {
        try {
          await syncPhotoToSupabase({
            id: photoId,
            guestName: uploaderName,
            photoUrl: photoBase64,
            caption: photoCaption,
            createdAt: new Date().toISOString()
          });
        } catch (sErr) {
          console.error("Failed syncing Photo to Supabase:", sErr);
        }
      }

      setUploadSuccess(true);
      setUploaderName("");
      setPhotoCaption("");
      setPhotoBase64(null);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error uploading photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 6. Organizer login & loading data
  const handleOrganizerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (organizerPasscode === "everafter" || organizerPasscode === "yara_ahmed_wedding_2026") {
      setIsOrganizerAuthed(true);
      setOrganizerError("");
      loadOrganizerData();
    } else {
      setOrganizerError("Incorrect secret passcode. Please try again.");
    }
  };

  const loadOrganizerData = async () => {
    try {
      let rsvps: any[] = [];
      if (currentBackend === "supabase" && isSupabaseActive) {
        try {
          const sRsvps = await fetchSupabaseRsvps();
          if (sRsvps) {
            rsvps = sRsvps;
          } else {
            const fRsvps = await getRsvps();
            rsvps = fRsvps || [];
          }
        } catch (sErr) {
          console.error("Failed fetching rsvps from Supabase, falling back to Firebase:", sErr);
          const fRsvps = await getRsvps();
          rsvps = fRsvps || [];
        }
      } else {
        const fRsvps = await getRsvps();
        rsvps = fRsvps || [];
      }

      // Sort by date descending
      rsvps.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setRsvpsList(rsvps);
    } catch (err) {
      console.error(err);
    }
  };

  // Re-load organizer data when backend selection or auth state changes
  useEffect(() => {
    if (isOrganizerAuthed) {
      loadOrganizerData();
    }
  }, [currentBackend, isOrganizerAuthed, isSupabaseActive]);

  const handleAdminDeleteRsvp = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this RSVP?")) {
      try {
        await deleteRsvp(id);
      } catch (err) {
        console.error("Firebase RSVP delete error:", err);
      }

      if (isSupabaseActive) {
        try {
          await deleteRsvpFromSupabase(id);
        } catch (err) {
          console.error("Supabase RSVP delete error:", err);
        }
      }
      loadOrganizerData();
    }
  };

  const handleAdminDeletePhoto = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this photo from the gallery?")) {
      try {
        await deletePhoto(id);
      } catch (err) {
        console.error("Firebase photo delete error:", err);
      }

      if (isSupabaseActive) {
        try {
          await deletePhotoFromSupabase(id);
        } catch (err) {
          console.error("Supabase photo delete error:", err);
        }
      }
    }
  };

  // Handle saving and testing Supabase connection
  const handleSaveSupabaseSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseTestLoading(true);
    setSupabaseStatusMsg("");
    
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      clearSupabaseCredentials();
      setIsSupabaseActive(false);
      setSupabaseStatusMsg("Supabase settings cleared. Using default Firestore backend.");
      setSupabaseTestLoading(false);
      setCurrentBackend("firebase");
      return;
    }

    try {
      const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
      if (result.success) {
        saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
        setIsSupabaseActive(true);
        setSupabaseStatusMsg("Successfully connected to Supabase!");
      } else {
        setSupabaseStatusMsg(`Connection failed: ${result.error || "Please verify credentials and schema."}`);
      }
    } catch (err) {
      setSupabaseStatusMsg(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSupabaseTestLoading(false);
    }
  };

  // Synchronize all existing database records to Supabase
  const handleSyncAllData = async () => {
    if (!isSupabaseActive) {
      setSupabaseSyncError("Please configure and connect Supabase first.");
      return;
    }
    setSupabaseSyncing(true);
    setSupabaseSyncError("");
    setSupabaseSyncSuccess("");

    try {
      // 1. Fetch latest from Firebase
      const latestRsvps = (await getRsvps() || []) as any[];
      
      // Sync RSVPs
      let syncedRsvpsCount = 0;
      for (const rsvp of latestRsvps) {
        await syncRsvpToSupabase({
          id: rsvp.id,
          guestName: rsvp.guestName,
          attending: rsvp.attending,
          dietary: rsvp.dietary || "",
          guestsCount: Number(rsvp.guestsCount || 0),
          message: rsvp.message || "",
          createdAt: rsvp.createdAt || new Date().toISOString()
        });
        syncedRsvpsCount++;
      }

      // Sync Photos
      let syncedPhotosCount = 0;
      for (const photo of adminPhotosList) {
        await syncPhotoToSupabase({
          id: photo.id,
          guestName: photo.guestName,
          photoUrl: photo.photoUrl,
          caption: photo.caption || "",
          createdAt: photo.createdAt || new Date().toISOString()
        });
        syncedPhotosCount++;
      }

      setSupabaseSyncSuccess(`Successfully synchronized ${syncedRsvpsCount} RSVPs and ${syncedPhotosCount} photos to Supabase!`);
      await loadOrganizerData();
    } catch (err) {
      setSupabaseSyncError(`Synchronization failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const exportRsvpsToCSV = () => {
    if (rsvpsList.length === 0) return;
    
    const headers = ["Guest Name", "Attending", "Dietary Needs", "Extra Guests", "Message", "Submission Date"];
    const rows = rsvpsList.map(r => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attending ? "Yes" : "No",
      `"${(r.dietary || "").replace(/"/g, '""')}"`,
      r.guestsCount,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Yara_Ahmed_Wedding_RSVPs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to test if a file path is a video based on extension
  const isVideoFile = (url: string) => {
    const trimmed = url.toLowerCase().split('?')[0];
    return trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.endsWith(".mov");
  };

  const showMainSite = curtainEnded || skipCurtain;

  return (
    <div className="min-h-screen bg-burgundy-950 text-burgundy-50 font-sans relative overflow-x-hidden selection:bg-gold-500 selection:text-burgundy-950">
      
      {/* Background Wedding Music - Sparks */}
      <audio
        ref={audioRef}
        src="/media/sparks.mp3"
        loop
        preload="auto"
      />

      {/* ----------------- CURTAINS INTRO ----------------- */}
      <AnimatePresence>
        {!showMainSite && (
          <motion.div 
            key="curtains-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            onClick={() => setSkipCurtain(true)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-burgundy-950 overflow-hidden cursor-pointer"
            title="Click anywhere to enter"
          >
            {/* The Curtains Video or Backdrop */}
            <div className="absolute inset-0 w-full h-full object-cover">
              {!mediaErrors["curtains"] ? (
                isVideoFile("/media/curtains.MOV") ? (
                  <video 
                    src="/media/curtains.MOV" 
                    autoPlay 
                    muted 
                    playsInline
                    onEnded={() => setCurtainEnded(true)}
                    onError={() => handleMediaError("curtains")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="/media/curtains.MOV" 
                    alt="Wedding Curtains"
                    onError={() => handleMediaError("curtains")}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                /* Pure gorgeous CSS velvet curtain fallback */
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950 via-burgundy-800 to-burgundy-950 flex justify-between opacity-95">
                  <div className="w-1/2 h-full border-r border-gold-300/30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-burgundy-800/20 via-transparent to-transparent shadow-2xl" />
                  <div className="w-1/2 h-full border-l border-gold-300/30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-burgundy-800/20 via-transparent to-transparent shadow-2xl" />
                </div>
              )}
              {/* Luxury dark vignetting */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-burgundy-950/70 to-burgundy-950/95 pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- MAIN SITE ----------------- */}
      {showMainSite && (
        <div className="relative">
          
          {/* Quick Organizer Portal Lock Button */}
          <button 
            onClick={() => setShowOrganizer(!showOrganizer)}
            className="fixed top-6 right-6 z-40 bg-burgundy-900/80 border border-gold-400/40 hover:border-gold-300 p-2.5 rounded-full backdrop-blur-md text-gold-300 transition-all shadow-lg hover:shadow-gold-500/10 cursor-pointer"
            title="Organizer Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Background Music Toggle Button */}
          <button 
            onClick={togglePlayAudio}
            className="fixed top-6 right-18 z-40 bg-burgundy-900/80 border border-gold-400/40 hover:border-gold-300 p-2.5 rounded-full backdrop-blur-md text-gold-300 transition-all shadow-lg hover:shadow-gold-500/10 flex items-center justify-center cursor-pointer"
            title={isPlayingAudio ? "Mute Background Music" : "Play Background Music"}
          >
            {isPlayingAudio ? (
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-400/20 animate-ping" />
                <Volume2 className="w-4 h-4 relative z-10 text-gold-400 animate-[pulse_1.5s_infinite]" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4 text-gold-400/60" />
            )}
          </button>

          {/* ----------------- ORGANIZER VIEW MODAL ----------------- */}
          <OrganizerPortal
            showOrganizer={showOrganizer}
            setShowOrganizer={setShowOrganizer}
            organizerPasscode={organizerPasscode}
            setOrganizerPasscode={setOrganizerPasscode}
            isOrganizerAuthed={isOrganizerAuthed}
            handleOrganizerAuth={handleOrganizerAuth}
            organizerError={organizerError}
            rsvpsList={rsvpsList}
            adminPhotosList={adminPhotosList}
            handleAdminDeleteRsvp={handleAdminDeleteRsvp}
            handleAdminDeletePhoto={handleAdminDeletePhoto}
            currentBackend={currentBackend}
            setCurrentBackend={setCurrentBackend}
            isSupabaseActive={isSupabaseActive}
            supabaseUrl={supabaseUrl}
            setSupabaseUrl={setSupabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
            setSupabaseAnonKey={setSupabaseAnonKey}
            handleSaveSupabaseSettings={handleSaveSupabaseSettings}
            supabaseTestLoading={supabaseTestLoading}
            supabaseStatusMsg={supabaseStatusMsg}
            clearSupabaseCredentials={clearSupabaseCredentials}
            setIsSupabaseActive={setIsSupabaseActive}
            handleSyncAllData={handleSyncAllData}
            supabaseSyncing={supabaseSyncing}
            supabaseSyncError={supabaseSyncError}
            supabaseSyncSuccess={supabaseSyncSuccess}
            showSqlSchema={showSqlSchema}
            setShowSqlSchema={setShowSqlSchema}
            exportRsvpsToCSV={exportRsvpsToCSV}
            loadOrganizerData={loadOrganizerData}
          />

          {/* ----------------- SECTION 1: CHANDELIER HERO ----------------- */}
          <Hero 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
            isVideoFile={isVideoFile} 
          />

          {/* ----------------- SECTION 2: SAVE THE DATE (LACE ON RIGHT) ----------------- */}
          <SaveTheDate 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
            countdown={countdown} 
          />

          {/* ----------------- SECTION 3: OUR STORY (FLOWERS ON BOTTOM LEFT) ----------------- */}
          <OurStory 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
          />

          {/* ----------------- SECTION 4: EVENT DETAILS (MAP AND ACTIONS) ----------------- */}
          <EventDetails />

          {/* ----------------- SECTION 5: CELEBRATION SCHEDULE ----------------- */}
          <Schedule 
            mediaErrors={mediaErrors} 
            handleMediaError={handleMediaError} 
          />

          {/* ----------------- SECTION 6: RSVP (TASSLES ON LEFT) ----------------- */}
          <RSVP
            rsvpForm={rsvpForm}
            setRsvpForm={setRsvpForm}
            rsvpSubmitting={rsvpSubmitting}
            rsvpSuccess={rsvpSuccess}
            setRsvpSuccess={setRsvpSuccess}
            handleRsvpSubmit={handleRsvpSubmit}
            mediaErrors={mediaErrors}
            handleMediaError={handleMediaError}
          />

          {/* ----------------- SECTION 7: PHOTOS & GUEST GALLERY ----------------- */}
          <GuestGallery
            uploaderName={uploaderName}
            setUploaderName={setUploaderName}
            photoCaption={photoCaption}
            setPhotoCaption={setPhotoCaption}
            photoBase64={photoBase64}
            isUploadingPhoto={isUploadingPhoto}
            fileInputRef={fileInputRef}
            handlePhotoSelect={handlePhotoSelect}
            handlePhotoSubmit={handlePhotoSubmit}
            photosList={photosList}
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
            mediaErrors={mediaErrors}
            handleMediaError={handleMediaError}
          />

          {/* ----------------- SECTIONS 8: FOOTER (MADE WITH LOVE) ----------------- */}
          <footer className="bg-burgundy-950 border-t border-gold-400/10 py-12 px-6 text-center text-xs text-burgundy-200/80 space-y-4">
            <div className="flex items-center justify-center gap-2 text-gold-400">
              <Heart className="w-4 h-4 fill-gold-400" />
              <span className="font-serif-lux text-base tracking-widest text-gold-200">Yara & Ahmed</span>
            </div>
            
            <div className="space-y-1">
              <p>made with love by everafterinvites</p>
              <a 
                href="https://www.instagram.com/_everafterinvites_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 transition-colors font-medium text-[11px]"
              >
                <Instagram className="w-3.5 h-3.5" />
                @_everafterinvites_
              </a>
            </div>
          </footer>

          {/* ----------------- PHOTO ZOOM PREVIEW MODAL ----------------- */}
          <AnimatePresence>
            {selectedPhoto && (
              <div className="fixed inset-0 bg-burgundy-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-burgundy-900 rounded-2xl shadow-2xl border border-gold-400/30 overflow-hidden max-w-2xl w-full flex flex-col"
                >
                  <div className="px-6 py-4 bg-burgundy-950 border-b border-gold-400/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-lux font-semibold text-gold-200 tracking-wide">Shared Memory</h4>
                      <p className="text-[10px] text-burgundy-300 uppercase tracking-widest">Uploaded by {selectedPhoto.guestName}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPhoto(null)}
                      className="bg-burgundy-950 border border-gold-400/30 text-gold-300 hover:text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    >
                      Close
                    </button>
                  </div>

                  <div className="bg-burgundy-950 p-6 flex items-center justify-center min-h-[250px] max-h-[60vh] overflow-hidden">
                    <img 
                      src={selectedPhoto.photoUrl} 
                      alt={selectedPhoto.caption} 
                      className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {selectedPhoto.caption && (
                    <div className="px-6 py-4 bg-burgundy-950/40 text-center italic text-xs text-gold-100">
                      "{selectedPhoto.caption}"
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
