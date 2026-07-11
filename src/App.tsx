export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [curtainEnded, setCurtainEnded] = useState(false);
  // ... (keep all your existing states here)

  const toggleAudio = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-burgundy-950 text-burgundy-50 font-sans relative overflow-x-hidden">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}media/sparks.mp3`} loop preload="auto" />

      {/* ... (keep your curtains code here) */}

      {showMainSite && (
        <div className="relative">
          {/* ... (all your content sections) ... */}
          
          <Footer />

          {/* New Audio Button */}
          <button
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-40 bg-gold-400 text-burgundy-950 p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            {isPlaying ? "⏸️" : "🎵"}
          </button>
        </div>
      )}
    </div>
  );
}
