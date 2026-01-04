import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Get the track ID from the URL path
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Track ID is required' });
    }

    try {
        if (req.method === 'DELETE') {
            await pool.query('DELETE FROM tracks WHERE id = $1', [id]);
            return res.status(200).json({ message: 'Track deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: 'Server error', details: err.message });
    }
}
