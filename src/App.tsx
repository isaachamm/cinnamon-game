import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [currInput, setCurrInput] = useState('');
  // const [currWordData, setCurrWordData] = useState('');
  const [currWord, setCurrWord] = useState('');
  const [definitions, setDefinitions] = useState<Array<any>>([]);
  const [isCorrectDefinition, setIsCorrectDefinition] = useState<boolean>(false);
  const [isFirstDefinitionGuess, setIsFirstDefinitionGuess] = useState<boolean>(true);
  const [unguessedSynonyms, setUnguessedSynonyms] = useState<Array<string>>([]);
  const [guessedSynonyms, setGuessedSynonyms] = useState<Array<string>>([]);
  const [synonymGuessMessage, setSynonymGuessMessage] = useState<string>('');
  const [isFirstSynonymGuess, setIsFirstSynonymGuess] = useState<boolean>(true);
  const [currSynonym, setCurrSynonym] = useState('');

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async() => {

    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/ambivalent');
    const data = await response.json();

    // setCurrWordData(data[0]);
    setCurrWord(data[0].word);
    setDefinitions(data[0].meanings[0].definitions);
    setUnguessedSynonyms(data[0].meanings[0].synonyms);

  }

  const submitDefinitionGuess = (e: any) => {
    
    e.preventDefault();
    if (isFirstDefinitionGuess) {
      setIsFirstDefinitionGuess(false);
    }
    if (currInput.toLowerCase() === currWord.toLowerCase()) {
      setIsCorrectDefinition(true);
    }

  }

  const submitSynonym = (e: any) => {

    e.preventDefault();
    if(isFirstSynonymGuess) {
      setIsFirstSynonymGuess(false);
    }

    if (unguessedSynonyms.includes(currSynonym)) {
      setUnguessedSynonyms(unguessedSynonyms.filter((oldSynonym) => {return oldSynonym !== currSynonym}));
      setGuessedSynonyms([...guessedSynonyms, currSynonym]);
      setSynonymGuessMessage('Nice work!');
    } else if (guessedSynonyms.includes(currSynonym)) {
      setSynonymGuessMessage('Hey, you already got this one!');
    } else {
      setSynonymGuessMessage('Not quite, try again!');
    }
  }

  return (
    <>
      <h1>Welcome to the Cinnamon game!</h1>
      <h2>Here's how it works...</h2>
      <p>
        Below, you'll see definitions for a randomly chosen word. The definitions are for the same word, but they can be different meanings of the word or represent the word for different parts of speech. To beat the game, simply guess the word within 5 tries! 
      </p>
      <p>  
        If you get the word within 5 tries (note: currently unlimited tries), you unlock the bonus feature of the cinnamons -- the spice on top that really makes this game what it is. After you guess the word, you'll receive a number that tells you how many synonyms are available for this word. Here you have unlimited guesses -- the goal is just to get as many as you can—without cheating-before midnight, when the game will restart with a new word!
      </p>
      <p> 
        Are you ready?
      </p>

      
      <form onSubmit={submitDefinitionGuess}>
        <input type='text' name='definitionGuess' onKeyUp={(e) => setCurrInput(e.currentTarget.value)} />
        <button type='submit' name='definitionSubmit'>Submit guess!</button>
      </form>
      <ul>
        {definitions.map((definition) => (
          <p key={definition.definition}>{definition.definition}</p>
        ))}
      </ul>
      {isFirstDefinitionGuess ? null :
      !isCorrectDefinition ? <p>Not quite, try again...</p>
        : 
        (<>
          <p>success!</p>
          <p>Now, try and guess the synonyms...</p>
          <form onSubmit={submitSynonym}>
            <input onKeyUp={(e) => setCurrSynonym(e.currentTarget.value)}></input>
            <button type='submit'>Submit synonym</button>
          </form>
          <p>{synonymGuessMessage}</p>
          <p>You have {unguessedSynonyms.length} synonyms left!</p>
          <p>
            Correct Synonyms guessed: 
          </p>
          {guessedSynonyms.map((guessedSynonym) => (
              <p key={guessedSynonym}>
                {guessedSynonym}
              </p>
            )
          )}
              
        </> 
        )}
      {unguessedSynonyms.length === 0 ? <p> You won it all! </p> : null}
    </>
  )
}

export default App
