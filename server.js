// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { parse } = require('json2csv'); // Import json2csv for CSV export

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Setup LowDB (simple file-based database)
const adapter = new FileSync('db.json');
const db = low(adapter);

// Initialize data if db is empty
db.defaults({ feedback: [] }).write();

// Serve static files (frontend)
app.use(express.static('public'));

// Handle new feedback
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing feedback to new user
    socket.emit('initial-feedback', db.get('feedback').value());

    // Handle new feedback and broadcast it
    socket.on('new-feedback', (message) => {
        db.get('feedback').push(message).write();
        io.emit('new-feedback', message); // Broadcast to all users
    });

    // Handle emoji reactions
    socket.on('emoji-reaction', (reaction) => {
        console.log(`Emoji reaction received for feedback: "${reaction.feedback}" with emoji: ${reaction.emoji}`);
    });

    // Handle delete feedback by admin
    socket.on('delete-feedback', (index) => {
        db.get('feedback').splice(index, 1).write();
        io.emit('delete-feedback', index); // Broadcast to all clients to remove it
    });

    // Handle export feedback as CSV
    socket.on('export-feedback', () => {
        const feedback = db.get('feedback').value();  // Get feedback from the database

        if (feedback && feedback.length > 0) {
            // Specify the fields to be exported
            const csv = parse(feedback, { fields: ['feedback'] }); // Generate CSV
            socket.emit('export-feedback', csv); // Send CSV to the frontend
        } else {
            socket.emit('export-feedback', 'No feedback available to export.');
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
