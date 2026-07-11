import React from 'react';
import { Heart, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-burgundy-950 py-8 flex flex-col items-center justify-center gap-2 border-t border-burgundy-900/50 mt-8">
      
      {/* Couple's Names */}
      <div className="flex items-center gap-2 text-gold-400 font-serif-lux text-lg">
        <Heart fill="currentColor" size={16} className="text-gold-400" />
        <span>Yara & Ahmed</span>
      </div>

      {/* Credit */}
      <div className="text-burgundy-400 text-[10px] uppercase tracking-widest">
        made with love by everafterinvites
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-4 mt-1">
        <a 
          href="https://www.instagram.com/_everafterinvites_/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-gold-400 hover:text-gold-200 transition-colors"
        >
          <Instagram size={14} />
          <span className="text-[10px] tracking-widest">@_everafterinvites_</span>
        </a>

        <div className="w-px h-3 bg-burgundy-700"></div>

        <a 
          href="https://www.facebook.com/profile.php?id=61591686334310" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gold-400 hover:text-gold-200 transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={14} />
        </a>

        <a 
          href="https://www.tiktok.com/@_everafterinvites_" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gold-400 hover:text-gold-200 transition-colors"
          aria-label="TikTok"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        </a>
      </div>
      
    </footer>
  );
}
