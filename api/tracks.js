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
            // Debug logging
            console.log('POST /api/tracks received');
            console.log('Body type:', typeof req.body);
            console.log('Body keys:', req.body ? Object.keys(req.body) : 'null');

            if (!req.body) {
                return res.status(400).json({ error: 'Request body is empty or not parsed' });
            }

            const { title, artist, album, duration, cover, audioUrl, genre } = req.body;

            if (!title || !artist) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    received: { title: !!title, artist: !!artist, album: !!album }
                });
            }

            console.log('Inserting track:', title, 'by', artist);

            const result = await pool.query(
                'INSERT INTO tracks (title, artist, album, duration, cover, audio_src, genre) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [title, artist, album || '', duration || '', cover || '', audioUrl || '', genre || 'Unknown']
            );

            console.log('Track inserted with ID:', result.rows[0].id);
            return res.status(201).json(result.rows[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({
            error: 'Server error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}

