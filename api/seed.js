import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const MOCK_DATA = [
    { title: 'SILVER VOID', artist: 'Chrome Echo', album: 'Reflections', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '06:12', genre: 'Techno' },
    { title: 'NEON DUST', artist: 'Digital Noir', album: 'Lost Cities', cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '07:05', genre: 'Synthwave' },
    { title: 'BRUTALIST BEAT', artist: 'Concrete Jungle', album: 'Structure', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '05:40', genre: 'IDM' },
    { title: 'MONOCHROME', artist: 'Void Walker', album: 'Atmosphere', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '02:58', genre: 'Ambient' },
    { title: 'KINETIC FLOW', artist: 'Prism', album: 'Velocity', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '04:10', genre: 'Techno' },
    { title: 'ORBITAL', artist: 'Luna', album: 'Tides', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '03:55', genre: 'Deep House' },
    { title: 'STATIC DREAMS', artist: 'Glitch Mobius', album: 'Error Code', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '04:40', genre: 'Experimental' },
    { title: 'ECHO CHAMBER', artist: 'Resonance', album: 'Acoustics', cover: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '06:15', genre: 'Minimal' },
    { title: 'PULSE WIDTH', artist: 'Oscillator', album: 'Synthesize', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '03:20', genre: 'IDM' },
    { title: 'WHITE NOISE', artist: 'Null Set', album: 'Zero', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', audio_src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '07:05', genre: 'Noise' }
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        // Create table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tracks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                artist VARCHAR(255) NOT NULL,
                album VARCHAR(255),
                duration VARCHAR(50),
                cover TEXT,
                audio_src TEXT,
                genre VARCHAR(100)
            );
        `);

        const check = await pool.query('SELECT COUNT(*) FROM tracks');
        if (parseInt(check.rows[0].count) > 0) {
            return res.status(200).json({ message: 'Database already seeded', count: check.rows[0].count });
        }

        for (const track of MOCK_DATA) {
            await pool.query(
                'INSERT INTO tracks (title, artist, album, duration, cover, audio_src, genre) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [track.title, track.artist, track.album, track.duration, track.cover, track.audio_src, track.genre]
            );
        }

        return res.status(200).json({ message: 'Database seeded successfully' });
    } catch (err) {
        console.error('Seed Error:', err);
        return res.status(500).json({ error: 'Seeding failed', details: err.message });
    }
}
