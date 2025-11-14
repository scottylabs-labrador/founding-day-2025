import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://founding.scottylabs.org",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory data storage
const games = new Map();
const players = new Map();

// Sample trivia questions
const triviaQuestions = [
  {
    id: 1,
    question: "What year was Carnegie Mellon University founded?",
    answers: ["1900", "1912", "1923", "1935"],
    correctAnswer: 1,
    timeLimit: 20
  },
  {
    id: 2,
    question: "What is the name of CMU's mascot?",
    answers: ["Scottie Dog", "Tartan", "Scotty the Scottie Dog", "Andrew Carnegie"],
    correctAnswer: 2,
    timeLimit: 20
  },
  {
    id: 3,
    question: "Which CMU alumnus co-founded Sun Microsystems?",
    answers: ["Steve Jobs", "Bill Gates", "Andy Bechtolsheim", "Larry Page"],
    correctAnswer: 2,
    timeLimit: 20
  },
  {
    id: 4,
    question: "What is CMU's official tartan pattern?",
    answers: ["Royal Stewart", "Carnegie Tartan", "Black Watch", "Dress Gordon"],
    correctAnswer: 1,
    timeLimit: 20
  },
  {
    id: 5,
    question: "In what year was ScottyLabs founded?",
    answers: ["2009", "2010", "2011", "2012"],
    correctAnswer: 1,
    timeLimit: 20
  },
  {
    id: 6,
    question: "What programming language is known for its use at CMU's School of Computer Science?",
    answers: ["Java", "Python", "SML", "C++"],
    correctAnswer: 2,
    timeLimit: 20
  },
  {
    id: 7,
    question: "What is the name of CMU's student union building?",
    answers: ["Cohon University Center", "Wean Hall", "Gates Center", "Tepper Quad"],
    correctAnswer: 0,
    timeLimit: 20
  },
  {
    id: 8,
    question: "Which of these is NOT a CMU college?",
    answers: ["Dietrich College", "Mellon College of Science", "Tepper School of Business", "School of Medicine"],
    correctAnswer: 3,
    timeLimit: 20
  },
  {
    id: 9,
    question: "What does 'ScottyLabs' primarily focus on?",
    answers: ["Sports", "Technology and Innovation", "Arts", "Business"],
    correctAnswer: 1,
    timeLimit: 20
  },
  {
    id: 10,
    question: "What is CMU's famous spring carnival event called?",
    answers: ["Spring Fling", "Booth", "Carnival Week", "Spring Fest"],
    correctAnswer: 1,
    timeLimit: 20
  }
];

// Game state constants
const GAME_STATES = {
  WAITING: 'waiting',
  STARTING: 'starting',
  QUESTION: 'question',
  ANSWER_REVEAL: 'answer_reveal',
  LEADERBOARD: 'leaderboard',
  FINISHED: 'finished'
};

// Create a new game
function createGame(gameCode) {
  return {
    code: gameCode,
    state: GAME_STATES.WAITING,
    players: [],
    currentQuestionIndex: -1,
    questions: [...triviaQuestions],
    startTime: null,
    questionStartTime: null,
    questionTimer: null,
    revealTimer: null,
    leaderboardTimer: null
  };
}

// Create a new player
function createPlayer(socketId, nickname, gameCode) {
  return {
    id: socketId,
    nickname,
    gameCode,
    score: 0,
    answers: []
  };
}

// Generate a random game code
function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Calculate score based on time taken to answer
function calculateScore(timeElapsed, timeLimit) {
  const baseScore = 1000;
  const timeBonus = Math.max(0, Math.floor((1 - timeElapsed / timeLimit) * 500));
  return baseScore + timeBonus;
}

// Check if all players have answered the current question
function checkAllPlayersAnswered(gameCode, questionId) {
  const game = games.get(gameCode);
  if (!game || game.state !== GAME_STATES.QUESTION) {
    return;
  }

  const playersWhoAnswered = game.players.filter(player => 
    player.answers.find(a => a.questionId === questionId)
  ).length;

  const totalPlayers = game.players.length;

  console.log(`${playersWhoAnswered}/${totalPlayers} players answered question ${questionId} in game ${gameCode}`);

  if (playersWhoAnswered === totalPlayers && totalPlayers > 0) {
    console.log(`All players answered! Auto-advancing question ${questionId} in game ${gameCode}`);
    
    // Clear the existing timer
    if (game.questionTimer) {
      clearTimeout(game.questionTimer);
      game.questionTimer = null;
    }

    // Immediately reveal the answer
    revealAnswer(gameCode);
  }
}

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/game/create', (req, res) => {
  const gameCode = generateGameCode();
  const game = createGame(gameCode);
  games.set(gameCode, game);
  res.json({ gameCode, message: 'Game created successfully' });
});

app.get('/api/game/:code', (req, res) => {
  const game = games.get(req.params.code);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json({
    code: game.code,
    state: game.state,
    playerCount: game.players.length,
    currentQuestion: game.currentQuestionIndex + 1,
    totalQuestions: game.questions.length
  });
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Player joins a game
  socket.on('join-game', ({ gameCode, nickname }) => {
    const game = games.get(gameCode);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.state !== GAME_STATES.WAITING) {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    if (game.players.length >= 50) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    const player = createPlayer(socket.id, nickname, gameCode);
    players.set(socket.id, player);
    game.players.push(player);
    
    socket.join(gameCode);
    socket.emit('joined-game', { 
      gameCode, 
      nickname,
      playerId: socket.id 
    });

    // Notify all players in the game
    io.to(gameCode).emit('player-joined', {
      nickname,
      playerCount: game.players.length
    });

    console.log(`Player ${nickname} joined game ${gameCode}`);
  });

  // Host starts the game
  socket.on('start-game', ({ gameCode }) => {
    const game = games.get(gameCode);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.players.length === 0) {
      socket.emit('error', { message: 'No players in game' });
      return;
    }

    game.state = GAME_STATES.STARTING;
    game.currentQuestionIndex = 0;
    game.startTime = Date.now();

    io.to(gameCode).emit('game-starting', {
      message: 'Game is starting...',
      totalQuestions: game.questions.length
    });

    // Start first question after 3 seconds
    setTimeout(() => {
      startQuestion(gameCode);
    }, 3000);

    console.log(`Game ${gameCode} started with ${game.players.length} players`);
  });

  // Player submits an answer
  socket.on('submit-answer', ({ gameCode, questionId, answerIndex, timeElapsed }) => {
    const game = games.get(gameCode);
    const player = players.get(socket.id);

    if (!game || !player) {
      socket.emit('error', { message: 'Invalid game or player' });
      return;
    }

    if (game.state !== GAME_STATES.QUESTION) {
      socket.emit('error', { message: 'Not accepting answers right now' });
      return;
    }

    const currentQuestion = game.questions[game.currentQuestionIndex];
    if (currentQuestion.id !== questionId) {
      socket.emit('error', { message: 'Invalid question' });
      return;
    }

    // Check if player already answered this question
    if (player.answers.find(a => a.questionId === questionId)) {
      return;
    }

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const scoreEarned = isCorrect ? calculateScore(timeElapsed, currentQuestion.timeLimit) : 0;

    player.answers.push({
      questionId,
      answerIndex,
      isCorrect,
      timeElapsed,
      scoreEarned
    });

    if (isCorrect) {
      player.score += scoreEarned;
    }

    socket.emit('answer-submitted', {
      isCorrect,
      scoreEarned,
      totalScore: player.score
    });

    console.log(`Player ${player.nickname} answered question ${questionId}: ${isCorrect ? 'correct' : 'incorrect'}`);

    // Check if all players have answered
    checkAllPlayersAnswered(gameCode, questionId);
  });

  // Get current leaderboard
  socket.on('get-leaderboard', ({ gameCode }) => {
    const game = games.get(gameCode);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const leaderboard = game.players
      .map(p => ({
        nickname: p.nickname,
        score: p.score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    socket.emit('leaderboard-update', { leaderboard });
  });

  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    
    if (player) {
      const game = games.get(player.gameCode);
      
      if (game) {
        game.players = game.players.filter(p => p.id !== socket.id);
        
        io.to(player.gameCode).emit('player-left', {
          nickname: player.nickname,
          playerCount: game.players.length
        });

        console.log(`Player ${player.nickname} left game ${player.gameCode}`);
      }
      
      players.delete(socket.id);
    }
    
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Helper function to start a question
function startQuestion(gameCode) {
  const game = games.get(gameCode);
  
  if (!game) return;

  game.state = GAME_STATES.QUESTION;
  game.questionStartTime = Date.now();

  const currentQuestion = game.questions[game.currentQuestionIndex];
  
  // Send question without correct answer
  io.to(gameCode).emit('question-start', {
    questionNumber: game.currentQuestionIndex + 1,
    totalQuestions: game.questions.length,
    question: currentQuestion.question,
    answers: currentQuestion.answers,
    timeLimit: currentQuestion.timeLimit
  });

  console.log(`Question ${game.currentQuestionIndex + 1} started for game ${gameCode}`);

  // After time limit, reveal answer
  game.questionTimer = setTimeout(() => {
    game.questionTimer = null;
    revealAnswer(gameCode);
  }, currentQuestion.timeLimit * 1000);
}

// Helper function to reveal answer and show leaderboard
function revealAnswer(gameCode) {
  const game = games.get(gameCode);
  
  if (!game) return;

  // Only reveal if we're still in question state
  if (game.state !== GAME_STATES.QUESTION) {
    return;
  }

  game.state = GAME_STATES.ANSWER_REVEAL;
  const currentQuestion = game.questions[game.currentQuestionIndex];

  io.to(gameCode).emit('answer-reveal', {
    correctAnswer: currentQuestion.correctAnswer,
    explanation: `The correct answer is: ${currentQuestion.answers[currentQuestion.correctAnswer]}`
  });

  console.log(`Answer revealed for question ${game.currentQuestionIndex + 1} in game ${gameCode}`);

  // Show leaderboard after 3 seconds
  game.revealTimer = setTimeout(() => {
    game.revealTimer = null;
    showLeaderboard(gameCode);
  }, 3000);
}

// Helper function to show leaderboard
function showLeaderboard(gameCode) {
  const game = games.get(gameCode);
  
  if (!game) return;

  game.state = GAME_STATES.LEADERBOARD;

  const leaderboard = game.players
    .map(p => ({
      nickname: p.nickname,
      score: p.score
    }))
    .sort((a, b) => b.score - a.score);

  io.to(gameCode).emit('leaderboard-show', {
    leaderboard,
    questionNumber: game.currentQuestionIndex + 1,
    totalQuestions: game.questions.length
  });

  console.log(`Leaderboard shown for game ${gameCode}`);

  // Move to next question or end game after 5 seconds
  game.leaderboardTimer = setTimeout(() => {
    game.leaderboardTimer = null;
    game.currentQuestionIndex++;
    
    if (game.currentQuestionIndex < game.questions.length) {
      startQuestion(gameCode);
    } else {
      endGame(gameCode);
    }
  }, 5000);
}

// Helper function to end the game
function endGame(gameCode) {
  const game = games.get(gameCode);
  
  if (!game) return;

  // Clear any pending timers
  if (game.questionTimer) clearTimeout(game.questionTimer);
  if (game.revealTimer) clearTimeout(game.revealTimer);
  if (game.leaderboardTimer) clearTimeout(game.leaderboardTimer);

  game.state = GAME_STATES.FINISHED;

  const finalLeaderboard = game.players
    .map(p => ({
      nickname: p.nickname,
      score: p.score
    }))
    .sort((a, b) => b.score - a.score);

  io.to(gameCode).emit('game-finished', {
    leaderboard: finalLeaderboard,
    message: 'Game Over! Thanks for playing!'
  });

  console.log(`Game ${gameCode} finished`);

  // Clean up game after 60 seconds
  setTimeout(() => {
    games.delete(gameCode);
    console.log(`Game ${gameCode} cleaned up`);
  }, 60000);
}

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
