
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="min-h-screen px-6 md:px-12 py-32 flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
        <div className="md:col-span-8">
          <span className="text-[10px] tracking-[0.6em] opacity-40 uppercase block mb-8">Establish Connection</span>
          <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-none mb-12">
            Talk to <span className="text-white/20">The Machine</span>
          </h2>
          <div className="flex flex-col gap-12">
            <div className="group border-b border-white/10 pb-4 max-w-xl">
              <span className="block text-[10px] opacity-30 uppercase mb-2">Electronic Mail</span>
              <a href="mailto:void@sonic57.studio" className="text-2xl md:text-4xl font-light hover:italic transition-all">void@sonic57.studio</a>
            </div>
            <div className="group border-b border-white/10 pb-4 max-w-xl">
              <span className="block text-[10px] opacity-30 uppercase mb-2">Location Data</span>
              <span className="text-2xl md:text-4xl font-light">40.7128° N, 74.0060° W</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col justify-end text-right">
          <div className="space-y-4 opacity-40 text-xs tracking-widest uppercase">
            <p>Monolithic HQ</p>
            <p>Concrete District 09</p>
            <p>Sonic Corridor</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
