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

// Database Connection
// Vercel Postgres usually provides POSTGRES_URL or DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:NAROKAna@14@localhost:5432/sonic57",
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

// Root route for health check
app.get('/', (req, res) => {
    res.send('Sonic-57 API Core Online');
});

export default app;
