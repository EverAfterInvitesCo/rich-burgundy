import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@supabase/supabase-js";
import Hero from "./components/Hero";
import SaveTheDate from "./components/SaveTheDate";
import OurStory from "./components/OurStory";
import EventDetails from "./components/EventDetails";
import Schedule from "./components/Schedule";
import RSVP from "./components/RSVP";
import GuestGallery from "./components/GuestGallery";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [curtainEnded, setCurtainEnded] = useState(false);
  const [skipCurtain, setSkipCurtain] = useState(false);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoBase64 || !uploaderName) return;

    setIsUploadingPhoto(true);
    try {
      const response = await fetch(photoBase64);
      const blob = await response.blob();
      const file = new File([blob], `${Date.now()}.png`, { type: 'image/png' });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(`photos/${Date.now()}_${uploaderName.replace(/\s+/g, '_')}.png`, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase.from('photos').insert([
        { guest_name: uploaderName, caption: photoCaption, photo_url: urlData.publicUrl }
      ]);

      if (dbError) throw dbError;

      setPhotosList([{ guestName: uploaderName, caption: photoCaption, photoUrl: urlData.publicUrl }, ...photosList]);
      alert("Photo shared successfully!");
      setPhotoBase64(null);
      setUploaderName("");
      setPhotoCaption("");
    } catch (error) {
      console.error("Supabase upload error:", error);
      alert("Failed to upload. Check console for details.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPhotosList(data.map(p => ({
          guestName: p.guest_name,
          caption: p.caption,
          photoUrl: p.photo_url
        })));
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (showMainSite && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [showMainSite]);

  return (
    <div className="min-h-screen bg-burgundy-950 text-burgundy-50 font-sans relative overflow-x-hidden">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}media/sparks.mp3`} loop preload="auto" />

      <AnimatePresence>
        {!showMainSite && (
          <motion.div 
            key="curtains-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify
