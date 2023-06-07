import React from 'react';
import NewGameComponent from './NewGameComponent';

function App() {

  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle = {
    width: '400px',
    height: 'auto',
  };

  return (
    <div style={appStyle}>
      <img src="https://1000marcas.net/wp-content/uploads/2020/11/Game-of-Thrones-logo.png" alt="Game of Thrones logo" style={imgStyle} />
      <p className="subtitle">Guess the quote game</p>
      <NewGameComponent />
    </div>
  );
}

export default App;