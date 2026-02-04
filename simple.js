// ultra-simple-server.js - 100% WORKING
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ api: 'CSE 310 API', status: 'working', student: 'Dinku' });
});

app.get('/tasks', (req, res) => {
    res.json([{id: 1, title: 'Sample Task' }]);
});

const fs = require('fs');
app.post('/log', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body) + '\n', () => {
        res.json({ message: 'Logged' });
    });
});

app.get('/weather', (req, res) => {
    res.json({ temp: '42°F', source: 'External API sim' });
});

app.listen(3000, () => console.log('Server: http://localhost:3000'));
