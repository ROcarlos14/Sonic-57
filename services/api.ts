
import { Track } from '../types';

const API_URL = '/api/tracks';

export const SonicApi = {
    async getTracks(): Promise<Track[]> {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tracks');
        const data = await response.json();
        return data.map((t: any) => ({
            ...t,
            audioUrl: t.audio_src, // Map snake_case to camelCase
            genre: t.genre || 'Unknown'
        }));
    },

    async saveTrack(track: Track): Promise<Track> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: track.title,
                artist: track.artist,
                album: track.album,
                duration: track.duration,
                cover: track.cover,
                audioUrl: track.audioUrl || '',
                genre: track.genre || 'Experimental'
            })
        });
        if (!response.ok) throw new Error('Failed to save track');
        const saved = await response.json();
        return {
            ...saved,
            audioUrl: saved.audio_src,
            genre: saved.genre || 'Unknown'
        };
    },

    async deleteTrack(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete track');
    }
};
