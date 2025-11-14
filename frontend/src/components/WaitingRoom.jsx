import './WaitingRoom.css';

function WaitingRoom({ gameCode, nickname, playerCount, isHost, onStartGame }) {
  return (
    <div className="waiting-room">
      <div className="waiting-container">
        <h1>Waiting Room</h1>
        
        <div className="game-code-display">
          <span className="game-code-label">Game Code:</span>
          <span className="game-code">{gameCode}</span>
        </div>

        <div className="player-info">
          <p className="welcome-text">Welcome, <strong>{nickname}</strong>!</p>
          <p className="player-count">
            👥 {playerCount} {playerCount === 1 ? 'player' : 'players'} in the game
          </p>
        </div>

        <div className="waiting-instructions">
          {isHost ? (
            <>
              <p>You are the host!</p>
              <p>Share the game code with other players.</p>
              <p>Click "Start Game" when everyone has joined.</p>
            </>
          ) : (
            <>
              <p>Waiting for the host to start the game...</p>
              <p>Get ready to answer some trivia questions!</p>
            </>
          )}
        </div>

        {isHost && (
          <button
            className="start-game-button"
            onClick={onStartGame}
            disabled={playerCount === 0}
          >
            Start Game
          </button>
        )}

        <div className="waiting-animation">
          <div className="dot-pulse"></div>
          <div className="dot-pulse"></div>
          <div className="dot-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
