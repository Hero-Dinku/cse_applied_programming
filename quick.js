// quick-server-5000.js - SIMPLE WORKING API
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 5000;
let tasks = [];

app.get('/', (req, res) => {
    res.json({ 
        api: 'CSE 310 Task API', 
        student: 'Dinku',
        port: PORT,
        message: 'Running on port 5000 (Ambar uses 3000)'
    });
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = { id: tasks.length + 1, ...req.body };
    tasks.push(task);
    res.status(201).json(task);
});

const fs = require('fs');
app.post('/log', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body) + '\n', () => {
        res.json({ message: 'File written' });
    });
});

app.get('/weather', (req, res) => {
    res.json({ temp: '42°F', location: 'Rexburg' });
});

app.listen(PORT, () => {
    console.log('✅ CSE 310 Server: http://localhost:' + PORT);
    console.log('✅ Port 5000 (free, Ambar uses 3000)');
});
