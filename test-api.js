// test-api.js
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(\Status: \\);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response:', JSON.parse(data));
        console.log('✅ API is running!');
    });
});

req.on('error', (e) => {
    console.error('❌ API Error:', e.message);
    console.log('Start the server first with: npm run dev');
});

req.end();
