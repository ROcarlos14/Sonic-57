
import React from 'react';

const experiments = [
  { id: 'R-01', title: 'Spatial Degradation', type: 'Phase Study', year: '2024' },
  { id: 'R-02', title: 'Hyper-Resonant Loops', type: 'Tension', year: '2025' },
  { id: 'R-03', title: 'Sub-Bass Architecture', type: 'Physicality', year: '2025' },
  { id: 'R-04', title: 'Granular Memory', type: 'Time Study', year: '2024' },
];

const Research: React.FC = () => {
  return (
    <section className="min-h-screen px-6 md:px-12 py-32">
      <div className="mb-24">
        <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase block mb-4">Sonic Laboratory</span>
        <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Research</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-white/5 border border-white/5">
        {experiments.map((exp) => (
          <div key={exp.id} className="bg-[#0a0a0a] p-12 hover:bg-white/5 transition-colors group cursor-crosshair">
            <div className="flex justify-between items-start mb-12">
              <span className="text-[10px] font-mono opacity-20">{exp.id}</span>
              <span className="text-[10px] font-mono opacity-20">{exp.year}</span>
            </div>
            <h4 className="text-4xl font-bold uppercase tracking-tighter mb-4 group-hover:italic transition-all">{exp.title}</h4>
            <div className="h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-700 mb-6"></div>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40">{exp.type}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Research;
