
const http = require('http');

const data = JSON.stringify({
    title: "Heavy Load Test",
    artist: "Test Bot",
    album: "Debug Album",
    duration: "05:00",
    cover: "data:image/png;base64," + "a".repeat(1024 * 1024 * 2), // 2MB dummy image
    audioUrl: "data:audio/mp3;base64," + "b".repeat(1024 * 1024 * 5), // 5MB dummy audio
    genre: "Test"
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/tracks',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
