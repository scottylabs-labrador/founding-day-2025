# Quick Start Guide - ScottyLabs Trivia Game

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd ../frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Step 3: Play!

1. Open your browser to `http://localhost:5173`
2. Click **"Create Game"** to host a game
3. Share the game code with other players
4. Have other players click **"Join Game"** and enter the code
5. Click **"Start Game"** when everyone has joined
6. Answer questions as fast as you can!

---

## 🎯 Scoring

- **1000 points** for correct answers
- **Up to 500 bonus points** for fast responses
- **0 points** for incorrect answers

The faster you answer correctly, the more points you earn!

---

## 📱 Multiple Players Testing

To test with multiple players on the same machine:

1. Open multiple browser windows/tabs to `http://localhost:5173`
2. Create a game in the first window
3. Join with the game code in other windows
4. Each player needs a unique nickname

---

## 🎓 Trivia Questions Included

The game includes 10 questions about:
- Carnegie Mellon University history
- CMU mascot and traditions  
- ScottyLabs organization
- CMU notable alumni
- Campus landmarks and events

---

## 🔧 Troubleshooting

**Backend won't start:**
- Make sure port 3000 is not in use
- Run `npm install` in the backend directory

**Frontend won't start:**
- Make sure port 5173 is not in use
- Run `npm install` in the frontend directory

**Can't connect to game:**
- Ensure both backend and frontend servers are running
- Check browser console for errors
- Verify the game code is entered correctly

---

## 📚 Need More Help?

See the main [README.md](../README.md) for detailed documentation.

---

**Built for ScottyLabs Founding Day 2025** 🎉
