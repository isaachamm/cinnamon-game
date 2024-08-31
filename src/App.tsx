import { useState } from 'react';
import './App.css'
import Game from './components/Game';
import Instructions from './components/Instructions';

function App() {

  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  return (
    <>

      {
        showInstructions ? 
        <Instructions setShowInstructions={setShowInstructions} /> : 
        <Game />
      }

      
      
    </>
  )
}

export default App
