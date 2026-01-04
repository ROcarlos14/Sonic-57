
import React, { useState } from 'react';
import { Track } from '../types';
import { Upload, Music, Image as ImageIcon, Trash2, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface AdminProps {
  onAddTrack: (track: Track) => void;
  onDeleteTrack: (id: string) => void;
  tracks: Track[];
}

const Admin: React.FC<AdminProps> = ({ onAddTrack, onDeleteTrack, tracks }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Techno',
    duration: '03:45'
  });
  const [coverFile, setCoverFile] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'cover') setCoverFile(result);
      else setAudioFile(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !audioFile) {
      setStatus({ type: 'error', message: 'Visual and Auditory files are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'success', message: 'COMMITING TO ARCHIVE CORE...' });

    try {
      console.log("Submitting new track:", formData);
      const newTrack: Track = {
        id: `upl-${Date.now()}`, // Temporary ID, backend should replace or we use it
        ...formData,
        cover: coverFile,
        audioUrl: audioFile
      };

      console.log("Calling onAddTrack...");
      await onAddTrack(newTrack);
      console.log("onAddTrack completed.");

      setIsSubmitting(false);
      setStatus({ type: 'success', message: 'FRAGMENT INGESTED AND PERSISTED.' });
      alert("Success: Track saved to database!");

      // Reset form
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: 'Techno',
        duration: '03:45'
      });
      setCoverFile(null);
      setAudioFile(null);

      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Admin Submission Error:", err);
      setIsSubmitting(false);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ type: 'error', message: `ERROR: ${errMsg}` });
      alert(`Failed to save track: ${errMsg}\nCheck console for details.`);
    }
  };

  return (
    <section className="min-h-screen px-6 md:px-12 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Upload Form */}
        <div className="lg:col-span-5">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase block mb-4 flex items-center gap-2">
              <Database size={10} className="text-green-500" />
              Sonic Archive Core Connection: Secured
            </span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Ingest<br /><span className="text-white/20 italic">Module</span></h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Frequency Name (Title)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 focus:border-white outline-none transition-all uppercase text-sm font-light tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Source Entity (Artist)</label>
                <input
                  type="text"
                  required
                  value={formData.artist}
                  onChange={e => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 focus:border-white outline-none transition-all uppercase text-sm font-light tracking-widest"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Archive (Album)</label>
                <input
                  type="text"
                  required
                  value={formData.album}
                  onChange={e => setFormData({ ...formData, album: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 focus:border-white outline-none transition-all uppercase text-sm font-light tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-40">Classification (Genre)</label>
                <select
                  className="w-full bg-white/5 border border-white/10 p-4 focus:border-white outline-none transition-all uppercase text-sm font-light tracking-widest appearance-none"
                  value={formData.genre}
                  onChange={e => setFormData({ ...formData, genre: e.target.value })}
                >
                  <option className="bg-[#111]">Techno</option>
                  <option className="bg-[#111]">Synthwave</option>
                  <option className="bg-[#111]">Ambient</option>
                  <option className="bg-[#111]">IDM</option>
                  <option className="bg-[#111]">Experimental</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <ImageIcon size={12} /> Visual Proxy (Cover)
                </label>
                <div className={`relative border-2 border-dashed border-white/10 aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group overflow-hidden ${coverFile ? 'border-solid border-white/40' : ''}`}>
                  {coverFile ? (
                    <img src={coverFile} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <>
                      <Upload size={24} className="opacity-20 group-hover:opacity-100 mb-2 transition-opacity" />
                      <span className="text-[8px] uppercase tracking-[0.3em] opacity-40">Select JPG/PNG</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => handleFileChange(e, 'cover')}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest opacity-40 flex items-center gap-2">
                  <Music size={12} /> Auditory Stream (MP3)
                </label>
                <div className={`relative border-2 border-dashed border-white/10 aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group ${audioFile ? 'border-solid border-white/40 bg-white/5' : ''}`}>
                  {audioFile ? (
                    <CheckCircle size={32} className="text-white/40" />
                  ) : (
                    <>
                      <Upload size={24} className="opacity-20 group-hover:opacity-100 mb-2 transition-opacity" />
                      <span className="text-[8px] uppercase tracking-[0.3em] opacity-40">Select Audio</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="audio/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => handleFileChange(e, 'audio')}
                  />
                </div>
                {audioFile && <span className="text-[8px] font-mono opacity-20 block text-center uppercase">Stream Loaded</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.5em] text-xs hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl"
            >
              {isSubmitting ? 'Syncing to Core...' : 'Initiate Ingest'}
            </button>

            {status && (
              <div className={`p-4 text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* Right: Existing Tracks Management */}
        <div className="lg:col-span-7">
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <span className="text-[10px] tracking-[0.5em] opacity-40 uppercase">Archival Fragments</span>
            <span className="text-[8px] font-mono opacity-20 uppercase">Core Capacity: {tracks.length} Entities</span>
          </div>

          <div className="space-y-1 max-h-[70vh] overflow-y-auto scrollbar-hide pr-4">
            {tracks.map((track, i) => (
              <div key={track.id} className="group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-[8px] font-mono opacity-20">{(i + 1).toString().padStart(2, '0')}</span>
                  <div className="w-10 h-10 overflow-hidden bg-white/5">
                    <img src={track.cover} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">{track.title}</h4>
                    <p className="text-[8px] opacity-40 uppercase tracking-widest">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[8px] font-mono opacity-20 uppercase border border-white/10 px-2 py-0.5">{track.genre}</span>
                  <button
                    onClick={() => onDeleteTrack(track.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:scale-110 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
