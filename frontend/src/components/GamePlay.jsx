import { useState, useEffect } from 'react';
import './GamePlay.css';

function GamePlay({ question, questionNumber, totalQuestions, playerScore, onSubmitAnswer, lastAnswerCorrect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Reset when new question arrives
    setSelectedAnswer(null);
    setHasAnswered(false);
    setTimeRemaining(question.timeLimit);

    // Timer countdown
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [question.question, question.timeLimit]);

  const handleAnswerClick = (index) => {
    if (hasAnswered || question.correctAnswer !== undefined) {
      return;
    }

    setSelectedAnswer(index);
    setHasAnswered(true);
    onSubmitAnswer(index);
  };

  const getAnswerClass = (index) => {
    if (question.correctAnswer === undefined) {
      // Question in progress
      return selectedAnswer === index ? 'selected' : '';
    } else {
      // Answer revealed
      if (index === question.correctAnswer) {
        return 'correct';
      }
      if (selectedAnswer === index && index !== question.correctAnswer) {
        return 'incorrect';
      }
      return '';
    }
  };

  const progressPercentage = (timeRemaining / question.timeLimit) * 100;

  return (
    <div className="gameplay">
      <div className="gameplay-header">
        <div className="question-info">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="player-score">Score: {playerScore}</span>
        </div>
        <div className="timer-container">
          <div className="timer-bar" style={{ width: `${progressPercentage}%` }} />
          <span className="timer-text">{Math.ceil(timeRemaining)}s</span>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question-text">{question.question}</h2>
      </div>

      <div className="answers-grid">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`answer-button ${getAnswerClass(index)}`}
            onClick={() => handleAnswerClick(index)}
            disabled={hasAnswered || question.correctAnswer !== undefined}
          >
            <span className="answer-label">{String.fromCharCode(65 + index)}</span>
            <span className="answer-text">{answer}</span>
          </button>
        ))}
      </div>

      {question.correctAnswer !== undefined && lastAnswerCorrect !== null && (
        <div className={`correctness-indicator ${lastAnswerCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
          <div className="correctness-icon">
            {lastAnswerCorrect ? '✓' : '✗'}
          </div>
          <div className="correctness-text">
            {lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
          </div>
        </div>
      )}

      {question.correctAnswer !== undefined && (
        <div className="answer-explanation">
          {question.explanation}
        </div>
      )}
    </div>
  );
}

export default GamePlay;
