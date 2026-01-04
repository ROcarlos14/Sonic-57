
const fetch = require('node-fetch'); // might not be available, use http
const http = require('http');

http.get('http://localhost:5000/api/tracks', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.length > 0) {
                console.log('First track keys:', Object.keys(parsed[0]));
                console.log('First track audio field:', parsed[0].audio_url, parsed[0].audio_src);
            } else {
                console.log('No tracks found');
            }
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error: ' + err.message);
});
