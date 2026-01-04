
import { Track } from '../types';
import { MOCK_TRACKS } from '../constants';

const TRACKS_KEY = 's57_tracks_v1';
const LIBRARY_KEY = 's57_library_v1';

/**
 * Simulates a database delay to mimic network latency
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const SonicDatabase = {
  /**
   * Initialize the database with mock data if empty
   */
  async initialize(): Promise<void> {
    if (!localStorage.getItem(TRACKS_KEY)) {
      localStorage.setItem(TRACKS_KEY, JSON.stringify(MOCK_TRACKS));
    }
    if (!localStorage.getItem(LIBRARY_KEY)) {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(MOCK_TRACKS.slice(0, 3)));
    }
    await delay(500);
  },

  async getTracks(): Promise<Track[]> {
    await delay(300);
    const data = localStorage.getItem(TRACKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveTrack(track: Track): Promise<void> {
    await delay(800);
    const tracks = await this.getTracks();
    const updated = [track, ...tracks];
    localStorage.setItem(TRACKS_KEY, JSON.stringify(updated));
  },

  async deleteTrack(id: string): Promise<void> {
    await delay(500);
    const tracks = await this.getTracks();
    const updated = tracks.filter(t => t.id !== id);
    localStorage.setItem(TRACKS_KEY, JSON.stringify(updated));
    
    // Also remove from library if it exists there
    const lib = await this.getLibrary();
    const updatedLib = lib.filter(t => t.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLib));
  },

  async getLibrary(): Promise<Track[]> {
    await delay(200);
    const data = localStorage.getItem(LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  },

  async addToLibrary(track: Track): Promise<void> {
    await delay(400);
    const lib = await this.getLibrary();
    if (!lib.find(t => t.id === track.id)) {
      const updated = [track, ...lib];
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
    }
  },

  async removeFromLibrary(id: string): Promise<void> {
    await delay(300);
    const lib = await this.getLibrary();
    const updated = lib.filter(t => t.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
  }
};
