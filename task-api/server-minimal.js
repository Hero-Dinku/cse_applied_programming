// server-minimal.js - SIMPLE VERSION
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// SIMPLE MongoDB connection (without complex options)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err.message));

// SIMPLE Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// SIMPLE Routes
app.get('/', (req, res) => {
    res.json({ message: 'Task API - Simple Version', status: 'running' });
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET single task
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File I/O requirement - Write to log file
const fs = require('fs');
app.post('/api/log', (req, res) => {
    const log = {
        timestamp: new Date().toISOString(),
        action: req.body.action || 'unknown',
        data: req.body.data
    };
    
    fs.appendFile('api.log', JSON.stringify(log) + '\n', (err) => {
        if (err) {
            console.error('Log error:', err);
            res.status(500).json({ error: 'Failed to write log' });
        } else {
            res.json({ message: 'Logged successfully' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\🚀 Server running on http://localhost:\\);
    console.log(\📝 API Endpoints:\);
    console.log(\  GET  http://localhost:\/api/tasks\);
    console.log(\  POST http://localhost:\/api/tasks\);
    console.log(\  POST http://localhost:\/api/log\);
});
