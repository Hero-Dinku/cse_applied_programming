// server-5000.js - CSE 310 Module 1 on PORT 5000
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 5000; // CHANGED TO 5000

// Variables
const API_NAME = 'Task API - CSE 310';
const STUDENT = 'Dinku';

// Data
let tasks = [{ id: 1, title: 'Sample Task', status: 'pending' }];

// Home
app.get('/', (req, res) => {
    res.json({
        api: API_NAME,
        student: STUDENT,
        port: PORT,
        endpoints: ['GET /tasks', 'POST /tasks', 'POST /log', 'GET /weather']
    });
});

// Get tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create task
app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    res.status(201).json(task);
});

// File I/O
app.post('/log', (req, res) => {
    const log = {
        timestamp: new Date().toISOString(),
        ...req.body
    };
    fs.appendFile('cse310.log', JSON.stringify(log) + '\n', (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Logged', entry: log });
        }
    });
});

// External API
app.get('/weather', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.open-meteo.com/v1/forecast?latitude=43.82&longitude=-111.79&current_weather=true'
        );
        res.json({
            source: 'Open-Meteo API',
            data: response.data.current_weather
        });
    } catch {
        res.json({
            source: 'Simulated',
            data: { temperature: 45, conditions: 'Sunny' }
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('=========================================');
    console.log('CSE 310 MODULE 1 - TASK API');
    console.log('=========================================');
    console.log('Server: http://localhost:' + PORT);
    console.log('Port: ' + PORT + ' (Ambar uses 3000)');
    console.log('Student: ' + STUDENT);
    console.log('Status: RUNNING');
    console.log('=========================================');
    console.log('Endpoints:');
    console.log('  GET  /       - API info');
    console.log('  GET  /tasks  - Get tasks');
    console.log('  POST /tasks  - Create task');
    console.log('  POST /log    - File operations');
    console.log('  GET  /weather - External API');
    console.log('=========================================');
    console.log('');
});
