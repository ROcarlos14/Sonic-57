import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Initialize table on first call
const initDb = async () => {
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
};

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await initDb();

        if (req.method === 'GET') {
            const result = await pool.query('SELECT * FROM tracks ORDER BY id DESC');
            return res.status(200).json(result.rows);
        }

        if (req.method === 'POST') {
            const { title, artist, album, duration, cover, audioUrl, genre } = req.body;
            const result = await pool.query(
                'INSERT INTO tracks (title, artist, album, duration, cover, audio_src, genre) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [title, artist, album, duration, cover, audioUrl, genre]
            );
            return res.status(201).json(result.rows[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}
