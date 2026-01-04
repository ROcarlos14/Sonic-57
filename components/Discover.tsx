
import React from 'react';
import { Track } from '../types';

interface DiscoverProps {
  onTrackSelect: (track: Track) => void;
  addToLibrary: (track: Track) => void;
  allTracks: Track[];
}

const Discover: React.FC<DiscoverProps> = ({ onTrackSelect, allTracks, addToLibrary }) => {
  return (
    <section className="px-6 md:px-12 py-24">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-4">Latest Releases</span>
          <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">The Feed</h3>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-2">Total Tracks</span>
          <span className="text-2xl font-light font-mono">{allTracks.length.toString().padStart(5, '0')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
        {allTracks.map((track, index) => (
          <div
            key={track.id}
            className="group cursor-pointer"
            onClick={() => onTrackSelect(track)}
          >
            <div className="relative overflow-hidden mb-6 aspect-square bg-white/5">
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 text-[10px] font-mono bg-black/80 px-2 py-1 uppercase">
                FRAG_{(index + 1).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="truncate pr-4 flex-1">
                <h4 className="text-xl font-bold tracking-tight uppercase group-hover:italic transition-all truncate">{track.title}</h4>
                <p className="text-xs opacity-40 uppercase tracking-widest mt-1 truncate">{track.artist}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] opacity-40 font-mono pt-1">{track.duration}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToLibrary(allTracks[index]);
                    // Optional: Visual feedback could be added here
                    alert("Added to Vault");
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group/btn"
                  title="Add to Vault"
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-500 opacity-100">
                    +Vault
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discover;
