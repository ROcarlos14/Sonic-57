
import React, { useState, useRef } from 'react';
// Import querySonicAi instead of curatePlaylist as it is the correct service function
import { querySonicAi, generateMoodArt, generateSpeech, SonicAiResponse } from '../services/geminiService';
import { Sparkles, Loader2, Play, Volume2, Image as ImageIcon, Globe } from 'lucide-react';
import { Track } from '../types';

interface AiCurationProps {
  onTrackSelect: (track: Track) => void;
}

const AiCuration: React.FC<AiCurationProps> = ({ onTrackSelect }) => {
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Update state type to match SonicAiResponse
  const [results, setResults] = useState<SonicAiResponse | null>(null);
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleCurate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim() || isLoading) return;
    
    setIsLoading(true);
    setResults(null);
    setGeneratedArt(null);
    setAudioUrl(null);

    try {
      // Use querySonicAi which is exported from geminiService
      const [curation, art] = await Promise.all([
        querySonicAi(mood),
        generateMoodArt(mood)
      ]);
      
      setResults(curation);
      setGeneratedArt(art);

      // Generate speech for the critique if available
      if (curation.critique) {
        const speechData = await generateSpeech(curation.critique);
        if (speechData) {
          setAudioUrl(speechData);
        }
      }
    } catch (error) {
      console.error("Architect error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const playCritique = async () => {
    if (!audioUrl) return;
    
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const decodeBase64 = (base64: string) => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    };

    const audioData = decodeBase64(audioUrl);
    const dataInt16 = new Int16Array(audioData.buffer);
    const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  const handlePlayTrack = (item: any) => {
    // Map fictional track to real player with a placeholder audio URL for the demo
    const track: Track = {
      id: `ai-${Math.random()}`,
      title: item.title,
      artist: item.artist,
      album: 'ARCHITECT SERIES',
      cover: generatedArt || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800',
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: '04:20',
      genre: item.genre
    };
    onTrackSelect(track);
  };

  return (
    <section className="px-6 md:px-12 py-32 flex flex-col items-center min-h-screen">
      <div className="max-w-4xl w-full text-center mb-20">
        <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase block mb-6">Laboratory // Sonic Architect</span>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8">
          Architect<br /> <span className="text-white/20 italic">Vibration</span>
        </h2>
        
        <form onSubmit={handleCurate} className="relative mt-12 max-w-2xl mx-auto">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Define your sonic coordinates..."
            className="w-full bg-transparent border-b border-white/10 py-6 px-4 text-xl md:text-3xl focus:outline-none focus:border-white transition-all placeholder:opacity-10 uppercase font-light tracking-tight text-center"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="mt-8 flex items-center gap-4 mx-auto px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all text-[10px] font-bold tracking-[0.4em] uppercase disabled:opacity-30"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Initialize Construction
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-8 py-20 opacity-40">
          <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-white animate-[slide_2s_infinite]"></div>
          </div>
          <div className="text-[9px] font-mono tracking-[0.5em] uppercase text-center space-y-2">
            <p>Scanning Mood Parameters...</p>
            <p className="animate-pulse">Generating Visual Geometry</p>
            <p>Synthesizing Curator Analysis</p>
          </div>
        </div>
      )}

      {results && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Left Column: Visual & Analysis */}
          <div className="lg:col-span-5 space-y-12">
            <div className="relative aspect-square bg-white/5 border border-white/10 overflow-hidden group">
              {generatedArt ? (
                <img src={generatedArt} alt="Mood Art" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                  <ImageIcon size={48} strokeWidth={1} />
                  <span className="text-[10px] uppercase tracking-widest">Rendering Visuals...</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-[9px] font-mono bg-black/80 px-2 py-1 uppercase tracking-widest">
                Structural Identity // 057
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] tracking-[0.3em] opacity-40 uppercase block mb-4">Architect's Critique</span>
              <p className="text-lg italic font-light leading-relaxed opacity-80 mb-8">
                "{results.critique}"
              </p>
              {audioUrl && (
                <button 
                  onClick={playCritique}
                  className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Volume2 size={12} />
                  </div>
                  Playback Curator Analysis
                </button>
              )}

              {/* Display sources for Google Search grounding if available */}
              {results.sources && results.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4 opacity-30">
                    <Globe size={12} />
                    <span className="text-[9px] tracking-widest uppercase">Verified Knowledge Base</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[8px] border border-white/10 px-2 py-0.5 uppercase opacity-40 hover:opacity-100 transition-opacity"
                      >
                        {s.web.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Track Listing */}
          <div className="lg:col-span-7 space-y-4">
             <div className="mb-8 pb-4 border-b border-white/10 flex justify-between items-end">
               <span className="text-[10px] tracking-widest uppercase opacity-30">Sonic Output Pool</span>
               <span className="text-[10px] font-mono opacity-20">05 ITEMS DETECTED</span>
             </div>
             
             {/* Use suggestedTracks from SonicAiResponse instead of non-existent tracks property */}
             {results.suggestedTracks?.map((item, idx) => (
               <div 
                key={idx} 
                className="group p-8 border border-white/5 hover:bg-white/5 transition-all cursor-crosshair flex justify-between items-center"
                onClick={() => handlePlayTrack(item)}
               >
                 <div>
                   <div className="flex justify-between items-start mb-4">
                     <span className="text-[10px] font-mono opacity-20">S_ARCH_{idx + 1}</span>
                     <span className="text-[9px] font-mono border border-white/10 px-2 py-0.5 opacity-40 uppercase">{item.genre}</span>
                   </div>
                   <h4 className="text-2xl font-bold uppercase tracking-tighter mb-1 group-hover:italic transition-all">{item.title}</h4>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">{item.artist}</p>
                   <p className="text-xs leading-relaxed opacity-60 font-light max-w-md">{item.description}</p>
                 </div>
                 <div className="ml-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white text-black">
                      <Play size={16} fill="black" />
                    </div>
                 </div>
               </div>
             ))}
          </div>

        </div>
      )}
    </section>
  );
};

export default AiCuration;
