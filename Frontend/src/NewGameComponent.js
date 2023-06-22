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

    fetch('http://localhost:7094/NewGame/Get')
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
        <form className="container" onSubmit={handleSubmit}>

          <div className="form-group">
              <label htmlFor="username" >Username</label>
              <input type="text" className="form-control" name="username" required  placeholder="Enter your username" />
          </div>

          <button type="submit" className="btn btn-outline-secondary">
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
