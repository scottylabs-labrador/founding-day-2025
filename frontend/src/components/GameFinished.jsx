import './GameFinished.css';

function GameFinished({ leaderboard, playerNickname }) {
  const playerRank = leaderboard.findIndex(p => p.nickname === playerNickname) + 1;
  const playerScore = leaderboard.find(p => p.nickname === playerNickname)?.score || 0;

  return (
    <div className="game-finished">
      <div className="finished-container">
        <h1>🎉 Game Over! 🎉</h1>
        
        <div className="final-results">
          <h2>Final Results</h2>
          
          {playerRank > 0 && (
            <div className="player-final-score">
              <p className="final-position">You finished in position:</p>
              <p className="final-rank">#{playerRank}</p>
              <p className="final-score">Score: {playerScore.toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="podium">
          {leaderboard.slice(0, 3).map((player, index) => (
            <div
              key={index}
              className={`podium-place place-${index + 1} ${
                player.nickname === playerNickname ? 'current-player' : ''
              }`}
            >
              <div className="trophy">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
              </div>
              <div className="podium-nickname">{player.nickname}</div>
              <div className="podium-score">{player.score.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="final-leaderboard">
          <h3>All Players</h3>
          <div className="final-leaderboard-list">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`final-leaderboard-item ${
                  player.nickname === playerNickname ? 'current-player' : ''
                }`}
              >
                <span className="final-rank">#{index + 1}</span>
                <span className="final-nickname">{player.nickname}</span>
                <span className="final-player-score">{player.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="thanks-message">
          <p>Thanks for playing ScottyLabs Trivia!</p>
          <button
            className="play-again-button"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameFinished;
