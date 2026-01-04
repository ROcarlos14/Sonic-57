
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Track } from '../types';

interface HeroProps {
  onTrackSelect: (track: Track) => void;
  addToLibrary: (track: Track) => void;
  onStartExperience: () => void;
  featuredTrack: Track;
  allTracks: Track[];
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  track: Track;
  rotation: number;
}

const Hero: React.FC<HeroProps> = ({ onTrackSelect, featuredTrack, allTracks, addToLibrary, onStartExperience }) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const count = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

    if (dist > 80) { // Only spawn if moved far enough
      const newTrack = allTracks[count.current % allTracks.length];
      const newItem: TrailItem = {
        id: Date.now(),
        x: clientX,
        y: clientY,
        track: newTrack,
        rotation: Math.random() * 20 - 10,
      };

      setTrail((prev) => [...prev.slice(-10), newItem]); // Keep last 10
      lastPos.current = { x: clientX, y: clientY };
      count.current++;
    }
  }, [allTracks]);

  // Fade out items
  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-24 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Revealed Images */}
      {trail.map((item) => (
        <div
          key={item.id}
          className="reveal-image opacity-0 animate-in fade-in duration-500 fill-mode-forwards"
          style={{
            left: item.x,
            top: item.y,
            width: '240px',
            height: '320px',
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            opacity: 0.6
          }}
        >
          <img
            src={item.track.cover}
            alt="Reveal"
            className="w-full h-full object-cover grayscale brightness-50 border border-white/10"
          />
        </div>
      ))}

      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black opacity-[0.03] whitespace-nowrap pointer-events-none select-none z-0">
        SONIC ARCHITECTURE
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        <div className="md:col-span-7 flex flex-col justify-center pointer-events-none">
          <div className="line-mask pointer-events-auto">
            <h2 className="text-[12vw] md:text-[8vw] leading-[0.9] font-black uppercase tracking-tighter mb-8">
              Digital<br />
              <span className="text-white/20 italic">Vibrations</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base opacity-60 leading-relaxed font-light mb-12 uppercase tracking-wide pointer-events-auto">
            Experimental auditory experiences curated for the refined palate.
            Blending brutalist aesthetics with sonic precision.
          </p>
          <div className="flex gap-8 items-center pointer-events-auto">
            <button
              onClick={onStartExperience}
              className="px-10 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-all duration-500"
            >
              Start Experience
            </button>
            <div className="h-[1px] w-24 bg-white/20"></div>
          </div>
        </div>

        <div className="md:col-span-5 relative group pointer-events-auto hidden md:block opacity-0">
          {/* Section Hidden as per user request */}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20 z-10">
        <div className="w-[1px] h-12 bg-white"></div>
      </div>
    </section>
  );
};

export default Hero;
