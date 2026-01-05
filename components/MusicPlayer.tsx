
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Minimize2, X } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  togglePlay: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  togglePlay,
  onNext,
  onPrevious
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle Track & Playback State Changes
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // Event Listeners for Audio
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        if (onNext) {
          onNext();
        } else {
          togglePlay();
        }
      });
    }

    if (currentTrack) {
      // If switching track
      if (audioRef.current.src !== currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.volume = volume;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback interrupted:", e));
        }
      }
    }
  }, [currentTrack]);

  // Sync play/pause prop with audio object
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume state with audio object
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleEnlarged = () => {
    setIsEnlarged(!isEnlarged);
  };

  if (!currentTrack) return null;

  const progressPercentage = (currentTime / (duration || 1)) * 100;

  return (
    <>
      {/* Enlarged Fullscreen Player Overlay */}
      {isEnlarged && (
        <div className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col p-8 md:p-24 animate-in fade-in duration-500 overflow-hidden">
          {/* Grain Effect in Enlarged View */}
          <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
            <div className="absolute inset-[-200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
          </div>

          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase block mb-2">Sonic State: Active</span>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Enlarged Interface</h2>
            </div>
            <button
              onClick={toggleEnlarged}
              className="w-12 h-12 flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 z-10 mt-12">
            {/* Massive Artwork */}
            <div className="relative group w-full max-w-sm md:max-w-xl aspect-square overflow-hidden border border-white/5">
              <img
                src={currentTrack.cover}
                className={`w-full h-full object-cover grayscale transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

              {/* Dynamic Bars for enlarged view */}
              {isPlaying && (
                <div className="absolute bottom-8 left-8 right-8 h-24 flex items-end gap-1 overflow-hidden pointer-events-none opacity-50">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white animate-pulse"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDuration: `${0.5 + Math.random() * 1}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Huge Text Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-xs tracking-[0.8em] opacity-40 uppercase mb-4 block">Original Production</span>
              <h1 className="text-6xl md:text-[8vw] font-black leading-none uppercase tracking-tighter mb-4 italic text-white/90">
                {currentTrack.title}
              </h1>
              <p className="text-2xl md:text-4xl font-light uppercase tracking-widest text-white/40 mb-12">
                {currentTrack.artist}
              </p>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <span className="block text-[10px] opacity-30 uppercase mb-1">Time Elapsed</span>
                  <span className="text-2xl font-mono">{formatTime(currentTime)}</span>
                </div>
                <div className="h-12 w-[1px] bg-white/10"></div>
                <div>
                  <span className="block text-[10px] opacity-30 uppercase mb-1">Duration</span>
                  <span className="text-2xl font-mono">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Massive Progress Bar in Enlarged view */}
          <div className="mt-12 z-10">
            <div
              className="w-full h-1 bg-white/5 cursor-pointer group relative"
              onClick={handleProgressChange}
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
              ></div>
            </div>
          </div>

          {/* Large Controls Footer */}
          <div className="flex justify-between items-center mt-12 md:mt-24 z-10">
            <div className="flex items-center gap-16">
              <button
                onClick={onPrevious}
                className="opacity-40 hover:opacity-100 transition-opacity transform hover:scale-110"
              >
                <SkipBack size={32} />
              </button>
              <button
                onClick={togglePlay}
                className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
              >
                {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
              </button>
              <button
                onClick={onNext}
                className="opacity-40 hover:opacity-100 transition-opacity transform hover:scale-110"
              >
                <SkipForward size={32} />
              </button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 group">
                <Volume2 size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-48 h-1 bg-white/10 appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Persistent Bottom Player */}
      <div className={`fixed bottom-0 left-0 w-full z-50 p-6 md:p-8 pointer-events-none transition-transform duration-500 flex justify-center ${isEnlarged ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-[#111] border border-white/10 p-4 md:p-6 backdrop-blur-xl pointer-events-auto flex items-center justify-between group relative overflow-hidden shadow-2xl shadow-black/50 w-full max-w-5xl rounded-[3rem] mx-auto">

          {/* Subtle Progress Background */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 cursor-pointer" onClick={handleProgressChange}>
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-4 w-1/3">
            <div className="w-12 h-12 overflow-hidden bg-white/10 relative flex-shrink-0">
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex gap-1">
                    <div className="w-[2px] h-3 bg-white animate-[bounce_1s_infinite]"></div>
                    <div className="w-[2px] h-5 bg-white animate-[bounce_0.8s_infinite]"></div>
                    <div className="w-[2px] h-2 bg-white animate-[bounce_1.2s_infinite]"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden sm:block truncate pr-4">
              <h4 className="text-xs font-bold tracking-widest uppercase truncate">{currentTrack.title}</h4>
              <p className="text-[10px] uppercase opacity-50 tracking-wider truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="flex items-center gap-4 md:gap-8">
              <SkipBack
                size={18}
                onClick={onPrevious}
                className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
              />
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-white text-black hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <SkipForward
                size={18}
                onClick={onNext}
                className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity"
              />
            </div>
          </div>

          {/* Extra / Volume / Maximize */}
          <div className="flex items-center justify-end gap-3 md:gap-6 w-1/3">
            <div
              className="flex items-center gap-3 relative"
              onMouseEnter={() => setIsVolumeHovered(true)}
              onMouseLeave={() => setIsVolumeHovered(false)}
            >
              <Volume2
                size={18}
                className={`cursor-pointer transition-opacity ${volume === 0 ? 'opacity-20' : 'opacity-40 hover:opacity-100'}`}
                onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              />
              <div className={`transition-all duration-300 overflow-hidden flex items-center ${isVolumeHovered ? 'w-24 md:w-32 opacity-100' : 'w-0 opacity-0'}`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/20 appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            <button onClick={toggleEnlarged} className="opacity-40 hover:opacity-100 transition-opacity">
              <Maximize2 size={18} className="cursor-pointer" />
            </button>

            <div className="text-[10px] font-mono tracking-tighter opacity-40 hidden md:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
