
import React, { useState } from 'react';
import { Track } from '../types';
import { Play } from 'lucide-react';

interface GenresProps {
  onTrackSelect: (track: Track) => void;
  addToLibrary: (track: Track) => void;
  allTracks: Track[];
}

const Genres: React.FC<GenresProps> = ({ onTrackSelect, allTracks, addToLibrary }) => {
  const genres = Array.from(new Set(allTracks.map(t => t.genre)));
  const [selectedGenre, setSelectedGenre] = useState<string>(genres[0] || 'Techno');

  const filteredTracks = allTracks.filter(t => t.genre === selectedGenre);

  return (
    <section className="min-h-screen px-6 md:px-12 py-32">
      <div className="mb-24">
        <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-4">Sonic Classification</span>
        <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Genres</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Genre List */}
        <div className="lg:col-span-5 flex flex-col gap-4 border-l border-white/5 pl-6">
          {genres.length > 0 ? genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`text-left uppercase font-black tracking-tighter transition-all duration-500 group flex items-baseline gap-4 ${selectedGenre === genre
                ? 'text-[4rem] md:text-[6vw] leading-[0.8] text-white italic'
                : 'text-2xl md:text-3xl text-white/10 hover:text-white/40 hover:pl-6'
                }`}
            >
              <span className={`text-[10px] font-mono transition-opacity duration-500 ${selectedGenre === genre ? 'opacity-100' : 'opacity-0'}`}>
                {genres.indexOf(genre).toString().padStart(2, '0')}
              </span>
              <span>{genre}</span>
            </button>
          )) : (
            <p className="text-xs uppercase tracking-widest opacity-20 italic">No genres identified in current archive.</p>
          )}
        </div>

        {/* Tracks per Genre */}
        <div className="lg:col-span-7">
          <div className="mb-12 pb-4 border-b border-white/10">
            <span className="text-[10px] tracking-widest uppercase opacity-30">Selected Frequency Band: {selectedGenre}</span>
          </div>
          <div className="space-y-1">
            {filteredTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className="group flex items-center justify-between py-8 border-b border-white/5 hover:bg-white/5 px-6 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-12">
                  <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100 transition-opacity">
                    ID_{idx.toString().padStart(3, '0')}
                  </span>
                  <div>
                    <h4 className="text-2xl font-bold uppercase tracking-tight group-hover:pl-4 transition-all duration-500">
                      {track.title}
                    </h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-[0.3em] mt-1">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <span className="text-xs font-mono opacity-20 hidden md:block tracking-tighter">{track.duration}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToLibrary(track);
                      alert("Added to Vault");
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group/btn"
                    title="Add to Vault"
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest text-green-500 opacity-100">
                      +Vault
                    </span>
                  </button>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Play size={14} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
            {filteredTracks.length === 0 && (
              <p className="text-xs uppercase tracking-widest opacity-20 text-center py-24">Frequency void detected.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Genres;
