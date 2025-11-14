import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import LandingPage from './components/LandingPage';
import WaitingRoom from './components/WaitingRoom';
import GamePlay from './components/GamePlay';
import Leaderboard from './components/Leaderboard';
import GameFinished from './components/GameFinished';

const SOCKET_URL = 'https://founding-api.scottylabs.org';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('landing'); // landing, waiting, playing, leaderboard, finished
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      autoConnect: false
    });

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('joined-game', (data) => {
      setGameCode(data.gameCode);
      setNickname(data.nickname);
      setPlayerId(data.playerId);
      setGameState('waiting');
      setError('');
    });

    newSocket.on('player-joined', (data) => {
      setPlayerCount(data.playerCount);
    });

    newSocket.on('player-left', (data) => {
      setPlayerCount(data.playerCount);
    });

    newSocket.on('game-starting', (data) => {
      setTotalQuestions(data.totalQuestions);
    });

    newSocket.on('question-start', (data) => {
      setGameState('playing');
      setCurrentQuestion({
        question: data.question,
        answers: data.answers,
        timeLimit: data.timeLimit,
        startTime: Date.now()
      });
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
    });

    newSocket.on('answer-submitted', (data) => {
      setPlayerScore(data.totalScore);
    });

    newSocket.on('answer-reveal', (data) => {
      if (currentQuestion) {
        setCurrentQuestion({
          ...currentQuestion,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation
        });
      }
    });

    newSocket.on('leaderboard-show', (data) => {
      setGameState('leaderboard');
      setLeaderboard(data.leaderboard);
    });

    newSocket.on('game-finished', (data) => {
      setGameState('finished');
      setLeaderboard(data.leaderboard);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 5000);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setIsHost(true);
      return data.gameCode;
    } catch (err) {
      setError('Failed to create game');
      console.error(err);
      return null;
    }
  };

  const joinGame = (code, name) => {
    if (socket && !socket.connected) {
      socket.connect();
    }
    
    setTimeout(() => {
      socket.emit('join-game', {
        gameCode: code,
        nickname: name
      });
    }, 100);
  };

  const startGame = () => {
    if (socket && gameCode) {
      socket.emit('start-game', { gameCode });
    }
  };

  const submitAnswer = (answerIndex) => {
    if (socket && currentQuestion) {
      const timeElapsed = (Date.now() - currentQuestion.startTime) / 1000;
      socket.emit('submit-answer', {
        gameCode,
        questionId: questionNumber,
        answerIndex,
        timeElapsed
      });
    }
  };

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      
      {gameState === 'landing' && (
        <LandingPage
          onCreateGame={createGame}
          onJoinGame={joinGame}
        />
      )}

      {gameState === 'waiting' && (
        <WaitingRoom
          gameCode={gameCode}
          nickname={nickname}
          playerCount={playerCount}
          isHost={isHost}
          onStartGame={startGame}
        />
      )}

      {gameState === 'playing' && currentQuestion && (
        <GamePlay
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          playerScore={playerScore}
          onSubmitAnswer={submitAnswer}
        />
      )}

      {gameState === 'leaderboard' && (
        <Leaderboard
          leaderboard={leaderboard}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          playerNickname={nickname}
        />
      )}

      {gameState === 'finished' && (
        <GameFinished
          leaderboard={leaderboard}
          playerNickname={nickname}
        />
      )}
    </div>
  );
}

export default App;
