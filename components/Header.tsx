
import React, { useState } from 'react';
import { AppSection } from '../types';

interface HeaderProps {
  currentSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-[100] px-6 py-8 md:px-12 pointer-events-none"
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <div className="flex justify-between items-center w-full">
        <div className="pointer-events-auto">
          <h1
            className="text-2xl font-black tracking-tighter cursor-pointer hover:opacity-50 transition-opacity"
            onClick={() => {
              onSectionChange(AppSection.HOME);
              setIsMenuOpen(false);
            }}
          >
            SONIC-57<sup>©</sup>
          </h1>
        </div>

        {/* Menu Trigger */}
        <div
          className="pointer-events-auto relative group py-4 px-2 cursor-pointer flex items-center gap-6"
          onMouseEnter={() => setIsMenuOpen(true)}
        >


          <div className="flex flex-col items-end gap-1.5">
            <div className={`h-[2px] bg-white transition-all duration-500 ${isMenuOpen ? 'w-8 rotate-45 translate-y-[5px]' : 'w-8'}`}></div>
            <div className={`h-[2px] bg-white transition-all duration-500 ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-[6px]' : 'w-5'}`}></div>
          </div>
        </div>
      </div>

      {/* Integrated Overlay Menu */}
      <div
        className={`absolute top-0 right-0 h-screen w-full md:w-[35vw] bg-[#0a0a0a]/98 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-auto shadow-2xl border-l border-white/5 overflow-y-auto scrollbar-hide ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
          }`}
      >
        <div className="min-h-full flex flex-col justify-center py-20 px-10 md:px-16 relative">
          <div className="absolute top-12 left-10 text-[9px] tracking-[0.5em] opacity-20 uppercase font-mono">
            Navigation System // v.057
          </div>

          <div className="flex flex-col gap-4">
            {Object.values(AppSection).map((section, idx) => (
              <button
                key={section}
                onClick={() => {
                  onSectionChange(section);
                  setIsMenuOpen(false);
                }}
                className={`group flex items-center gap-4 text-left py-1`}
              >
                <span className="text-[9px] font-mono opacity-20 group-hover:opacity-100 transition-opacity w-5">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className={`text-xl md:text-2xl font-bold uppercase tracking-widest transition-all duration-500 hover:pl-2 flex items-center gap-3 ${currentSection === section ? 'text-white italic' : 'text-white/30 hover:text-white'
                  }`}>
                  {section}

                </span>
              </button>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5">
            <div className="mb-6">
              <span className="block text-[8px] tracking-[0.4em] opacity-30 uppercase mb-3">Core Modules</span>
              <p className="text-[10px] leading-relaxed opacity-40 uppercase tracking-widest max-w-[220px]">
                Brutalist Audio fragments and SONIC-AI generative logic for the digital elite.
              </p>
            </div>
            <div className="flex gap-6 text-[8px] tracking-[0.2em] uppercase opacity-40">
              <a href="#" className="hover:text-white transition-colors">Lab</a>
              <a href="#" className="hover:text-white transition-colors">Social</a>
              <a href="#" className="hover:text-white transition-colors">Vault</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
