import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, RefreshCw } from "lucide-react";

interface GuestGalleryProps {
  uploaderName: string;
  setUploaderName: (val: string) => void;
  photoCaption: string;
  setPhotoCaption: (val: string) => void;
  photoBase64: string | null;
  isUploadingPhoto: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoSubmit: (e: React.FormEvent) => void;
  photosList: any[];
  selectedPhoto: any | null;
  setSelectedPhoto: (photo: any | null) => void;
  mediaErrors: Record<string, boolean>;
  handleMediaError: (key: string) => void;
}

export default function GuestGallery({
  uploaderName,
  setUploaderName,
  photoCaption,
  setPhotoCaption,
  photoBase64,
  isUploadingPhoto,
  fileInputRef,
  handlePhotoSelect,
  handlePhotoSubmit,
  photosList,
  selectedPhoto,
  setSelectedPhoto,
  mediaErrors,
  handleMediaError
}: GuestGalleryProps) {
  return (
    <section id="guest-gallery" className="relative min-h-screen bg-burgundy-950 overflow-hidden py-24 px-6 md:px-16">
      
      {/* Flower decoration overlay on bottom right */}
      <div className="absolute bottom-0 right-0 w-80 md:w-96 z-0 pointer-events-none opacity-80">
        {!mediaErrors["flower"] ? (
          <img 
            src="/media/flower.png" 
            alt="Floral bloom decorations"
            onError={() => handleMediaError("flower")}
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback flower bloom text */
          <div className="absolute bottom-0 right-0 p-8 text-[11px] text-gold-400/40 select-none font-serif-lux">
            🌸 Upload '/media/flower.png'
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs text-gold-400 tracking-[0.2em] uppercase font-semibold">SHARED MEMORIES</span>
          <h2 className="font-serif-lux text-4xl md:text-6xl text-white tracking-wide">
            Live Guest Gallery
          </h2>
          <div className="h-[1px] w-20 bg-gold-400 mx-auto my-4" />
          <p className="text-xs text-burgundy-200 max-w-md mx-auto">
            Take photos during the wedding and upload them directly to our live screen photobooth!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Upload Form Column */}
          <div className="lg:col-span-4 bg-burgundy-900/60 border border-gold-400/20 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif-lux text-lg text-gold-200">Share Your Photos</h3>
              <p className="text-xs text-burgundy-200">Submit snaps directly to the wedding stream.</p>
            </div>

            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Your Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Laila Sabry"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full bg-burgundy-950 border border-gold-400/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder-burgundy-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Short Caption</label>
                <input 
                  type="text"
                  placeholder="e.g., Congratulations guys!"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full bg-burgundy-950 border border-gold-400/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder-burgundy-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gold-300 tracking-wider block uppercase">Select Image</label>
                <input 
                  type="file"
                  ref={fileInputRef as any}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-gold-400/30 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400/60 transition-colors bg-burgundy-950"
                >
                  {photoBase64 ? (
                    <div className="space-y-2">
                      <img src={photoBase64} alt="Selected preview" className="h-20 mx-auto rounded-lg object-cover" />
                      <span className="text-[10px] text-emerald-400 block font-medium">✓ Photo Selected Successfully</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-2">
                      <Upload className="w-5 h-5 text-gold-400 mx-auto" />
                      <span className="text-xs text-burgundy-200 block">Click to upload photo</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploadingPhoto || !photoBase64}
                className="w-full py-2.5 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-burgundy-950 font-bold rounded-xl text-xs tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isUploadingPhoto ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    SHARING...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    POST TO GALLERY
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Photo Stream Gallery Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photosList.map((photo, index) => (
                <motion.div 
                  key={photo.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative group aspect-square rounded-2xl overflow-hidden border border-gold-400/15 bg-burgundy-900 cursor-pointer hover:border-gold-400/40 transition-all shadow-md"
                >
                  <img 
                    src={photo.photoUrl} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Elegant overlay card details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 space-y-1 text-left">
                    <span className="text-[10px] text-gold-300 font-bold tracking-wide uppercase">By {photo.guestName}</span>
                    <span className="text-[11px] text-white line-clamp-2">"{photo.caption || "Happy celebrations!"}"</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
