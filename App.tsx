
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppSection, Track } from './types';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Discover from './components/Discover';
import Manifesto from './components/Manifesto';
import Research from './components/Research';
import Contact from './components/Contact';
import Genres from './components/Genres';
import Resources from './components/Resources';
import Admin from './components/Admin';
import { SonicDatabase } from './services/storage';
import { SonicApi } from './services/api';
import { Trash2, Play, Loader2 } from 'lucide-react';

const MainApp: React.FC<{
  section: AppSection;
  setSection: (s: AppSection) => void;
  tracks: Track[];
  library: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (t: Track) => void;
  addToLibrary: (t: Track) => void;
  removeFromLibrary: (id: string) => void;
}> = ({ section, setSection, tracks, library, currentTrack, isPlaying, onTrackSelect, addToLibrary, removeFromLibrary }) => {
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSection = () => {
    switch (section) {
      case AppSection.HOME:
        return <Hero
          onTrackSelect={onTrackSelect}
          featuredTrack={tracks[0] || null}
          allTracks={tracks}
          addToLibrary={addToLibrary}
          onStartExperience={() => navigateTo(AppSection.DISCOVER)}
        />;
      case AppSection.DISCOVER:
        return <Discover onTrackSelect={onTrackSelect} allTracks={tracks} addToLibrary={addToLibrary} />;
      case AppSection.GENRES:
        return <Genres onTrackSelect={onTrackSelect} allTracks={tracks} addToLibrary={addToLibrary} />;
      case AppSection.MANIFESTO:
        return <Manifesto />;
      case AppSection.RESEARCH:
        return <Research />;
      case AppSection.RESOURCES:
        return <Resources />;
      case AppSection.CONTACT:
        return <Contact />;
      case AppSection.LIBRARY:
        return (
          <section className="min-h-screen px-6 md:px-12 py-32">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-4">Your Collection</span>
                <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">The Vault</h3>
              </div>
              <div className="hidden md:block">
                <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-2">DB_CONNECTED</span>
                <span className="text-2xl font-light font-mono text-green-500/50">000{library.length.toString().padStart(2, '0')}</span>
              </div>
            </div>

            {library.length > 0 ? (
              <div className="space-y-4">
                {library.map((track, idx) => (
                  <div
                    key={track.id}
                    className="group border-b border-white/5 py-6 flex items-center justify-between hover:bg-white/5 px-4 transition-colors"
                  >
                    <div className="flex items-center gap-8 w-1/2">
                      <span className="text-[10px] font-mono opacity-20">0{idx + 1}</span>
                      <div className="relative w-16 h-16 overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={track.cover} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <button
                          onClick={() => onTrackSelect(track)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play size={20} fill="white" />
                        </button>
                      </div>
                      <div className="truncate">
                        <h4 className="text-xl font-bold uppercase tracking-tight truncate">{track.title}</h4>
                        <p className="text-[10px] uppercase opacity-40 tracking-widest">{track.artist}</p>
                      </div>
                    </div>
                    <div className="hidden md:block w-1/4 text-xs uppercase opacity-30 tracking-widest truncate">
                      {track.album}
                    </div>
                    <div className="flex items-center gap-12 w-1/4 justify-end">
                      <span className="text-xs font-mono opacity-40">{track.duration}</span>
                      <button
                        onClick={() => removeFromLibrary(track.id)}
                        className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter opacity-10">Vault Empty</h2>
                <p className="text-xs tracking-[0.5em] uppercase mt-4">Collect auditory tokens to fill your archive</p>
              </div>
            )}
          </section>
        );
      default:
        return null; // Fallback or could be 404
    }
  };

  const navigateTo = (newSection: AppSection) => {
    setSection(newSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none opacity-5 transition-transform duration-1000 ease-out z-0"
        style={{ transform: `translateY(${scrolled * -0.1}px)` }}
      >
        <div className="absolute top-[10%] left-[5%] text-[40vw] font-black leading-none uppercase select-none">S57</div>
      </div>

      <Header currentSection={section} onSectionChange={navigateTo} />

      <main className="relative z-10">
        {renderSection()}
      </main>

      <footer className="px-6 md:px-12 py-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between gap-12 text-white/40 bg-[#0a0a0a] relative z-20">
        <div className="max-w-xs">
          <h5
            className="text-white text-xs font-bold uppercase tracking-widest mb-6 cursor-pointer hover:opacity-50 transition-opacity"
            onClick={() => navigateTo(AppSection.HOME)}
          >
            Sonic-57 Studio
          </h5>
          <p className="text-xs uppercase leading-loose font-light">
            Refining the interface between human perception and digital audio.
            Crafted for those who seek more than just background noise.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-24 gap-y-4">
          <button onClick={() => navigateTo(AppSection.MANIFESTO)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Manifesto</button>
          <button onClick={() => navigateTo(AppSection.RESEARCH)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Sonic Research</button>
          <button onClick={() => navigateTo(AppSection.CONTACT)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Contact</button>
          <button onClick={() => navigateTo(AppSection.LIBRARY)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Vault</button>
          <button onClick={() => navigateTo(AppSection.RESOURCES)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Resources</button>
          <button onClick={() => navigateTo(AppSection.GENRES)} className="text-left text-xs uppercase tracking-widest hover:text-white transition-colors">Genres</button>
        </div>
        <div className="text-right">
          <span className="block text-[10px] tracking-widest font-mono mb-2 uppercase">Database Status: Active</span>
          <span className="text-xl font-light text-white font-mono uppercase">
            {new Date().toLocaleTimeString([], { hour12: false })} [UTC]
          </span>
        </div>
      </footer>
    </>
  );
};

const App: React.FC = () => {
  const [section, setSection] = useState<AppSection>(AppSection.HOME);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [library, setLibrary] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Database Synchronization
  useEffect(() => {
    const syncWithCore = async () => {
      // SonicDatabase.initialize() no longer needed for tracks, maybe for Library
      await SonicDatabase.initialize();
      try {
        const [apiTracks, storedLib] = await Promise.all([
          SonicApi.getTracks(),
          SonicDatabase.getLibrary()
        ]);
        setTracks(apiTracks);
        setLibrary(storedLib);
        if (apiTracks.length > 0) setCurrentTrack(apiTracks[0]);
      } catch (e) {
        console.error("Sync failed", e);
      }
      setIsInitializing(false);
    };
    syncWithCore();
  }, []);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleNext = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack, tracks]);

  const handlePrevious = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  }, [currentTrack, tracks]);

  const addTrack = async (newTrack: Track) => {
    // Persistent Save to API
    try {
      const savedTrack = await SonicApi.saveTrack(newTrack);
      await SonicDatabase.addToLibrary(savedTrack); // Auto-add to Vault

      // UI Update
      setTracks(prev => [savedTrack, ...prev]);
      setLibrary(prev => [savedTrack, ...prev]);
    } catch (e) {
      console.error("Add track failed", e);
    }
  };

  const deleteTrack = async (id: string) => {
    try {
      await SonicApi.deleteTrack(id);
      setTracks(prev => prev.filter(t => t.id !== id));
      // Also remove from library if desired, but library is local.
      // setLibrary(prev => prev.filter(t => t.id !== id));
      if (currentTrack?.id === id) {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    } catch (e) {
      console.error("Delete track failed", e);
    }
  };

  const addToLibrary = async (track: Track) => {
    await SonicDatabase.addToLibrary(track);
    setLibrary(prev => {
      if (prev.find(t => t.id === track.id)) return prev;
      return [track, ...prev];
    });
  };

  const removeFromLibrary = async (id: string) => {
    await SonicDatabase.removeFromLibrary(id);
    setLibrary(prev => prev.filter(t => t.id !== id));
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center opacity-20">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="text-[10px] tracking-[0.5em] uppercase">Syncing with Sonic Archive Core...</span>
      </div>
    );
  }

  // Backup seeding UI if DB is empty
  if (tracks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase mb-4 text-red-500">Database Empty</h1>
          <p className="text-xs uppercase tracking-widest opacity-60">No sonic signatures detected in the primary archive.</p>
        </div>
        <button
          onClick={async () => {
            try {
              const API_URL = (import.meta as any).env.PROD ? '/api/seed' : 'http://localhost:5001/api/seed';
              const res = await fetch(API_URL, { method: 'POST' });
              if (res.ok) window.location.reload();
              else alert("Seeding Failed");
            } catch (e) { alert("Connection Error"); }
          }}
          className="px-8 py-4 border border-white hover:bg-white hover:text-black transition-colors uppercase text-xs font-bold tracking-[0.2em]"
        >
          Initialize Default Library
        </button>
      </div>
    )
  }

  return (
    <Router>
      <div className="relative min-h-screen selection:bg-white selection:text-black">
        <Routes>
          <Route path="/admin" element={
            <Admin onAddTrack={addTrack} tracks={tracks} onDeleteTrack={deleteTrack} />
          } />
          <Route path="/" element={
            <MainApp
              section={section}
              setSection={setSection}
              tracks={tracks}
              library={library}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              addToLibrary={addToLibrary}
              removeFromLibrary={removeFromLibrary}
            />
          } />
          {/* Catch all to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          togglePlay={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        <div className="fixed inset-0 border-[1px] border-white/10 pointer-events-none z-[100]"></div>
      </div>
    </Router>
  );
};

export default App;
