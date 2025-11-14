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
    "id": 1,
    "question": "What date was ScottyLabs officially founded?",
    "answers": ["November 14, 2010", "November 14, 2011", "February 10, 2012", "November 14, 2012"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 2,
    "question": "Who were the two co-founders of ScottyLabs?",
    "answers": ["Jeff Cooper and Julia Teitelbaum", "Amy Quispe and Vinay Vemuri", "Drew Inglis and Quintin Carlson", "Richard Guo and Yoshi Torralva"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 3,
    "question": "What was the first ScottyLabs tech project? (that we know of)",
    "answers": ["CMUCourses", "CMUEats", "CMUMaps", "Lost and Found"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 4,
    "question": "What inspired Vinay Vemuri to create ScottyLabs?",
    "answers": ["A class project that went viral", "His internship at Google Boston", "Winning a hackathon at MIT", "A conversation with Randy Pausch"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 5,
    "question": "When was the FIRST TartanHacks held?",
    "answers": ["January 2011", "February 2012", "November 2011", "February 2013"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 6,
    "question": "What percentage of participants at the FIRST TartanHacks (2012) were women?",
    "answers": ["10%", "15%", "22%", "Nearly 30%"],
    "correctAnswer": 3,
    "timeLimit": 20
  },
  {
    "id": 7,
    "question": "How did Julia Teitelbaum (DC'14) get recruited to design the first TartanHacks website?",
    "answers": ["She won a design competition", "She was recommended by a professor", "Jeff Cooper rescued her when she got stuck in the rain", "She responded to a flyer in the Fine Arts building"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 8,
    "question": "The 'First Penguin Award' given at TartanHacks honors which famous CMU professor?",
    "answers": ["Luis von Ahn", "Randy Pausch", "Andrew Carnegie", "Raj Reddy"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 9,
    "question": "What unusual event happened 23 hours into TartanHacks 2023?",
    "answers": ["A power outage forced evacuation", "A bomb threat caused by dance team sandbag props", "A fire alarm from burnt pizza", "A surprise visit from a tech CEO"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 10,
    "question": "Which famous hacker spoke at ScottyLabs' SkillSwap Weekend in Fall 2012, attracting 400+ students who 'camped out' to hear him?",
    "answers": ["Kevin Mitnick", "Edward Snowden", "George Hotz", "Aaron Swartz"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 11,
    "question": "When and why was the current version of CMUCourses built?",
    "answers": ["Summer 2019 as a senior thesis project", "March 2020 during COVID extended spring break by two freshmen", "Fall 2021 with university funding", "January 2022 as a TartanHacks winning project"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 12,
    "question": "Which ScottyLabs product is the OLDEST, having been maintained since 2013?",
    "answers": ["CMUMaps", "CMUCourses", "CMUEats", "Lost and Found"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 13,
    "question": "How many applications did TartanHacks 2025 receive?",
    "answers": ["762", "1,024", "1,452", "2,000"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 14,
    "question": "What is the name of the prize given to the team that took 'the biggest gamble while not meeting its goals' (inspired by Randy Pausch's philosophy of glorious failure)?",
    "answers": ["The Risk Taker Award", "The Bold Innovator Prize", "The First Penguin Award", "The Moonshot Medal"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 15,
    "question": "What is the 'Spiciest Meme Award' at TartanHacks worth?",
    "answers": ["$10", "$30", "$50", "$100"],
    "correctAnswer": 1,
    "timeLimit": 20
  },
  {
    "id": 16,
    "question": "Who dramatically transformed ScottyLabs' branding in 2019 by creating a new TartanHacks logo 'within weeks' that was described as 'like night and day'?",
    "answers": ["Shannon Lin", "Richard Guo", "Yoshi Torralva", "Akshath Jain"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 17,
    "question": "What is the name of ScottyLabs' 'moonshot committee' for ambitious startup-like ScottyLabs projects?",
    "answers": ["Foundry", "Terrier", "Labrador", "Project Olympus"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 18,
    "question": "How many CMU students use ScottyLabs apps (CMUCourses, CMUEats, CMUMaps) every month?",
    "answers": ["Around 2,000", "Around 5,000", "Over 10,000", "Over 25,000"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 19,
    "question": "What is the dollar amount of the 'Scott Krulcik Grand Prize' awarded at TartanHacks 2023?",
    "answers": ["$500", "$1,000", "$2,000", "$5,000"],
    "correctAnswer": 2,
    "timeLimit": 20
  },
  {
    "id": 20,
    "question": "What percentage of CMU's undergraduate population is reached by ScottyLabs' mailing list?",
    "answers": ["10%", "15%", "22%", "30%"],
    "correctAnswer": 2,
    "timeLimit": 20
  }
]

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
