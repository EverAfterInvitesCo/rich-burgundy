import React from 'react';
import { Heart, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-burgundy-950 py-16 flex flex-col items-center justify-center gap-3 border-t border-burgundy-900/50 mt-12">
      
      {/* Couple's Names */}
      <div className="flex items-center gap-3 text-gold-400 font-serif-lux text-xl md:text-2xl">
        <Heart fill="currentColor" size={20} className="text-gold-400" />
        <span>Yara & Ahmed</span>
      </div>

      {/* Credit */}
      <div className="text-burgundy-300 text-sm tracking-wide font-sans mb-2">
        made with love by everafterinvites
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-5">
        <a 
          href="https://www.instagram.com/_everafterinvites_/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-gold-400 hover:text-gold-200 transition-colors"
        >
          <Instagram size={18} />
          <span className="text-sm tracking-widest">@_everafterinvites_</span>
        </a>

        <div className="w-px h-4 bg-burgundy-700 mx-1"></div> {/* Divider */}

        <a 
          href="https://www.facebook.com/profile.php?id=61591686334310" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gold-400 hover:text-gold-200 transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={18} />
        </a>

        <a 
          href="https://www.facebook.com/profile.php?id=61591686334310" // <-- Update your TikTok link here!
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gold-400 hover:text-gold-200 transition-colors"
          aria-label="TikTok"
        >
          {/* Custom TikTok SVG Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        </a>
      </div>
      
    </footer>
  );
}
