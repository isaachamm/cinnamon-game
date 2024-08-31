import { useEffect, useState } from 'react'

export default function Game() {

	// const [currWordData, setCurrWordData] = useState('');
	const [correctDefinitionWord, setCorrectDefinitionWord] = useState('');
	const [definitions, setDefinitions] = useState<Array<any>>([]);
	const [isCorrectDefinitionWord, setIsCorrectDefinitionWord] = useState<boolean>(false);

	const [currGuess, setCurrGuess] = useState<string>('');
	const [incorrectGuesses, setIncorrectGuesses] = useState<Array<string>>([]);
	const [synonyms, setSynonyms] = useState<Array<string>>([]);
	const [guessedSynonyms, setGuessedSynonyms] = useState<Array<string>>([]);
	const [guessMessage, setGuessMessage] = useState<string>('');


	useEffect(() => {
		fetchWord();
	}, []);

	const fetchWord = async () => {

		const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/ambivalent');
		const data = await response.json();

		// setCurrWordData(data[0]);
		setCorrectDefinitionWord(data[0].word);
		setDefinitions(data[0].meanings[0].definitions);
		setSynonyms(data[0].meanings[0].synonyms);

	}

	const submitGuess = (e: any) => {

		e.preventDefault();

		if (!isCorrectDefinitionWord) {
			if (currGuess.toLowerCase() === correctDefinitionWord.toLowerCase()) {
				setIsCorrectDefinitionWord(true);
				setGuessMessage("Nice work! Now, try and guess the remaining synonyms...");
				return;
			}
		}

		if (guessedSynonyms.includes(currGuess) || currGuess === correctDefinitionWord) {
			setGuessMessage('Hey, you already got this one!');
		} else if (synonyms.includes(currGuess)) {
			setGuessedSynonyms([...guessedSynonyms, currGuess]);
			if (isCorrectDefinitionWord) {
				setGuessMessage('Way to be! That\'s one more synonym in the cinnamon jar!');
			} else {
				setGuessMessage('You got a synonym, but you still need to guess the daily cinnamon!');
			}
		}  else {
			if (incorrectGuesses.includes(currGuess)) {
				setGuessMessage('You already guessed that')
			} else {
				setIncorrectGuesses((prevIncorrectGuesses) => [currGuess, ...prevIncorrectGuesses]);
				setGuessMessage('Not quite, try again!');
			}

		}
	}

	return (
		<>
			<ul>
				{definitions.map((definition) => (
					<p key={definition.definition}>{definition.definition}</p>
				))}
			</ul>


			<form onSubmit={submitGuess}>
				<input onKeyUp={(e) => setCurrGuess(e.currentTarget.value.toLowerCase())}></input>
				<button type='submit'>Submit Guess</button>
			</form>

			{guessedSynonyms.length === synonyms.length ? <p> You won it all! </p> : null}

			<p>{guessMessage}</p>
			
			{isCorrectDefinitionWord && <h2>You got it! The daily cinnamon was: {correctDefinitionWord}</h2>}

			{(guessedSynonyms.length > 0 || isCorrectDefinitionWord) &&
				<>
					<p>You have {synonyms.length - guessedSynonyms.length} synonyms left!</p>
					<p>Correct Synonyms guessed:</p>

					{guessedSynonyms.map((guessedSynonym) => (
						<p key={guessedSynonym}>
							{guessedSynonym}
						</p>
					))}
				</>
			}

			{incorrectGuesses.length > 0 &&
				<>
					<p>Incorrect guesses:</p>
					{incorrectGuesses.map((incorrectGuess) => {
						return <p key={incorrectGuess}>{incorrectGuess}</p>
					})}
				</>
			}


		</>
	)
}