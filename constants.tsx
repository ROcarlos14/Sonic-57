
import { Track } from './types';

// Using public domain high-quality samples for playback testing
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const SAMPLE_AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
const SAMPLE_AUDIO_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SILVER VOID',
    artist: 'Chrome Echo',
    album: 'Reflections',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO,
    duration: '06:12',
    genre: 'Techno'
  },
  {
    id: '2',
    title: 'NEON DUST',
    artist: 'Digital Noir',
    album: 'Lost Cities',
    cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_2,
    duration: '07:05',
    genre: 'Synthwave'
  },
  {
    id: '3',
    title: 'BRUTALIST BEAT',
    artist: 'Concrete Jungle',
    album: 'Structure',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_3,
    duration: '05:40',
    genre: 'IDM'
  },
  {
    id: '4',
    title: 'MONOCHROME',
    artist: 'Void Walker',
    album: 'Atmosphere',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO,
    duration: '02:58',
    genre: 'Ambient'
  },
  {
    id: '5',
    title: 'KINETIC FLOW',
    artist: 'Prism',
    album: 'Velocity',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_2,
    duration: '04:10',
    genre: 'Techno'
  },
  {
    id: '6',
    title: 'ORBITAL',
    artist: 'Luna',
    album: 'Tides',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_3,
    duration: '03:55',
    genre: 'Deep House'
  },
  {
    id: '7',
    title: 'STATIC DREAMS',
    artist: 'Glitch Mobius',
    album: 'Error Code',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO,
    duration: '04:40',
    genre: 'Experimental'
  },
  {
    id: '8',
    title: 'ECHO CHAMBER',
    artist: 'Resonance',
    album: 'Acoustics',
    cover: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_2,
    duration: '06:15',
    genre: 'Minimal'
  },
  {
    id: '9',
    title: 'PULSE WIDTH',
    artist: 'Oscillator',
    album: 'Synthesize',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO_3,
    duration: '03:20',
    genre: 'IDM'
  },
  {
    id: '10',
    title: 'WHITE NOISE',
    artist: 'Null Set',
    album: 'Zero',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    audioUrl: SAMPLE_AUDIO,
    duration: '07:05',
    genre: 'Noise'
  }
];

export const RESOURCES = [
  { title: "Brand Identity", desc: "The visual language of Sonic-57.", link: "#" },
  { title: "Audio Manifesto v1.2", desc: "Our technical whitepaper on brutalist acoustics.", link: "#" },
  { title: "Sonic Sample Kit", desc: "1.2GB of processed structural recordings.", link: "#" },
  { title: "Design Systems", desc: "The CSS architecture behind the interface.", link: "#" },
  { title: "API Documentation", desc: "Programmatic access to our curation engine.", link: "#" },
  { title: "Community Discord", desc: "Join the collective of sonic architects.", link: "#" },
  { title: "Licensing Models", desc: "Commercial use terms for the Vault tracks.", link: "#" },
  { title: "Hardware Labs", desc: "Experimental modules and synthesizer concepts.", link: "#" }
];
