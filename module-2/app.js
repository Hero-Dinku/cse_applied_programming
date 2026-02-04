// app.js - CSE 310 Module 2 - Frontend Application
// Demonstrates: Variables, Conditionals, Loops, Functions, DOM Manipulation, File I/O

// ========== VARIABLES & CONSTANTS ==========
const API_BASE_URL = 'http://localhost:3002';
let allTasks = [];
let currentFilter = 'all';

// ========== DOM ELEMENTS ==========
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const statsElement = document.getElementById('stats');
const weatherElement = document.getElementById('weather');

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', initializeApp);
taskForm.addEventListener('submit', handleTaskSubmit);

// ========== FUNCTIONS ==========

// Initialize application
function initializeApp() {
    console.log('CSE 310 Task Manager - Module 2');
    loadTasks();
    loadWeather();
    updateStats();
}

// Load all tasks from API
async function loadTasks() {
    try {
        showLoading('Loading tasks...');
        const response = await fetch(\\/tasks\);
        
        if (!response.ok) {
            throw new Error(\HTTP error! Status: \\);
        }
        
        const data = await response.json();
        allTasks = data.tasks || [];
        displayTasks(allTasks);
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks. Make sure the API server is running on port 3002.');
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Check if no tasks
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="task-item">No tasks found. Add your first task!</div>';
        return;
    }
    
    // Loop through tasks and create HTML
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

// Create HTML element for a task
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = \	ask-item \\;
    
    // Determine priority class
    let priorityClass = 'priority-medium';
    if (task.priority === 'high') priorityClass = 'priority-high';
    if (task.priority === 'low') priorityClass = 'priority-low';
    
    div.innerHTML = \
        <div class="task-header">
            <div class="task-title">\</div>
            <span class="task-priority \">\</span>
        </div>
        <div class="task-description">\</div>
        <div class="task-meta">
            <small>Created: \</small>
            <small> | Status: \</small>
        </div>
        <div class="task-actions">
            <button onclick="toggleTaskStatus(\)">
                \
            </button>
            <button onclick="deleteTask(\)" style="background: #ff6b6b;">🗑️ Delete</button>
        </div>
    \;
    
    return div;
}

// Handle task form submission
async function handleTaskSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(\\/tasks\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                priority: priority
            })
        });
        
        if (response.ok) {
            // Clear form
            taskForm.reset();
            document.getElementById('title').focus();
            
            // Reload tasks
            loadTasks();
            
            // Log the action
            await logAction('task_created', { title: title, priority: priority });
        } else {
            throw new Error('Failed to create task');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
    }
}

// Toggle task status (complete/pending)
async function toggleTaskStatus(taskId) {
    try {
        // Find the task
        const task = allTasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        
        // In a real app, you would send a PUT request to update the task
        // For now, we'll just update locally and log the action
        task.status = newStatus;
        displayTasks(allTasks.filter(t => currentFilter === 'all' || t.status === currentFilter));
        updateStats();
        
        await logAction('task_updated', { 
            taskId: taskId, 
            newStatus: newStatus 
        });
        
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Delete a task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        // In a real app, you would send a DELETE request
        // For now, we'll just update locally
        allTasks = allTasks.filter(task => task.id !== taskId);
        displayTasks(allTasks.filter(t => currentFilter === 'all' || t.status === currentFilter));
        updateStats();
        
        await logAction('task_deleted', { taskId: taskId });
        
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Filter tasks by status
function filterTasks() {
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    currentFilter = selectedFilter;
    
    let filteredTasks = allTasks;
    if (selectedFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === selectedFilter);
    }
    
    displayTasks(filteredTasks);
}

// Load weather data
async function loadWeather() {
    try {
        const response = await fetch(\\/weather\);
        const data = await response.json();
        
        weatherElement.innerHTML = \
            <p><strong>Location:</strong> \</p>
            <p><strong>Temperature:</strong> \</p>
            <p><strong>Conditions:</strong> \</p>
            <p><small>Source: \</small></p>
        \;
        
    } catch (error) {
        console.error('Error loading weather:', error);
        weatherElement.innerHTML = '<p>Weather data unavailable</p>';
    }
}

// Update statistics
function updateStats() {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    
    statsElement.innerHTML = \
        <p><strong>Total Tasks:</strong> \</p>
        <p><strong>Completed:</strong> \</p>
        <p><strong>Pending:</strong> \</p>
        <p><strong>Completion Rate:</strong> \%</p>
    \;
}

// ========== FILE I/O OPERATIONS ==========

// Export tasks to JSON file
function exportToJSON() {
    const dataStr = JSON.stringify(allTasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = \	asks_\.json\;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    logAction('file_export', { format: 'JSON', count: allTasks.length });
}

// Export tasks to CSV file
function exportToCSV() {
    if (allTasks.length === 0) {
        alert('No tasks to export');
        return;
    }
    
    // Create CSV headers
    let csv = 'ID,Title,Description,Priority,Status,Created At\\n';
    
    // Add each task as a row
    allTasks.forEach(task => {
        const row = [
            task.id,
            \"\"\,
            \"\"\,
            task.priority,
            task.status,
            task.createdAt
        ].join(',');
        
        csv += row + '\\n';
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const exportFileDefaultName = \	asks_\.csv\;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    logAction('file_export', { format: 'CSV', count: allTasks.length });
}

// Log actions (simulates backend logging)
async function logAction(action, data) {
    try {
        await fetch(\\/log\, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                data: data,
                timestamp: new Date().toISOString(),
                source: 'frontend'
            })
        });
    } catch (error) {
        console.error('Error logging action:', error);
    }
}

// ========== HELPER FUNCTIONS ==========

function showLoading(message) {
    tasksContainer.innerHTML = \<div class="loading">\</div>\;
}

function showError(message) {
    tasksContainer.innerHTML = \<div class="task-item" style="border-left-color: #ff6b6b; background: #ffeaea;">
        <div class="task-title">Error</div>
        <div class="task-description">\</div>
        <button onclick="loadTasks()">Try Again</button>
    </div>\;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeCsv(text) {
    return text.replace(/"/g, '""');
}

// ========== DEMONSTRATE PROGRAMMING CONCEPTS ==========

// Variables: let, const used throughout
// Conditionals: if/else, ternary operators used
// Loops: forEach, filter, map used
// Functions: Multiple functions demonstrating different purposes
// DOM Manipulation: Creating, updating, removing elements
// File I/O: Export to JSON and CSV
// External API: Weather data integration
// Event Handling: Form submission, button clicks
// Error Handling: Try/catch blocks throughout

console.log('Module 2 - JavaScript Web Application loaded successfully');
