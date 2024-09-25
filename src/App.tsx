import { useState } from 'react';
import './App.css'
import Game from './components/Game';
import Instructions from './components/Instructions';
import Header from './components/Header';

function App() {

  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  return (
    <>
      <Header />
      <div className='body'>

        {
          showInstructions ?
            <Instructions setShowInstructions={setShowInstructions} /> :
            <Game />
        }

      </div>



    </>
  )
}

export default App
