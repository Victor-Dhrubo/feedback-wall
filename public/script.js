// public/script.js
const socket = io();

// Get elements
const feedbackList = document.getElementById('feedback-list');
const feedbackInput = document.getElementById('feedback-input');
const submitButton = document.getElementById('submit-feedback');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const exportButton = document.getElementById('export-feedback');

// Render feedback list
function renderFeedback(feedback, index) {
    const feedbackItem = document.createElement('div');
    feedbackItem.classList.add('feedback-item');
    feedbackItem.innerHTML = `
        <p>${feedback}</p>
        <button class="emoji-btn" data-feedback="${feedback}">👍</button>
        <button class="emoji-btn" data-feedback="${feedback}">😂</button>
        <button class="emoji-btn" data-feedback="${feedback}">😡</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    feedbackList.appendChild(feedbackItem);
}

// Send new feedback to server
submitButton.addEventListener('click', () => {
    const feedback = feedbackInput.value.trim();
    if (feedback) {
        socket.emit('new-feedback', feedback);
        feedbackInput.value = ''; // Clear input
    }
});

// Listen for new feedback from the server
socket.on('new-feedback', (feedback) => {
    renderFeedback(feedback, feedbackList.children.length);
});

// Listen for initial feedback when the user connects
socket.on('initial-feedback', (feedbackArray) => {
    feedbackArray.forEach((feedback, index) => {
        renderFeedback(feedback, index);
    });
});

// Handle emoji reactions
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('emoji-btn')) {
        const emoji = event.target.innerText.trim(); // Ensure it's a clean string
        const feedback = event.target.getAttribute('data-feedback');
        console.log(`Reacted to: "${feedback}" with emoji: ${emoji}`);
        socket.emit('emoji-reaction', { emoji, feedback });  // Send emoji and feedback as simple objects
    }
});

// Delete feedback by admin
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        socket.emit('delete-feedback', index); // Send index to delete
    }
});

// Listen for feedback deletion broadcast
socket.on('delete-feedback', (index) => {
    const feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems[index].remove(); // Remove feedback item from DOM
});

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems.forEach(item => item.classList.toggle('dark-mode'));
});

// Export feedback as CSV
exportButton.addEventListener('click', () => {
    socket.emit('export-feedback');
});

// Listen for exported feedback CSV
socket.on('export-feedback', (csvData) => {
    if (csvData === 'No feedback available to export.') {
        alert(csvData); // Display an alert if there's no feedback
    } else {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'feedback.csv';
        link.click();
    }
});
