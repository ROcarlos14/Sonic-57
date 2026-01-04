
import React from 'react';
import { RESOURCES } from '../constants';

const Resources: React.FC = () => {
  return (
    <section className="min-h-screen px-6 md:px-12 py-32">
      <div className="mb-24">
        <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-4">Internal Archive</span>
        <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Resources</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1 bg-white/5 border border-white/5">
        {RESOURCES.map((res, idx) => (
          <a 
            key={idx} 
            href={res.link}
            className="bg-[#0a0a0a] p-10 h-full hover:bg-white/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono opacity-20 mb-12 block">RES_LNK_0{idx + 1}</span>
              <h4 className="text-2xl font-bold uppercase tracking-tighter mb-4 group-hover:tracking-widest transition-all">{res.title}</h4>
              <p className="text-xs leading-relaxed opacity-40 uppercase tracking-widest">{res.desc}</p>
            </div>
            <div className="mt-12 flex justify-between items-end">
              <span className="text-[10px] font-mono border border-white/10 px-2 py-1">DOWNLOAD</span>
              <div className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                ↗
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Resources;
