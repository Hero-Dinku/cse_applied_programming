// server.js - CSE 310 Module 1 - MINIMAL WORKING VERSION
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Sample data
let tasks = [
    { id: 1, title: 'Complete CSE 310 Module 1', status: 'pending' },
    { id: 2, title: 'Submit assignment', status: 'pending' }
];

// Home
app.get('/', (req, res) => {
    res.json({ 
        api: 'Task API', 
        student: 'Your Name',
        endpoints: ['GET /tasks', 'POST /tasks', 'POST /log']
    });
});

// Get tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create task
app.post('/tasks', (req, res) => {
    const task = { id: tasks.length + 1, ...req.body };
    tasks.push(task);
    res.status(201).json(task);
});

// File I/O
app.post('/log', (req, res) => {
    const log = { timestamp: new Date(), ...req.body };
    fs.appendFile('log.txt', JSON.stringify(log) + '\n', (err) => {
        if (err) {
            res.status(500).json({ error: 'File write failed' });
        } else {
            res.json({ message: 'Logged', entry: log });
        }
    });
});

// External API simulation
app.get('/weather', (req, res) => {
    res.json({ 
        location: 'Rexburg', 
        temp: '45°F',
        note: 'External API simulation' 
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('CSE 310 Module 1 - Ready for submission!');
});
