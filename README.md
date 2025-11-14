# 🎓 ScottyLabs Founding Day 2025 - Real-Time Multiplayer Trivia Game

A real-time multiplayer trivia game built for ScottyLabs Founding Day 2025. This Kahoot-style game supports up to 50 concurrent players with live scoring, real-time question distribution, and an interactive leaderboard.

## 🎮 Features

- **Real-time Multiplayer**: Support for up to 50 concurrent players
- **Live Updates**: WebSocket-based real-time communication using Socket.io
- **Interactive Gameplay**: Timed questions with multiple-choice answers
- **Dynamic Scoring**: Points awarded based on correctness and response time
- **Live Leaderboard**: Real-time ranking updates after each question
- **Responsive Design**: Works on desktop and mobile devices
- **CMU-Themed Questions**: 10 trivia questions about Carnegie Mellon and ScottyLabs

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Real-time Communication**: Socket.io Client
- **Styling**: Custom CSS with animations and gradients

### Backend
- **Server**: Node.js with Express 4
- **WebSocket**: Socket.io 4 for real-time bidirectional communication
- **Data Storage**: In-memory Map (suitable for 50 concurrent players)
- **API**: RESTful endpoints for game management

## 📋 Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/scottylabs-labrador/founding-day-2025.git
cd founding-day-2025
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🎯 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3000`

### Start the Frontend Development Server

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎲 How to Play

### As a Host (Game Creator):

1. Open the application in your browser
2. Click **"Create Game"**
3. Enter your nickname
4. Share the generated game code with other players
5. Click **"Start Game"** when everyone has joined

### As a Player:

1. Open the application in your browser
2. Click **"Join Game"**
3. Enter your nickname and the game code
4. Wait for the host to start the game
5. Answer questions as quickly and accurately as possible!

## 🏆 Scoring System

- **Base Score**: 1000 points for correct answers
- **Time Bonus**: Up to 500 additional points based on response speed
- **Total Possible**: 1500 points per question
- **Incorrect Answers**: 0 points

The faster you answer correctly, the more points you earn!

## 📁 Project Structure

```
founding-day-2025/
├── backend/
│   ├── index.js          # Main server file with Express & Socket.io
│   ├── package.json      # Backend dependencies
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── WaitingRoom.jsx
│   │   │   ├── GamePlay.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── GameFinished.jsx
│   │   ├── App.jsx       # Main App component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js
│   └── node_modules/
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### REST API

- `GET /api/health` - Health check endpoint
- `POST /api/game/create` - Create a new game session
- `GET /api/game/:code` - Get game information

### WebSocket Events

#### Client → Server
- `join-game` - Join a game with game code and nickname
- `start-game` - Host starts the game
- `submit-answer` - Submit an answer to a question
- `get-leaderboard` - Request current leaderboard

#### Server → Client
- `joined-game` - Confirmation of joining a game
- `player-joined` - Notification when a player joins
- `player-left` - Notification when a player leaves
- `game-starting` - Game is about to start
- `question-start` - New question begins
- `answer-submitted` - Confirmation of answer submission
- `answer-reveal` - Correct answer revealed
- `leaderboard-show` - Leaderboard display
- `game-finished` - Game has ended
- `error` - Error message

## 🎨 Customization

### Adding More Questions

Edit the `triviaQuestions` array in `backend/index.js`:

```javascript
const triviaQuestions = [
  {
    id: 1,
    question: "Your question here?",
    answers: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0, // Index of correct answer (0-3)
    timeLimit: 20 // Seconds
  },
  // Add more questions...
];
```

### Changing Styles

- Component styles are in individual CSS files in `frontend/src/components/`
- Global styles are in `frontend/src/App.css` and `frontend/src/index.css`

## 🔐 Configuration

### Backend Port

Default: `3000`

Change in `backend/index.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Frontend API URL

Change in `frontend/src/App.jsx`:
```javascript
const SOCKET_URL = 'http://localhost:3000';
```

## 🚀 Deployment

### Backend

1. Set the `PORT` environment variable
2. Ensure WebSocket connections are supported by your hosting provider
3. Run: `npm start`

### Frontend

1. Update `SOCKET_URL` in `App.jsx` to your backend URL
2. Build: `npm run build`
3. Deploy the `dist` folder to your static hosting service

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Socket.io Client
- **Backend**: Node.js 20+, Express 4, Socket.io 4
- **Real-time**: WebSocket via Socket.io
- **Styling**: CSS3 with animations and gradients

## 📝 License

This project was created for ScottyLabs Founding Day 2025.

## 🤝 Contributing

This is a project for ScottyLabs Founding Day 2025. For questions or issues, please contact the ScottyLabs team.

## 🎉 Acknowledgments

Built for ScottyLabs Founding Day 2025 - Celebrating innovation and community at Carnegie Mellon University!
