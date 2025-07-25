# Feedback Wall

A live, interactive feedback board where users can anonymously post feedback messages, and other users can react with emojis. This project utilizes **Node.js** with **Express**, **Socket.io** for real-time communication, and **Lowdb** for lightweight, file-based storage.

## Features

- **Real-time Feedback**: Users can submit feedback which appears immediately for all connected users.
- **Emoji Reactions**: Users can react to feedback using emoji reactions (👍, 😂, 😡).
- **Delete Feedback**: Admins can delete inappropriate feedback.
- **Export Feedback**: Export all feedback to a CSV file.
- **Dark Mode**: Toggle dark mode for a cozy viewing experience.

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Websockets**: Socket.io for real-time data sync
- **Storage**: Lowdb (for local storage of feedback data)
- **CSV Export**: json2csv for exporting feedback to a CSV file

## Installation

To get started with the project locally, follow these steps:

### 1. Clone the repository:

```bash
git clone https://github.com/Victor-Dhrubo/feedback-wall.git
