import React, { useState } from 'react';
import Menu from './components/Menu';
import MainGame from './components/MainGame';

function App() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div>
      {showGame ? (
        <MainGame />
      ) : (
        <Menu onStart={() => setShowGame(true)} />
      )}
    </div>
  );
}

export default App;