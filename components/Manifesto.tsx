
import React from 'react';

const Manifesto: React.FC = () => {
  return (
    <section className="min-h-screen px-6 md:px-12 py-32 flex flex-col justify-center">
      <div className="max-w-5xl">
        <span className="text-[10px] tracking-[0.6em] opacity-40 uppercase block mb-12">The Philosophy // 057</span>
        <h2 className="text-[8vw] leading-[0.85] font-black uppercase tracking-tighter mb-16">
          Sound is <span className="text-white/20 italic">Structure</span>.<br />
          Silence is <span className="text-white/20 italic">Space</span>.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <p className="text-xl md:text-2xl leading-tight font-light uppercase tracking-tight opacity-80">
            We believe that digital audio has become too polite. SONIC-57 exists to restore the raw, structural integrity of sound. Our curation is not based on "likes" but on harmonic architecture and sonic tension.
          </p>
          <div className="space-y-12">
            <div className="border-l border-white/20 pl-8">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">01. Brutalist Ethos</h4>
              <p className="text-sm opacity-50 leading-relaxed uppercase">No filters. No smoothing. We celebrate the artifact, the glitch, and the uncompressed weight of the frequency spectrum.</p>
            </div>
            <div className="border-l border-white/20 pl-8">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">02. AI as Architect</h4>
              <p className="text-sm opacity-50 leading-relaxed uppercase">We use generative intelligence not to mimic humans, but to explore mathematical spaces humans cannot reach.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
