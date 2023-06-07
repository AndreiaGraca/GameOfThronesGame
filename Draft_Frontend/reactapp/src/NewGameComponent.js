import React, { useState } from 'react';
import QuestionForm from './QuestionForm';

function NewGameComponent() {
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewGameClick = () => {
    setShowQuestions(false);
    setUsername('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const enteredUsername = event.target.username.value;
    setUsername(enteredUsername);

    fetch('https://localhost:7094/NewGame/Get')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.result);
        setShowQuestions(true);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div>
      {!showQuestions ? (
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'New Game'}
          </button>
        </form>
      ) : (
        <QuestionForm questions={questions} username={username} />
      )}
    </div>
  );
}

export default NewGameComponent;
