import './Leaderboard.css';

function Leaderboard({ leaderboard, questionNumber, totalQuestions, playerNickname }) {
  const playerRank = leaderboard.findIndex(p => p.nickname === playerNickname) + 1;

  return (
    <div className="leaderboard">
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <p className="leaderboard-subtitle">
          After Question {questionNumber} of {totalQuestions}
        </p>

        {playerRank > 0 && (
          <div className="player-position">
            Your position: <strong>#{playerRank}</strong>
          </div>
        )}

        <div className="leaderboard-list">
          {leaderboard.slice(0, 10).map((player, index) => (
            <div
              key={index}
              className={`leaderboard-item ${
                player.nickname === playerNickname ? 'current-player' : ''
              } ${index < 3 ? `rank-${index + 1}` : ''}`}
            >
              <span className="rank">
                {index + 1 === 1 && '🥇'}
                {index + 1 === 2 && '🥈'}
                {index + 1 === 3 && '🥉'}
                {index + 1 > 3 && `#${index + 1}`}
              </span>
              <span className="nickname">{player.nickname}</span>
              <span className="score">{player.score.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="next-question-notice">
          Next question coming up...
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
