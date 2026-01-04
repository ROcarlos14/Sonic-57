import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection - uses DATABASE_URL from environment only
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test Connection (Optional logging)
pool.connect((err, client, release) => {
    if (err) {
        // console.error('Error acquiring client', err.stack); // Silent/Optional in prod
    } else {
        client.query('SELECT NOW()', (err, result) => {
            release();
            if (!err) {
                console.log('Connected to Database:', result.rows[0]);
            }
        });
    }
});

// Initialize Database Table
const initDb = async () => {
    try {
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
        // Add genre column if it doesn't exist (migration for existing table)
        await pool.query(`
            ALTER TABLE tracks ADD COLUMN IF NOT EXISTS genre VARCHAR(100);
        `);
        console.log("Tracks table verified/created");
    } catch (err) {
        console.error("Error initializing DB:", err);
    }
};

// Run init on startup (or per invocation in serverless, lighter check recommended for prod but ok for now)
initDb();

// Routes

app.get('/api/tracks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tracks ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/tracks', async (req, res) => {
    const { title, artist, album, duration, cover, audioUrl, genre } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tracks (title, artist, album, duration, cover, audio_src, genre) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, artist, album, duration, cover, audioUrl, genre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/tracks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tracks WHERE id = $1', [id]);
        res.json({ message: 'Track deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Seed Route
app.post('/api/seed', async (req, res) => {
    const MOCK_DATA = [
        {
            title: 'SILVER VOID',
            artist: 'Chrome Echo',
            album: 'Reflections',
            cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: '06:12',
            genre: 'Techno'
        },
        {
            title: 'NEON DUST',
            artist: 'Digital Noir',
            album: 'Lost Cities',
            cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            duration: '07:05',
            genre: 'Synthwave'
        },
        {
            title: 'BRUTALIST BEAT',
            artist: 'Concrete Jungle',
            album: 'Structure',
            cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            duration: '05:40',
            genre: 'IDM'
        },
        {
            title: 'MONOCHROME',
            artist: 'Void Walker',
            album: 'Atmosphere',
            cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: '02:58',
            genre: 'Ambient'
        },
        {
            title: 'KINETIC FLOW',
            artist: 'Prism',
            album: 'Velocity',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            duration: '04:10',
            genre: 'Techno'
        },
        {
            title: 'ORBITAL',
            artist: 'Luna',
            album: 'Tides',
            cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            duration: '03:55',
            genre: 'Deep House'
        },
        {
            title: 'STATIC DREAMS',
            artist: 'Glitch Mobius',
            album: 'Error Code',
            cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: '04:40',
            genre: 'Experimental'
        },
        {
            title: 'ECHO CHAMBER',
            artist: 'Resonance',
            album: 'Acoustics',
            cover: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            duration: '06:15',
            genre: 'Minimal'
        },
        {
            title: 'PULSE WIDTH',
            artist: 'Oscillator',
            album: 'Synthesize',
            cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            duration: '03:20',
            genre: 'IDM'
        },
        {
            title: 'WHITE NOISE',
            artist: 'Null Set',
            album: 'Zero',
            cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
            audio_src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            duration: '07:05',
            genre: 'Noise'
        }
    ];

    try {
        const check = await pool.query('SELECT COUNT(*) FROM tracks');
        if (parseInt(check.rows[0].count) > 0) {
            return res.json({ message: 'Database already seeded' });
        }

        for (const track of MOCK_DATA) {
            await pool.query(
                'INSERT INTO tracks (title, artist, album, duration, cover, audio_src, genre) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [track.title, track.artist, track.album, track.duration, track.cover, track.audio_src, track.genre]
            );
        }
        res.json({ message: 'Database seeded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Seeding failed' });
    }
});

// Root route for health check
app.get('/', (req, res) => {
    res.send('Sonic-57 API Core Online');
});

export default app;
