import React, { useState, useEffect } from 'react';

function QuestionForm({ questions, username }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState(questions);
  const [showOutcome, setShowOutcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [isNewGameRequested, setNewGameRequested] = useState(false);
  const [loadingTryAgain, setLoadingTryAgain] = useState(false);

  useEffect(() => {
    if (isNewGameRequested) {
      fetchNewGame();
    }
  }, [isNewGameRequested]);

  useEffect(() => {
    setSelectedQuestions(questions);
    setShowOutcome(false);
    setCurrentQuestionIndex(0);
    setScoreResult(null);
  }, [questions]);

  const handleOptionClick = (optionIndex) => {
    setShowOutcome(true);
    const updatedQuestions = selectedQuestions.map((question, index) => {
      if (index === currentQuestionIndex) {
        return {
          ...question,
          options: question.options.map((option, i) => ({
            ...option,
            isSelected: i === optionIndex
          }))
        };
      }
      return question;
    });

    setSelectedQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    setShowOutcome(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const userAnswers = selectedQuestions.map((question) => {
      const selectedOption = question.options.find((option) => option.isSelected);
      return {
        quote: question.quote,
        options: question.options.map((option) => ({
          option: option.option,
          isCorrect: option.isCorrect,
          isSelected: option.isSelected
        }))
      };
    });

    const userScoreData = {
      userName: username,
      questions: userAnswers
    };

    fetch('http://localhost:7094/UserScore/Post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userScoreData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Process the response data as needed
        setScoreResult(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleTryAgain = () => {
    setLoadingTryAgain(true);
    setNewGameRequested(true);
  };

  const fetchNewGame = () => {
    setLoadingTryAgain(true);

    fetch('http://localhost:7094/NewGame/Get')
      .then(response => response.json())
      .then(data => {
        setSelectedQuestions(data.result);
        setShowOutcome(false);
        setCurrentQuestionIndex(0);
        setScoreResult(null);
        setNewGameRequested(false);
        setLoadingTryAgain(false);
      })
      .catch(error => {
        console.error(error);
        setNewGameRequested(false);
        setLoadingTryAgain(false);
      });
  };

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const selectedOption = currentQuestion && currentQuestion.options.find((option) => option.isSelected);

  if (scoreResult) {
    return (
      <div>
        <p>Score: {scoreResult.score}</p>
        <p>Favorite Character: {scoreResult.favoriteCharacter}</p>
        <button type="submit" onClick={handleTryAgain}
          disabled={loadingTryAgain} className="btn btn-secondary mt-4"
        >
          {loadingTryAgain ? 'Loading...' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container">
      {currentQuestion && (
        <div>
          <p className="mt-4">{currentQuestion.quote}</p>
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              className={`btn btn-block mt-2 ${showOutcome && option.isCorrect ? 'btn-success' : showOutcome && option.isSelected ? 'btn-danger' : 'btn btn-outline-secondary'}`}
              onClick={() => handleOptionClick(optionIndex)}
              disabled={showOutcome}
            >
              {option.option}
            </button>
          ))}
          {showOutcome && (
            <div className="outcome mt-2">
              {selectedOption && (
                <p className={selectedOption.isCorrect ? 'text-success' : 'text-danger'}>
                  {selectedOption.isCorrect ? 'CORRECT!' : 'WRONG!'}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {currentQuestionIndex < selectedQuestions.length - 1 && showOutcome && (
        <button type="button" onClick={handleNextQuestion} className="btn btn-secondary mt-4">
          Next
        </button>
      )}
      {currentQuestionIndex === selectedQuestions.length - 1 && showOutcome && (
        <button type="submit" disabled={loading} className="btn btn-secondary mt-4">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </form>
  );

}

export default QuestionForm;
