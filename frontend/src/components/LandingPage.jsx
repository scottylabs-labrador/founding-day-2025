import { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onCreateGame, onJoinGame }) {
  const [mode, setMode] = useState(''); // 'create' or 'join'
  const [nickname, setNickname] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname');
      return;
    }

    setLoading(true);
    const code = await onCreateGame();
    if (code) {
      onJoinGame(code, nickname);
    }
    setLoading(false);
  };

  const handleJoinGame = () => {
    if (!nickname.trim()) {
      alert('Please enter a nickname');
      return;
    }

    if (!gameCode.trim()) {
      alert('Please enter a game code');
      return;
    }

    onJoinGame(gameCode.toUpperCase(), nickname);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="title">🎓 ScottyLabs Trivia</h1>
        <p className="subtitle">Real-time Multiplayer Trivia Game</p>

        {!mode && (
          <div className="mode-selection">
            <button
              className="mode-button create-button"
              onClick={() => setMode('create')}
            >
              Create Game
            </button>
            <button
              className="mode-button join-button"
              onClick={() => setMode('join')}
            >
              Join Game
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="form-container">
            <h2>Create a New Game</h2>
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="input-field"
            />
            <button
              className="submit-button"
              onClick={handleCreateGame}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create & Join'}
            </button>
            <button
              className="back-button"
              onClick={() => setMode('')}
            >
              Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="form-container">
            <h2>Join a Game</h2>
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Enter game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="input-field"
            />
            <button
              className="submit-button"
              onClick={handleJoinGame}
            >
              Join Game
            </button>
            <button
              className="back-button"
              onClick={() => setMode('')}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
