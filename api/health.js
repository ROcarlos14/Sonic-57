import pg from 'pg';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const dbUrl = process.env.DATABASE_URL;

    // Check if DATABASE_URL exists
    if (!dbUrl) {
        return res.status(500).json({
            status: 'ERROR',
            message: 'DATABASE_URL environment variable is NOT SET in Vercel',
            fix: 'Go to Vercel Dashboard → Project → Settings → Environment Variables → Add DATABASE_URL'
        });
    }

    // Mask password for display
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

    try {
        const pool = new pg.Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000
        });

        const result = await pool.query('SELECT NOW() as time, version() as version');
        await pool.end();

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Database connection successful!',
            database_url_preview: maskedUrl,
            server_time: result.rows[0].time,
            postgres_version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
        });
    } catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: 'Database connection FAILED',
            database_url_preview: maskedUrl,
            error_type: err.code || 'UNKNOWN',
            error_detail: err.message,
            fix: 'Check that your DATABASE_URL is correct and the database is accessible'
        });
    }
}
