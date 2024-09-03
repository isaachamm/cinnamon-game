import { useEffect, useState } from 'react';
import './Game.css';

export default function Game() {

	// const [currWordData, setCurrWordData] = useState('');
	const [correctDefinitionWord, setCorrectDefinitionWord] = useState<string>('');
	const [partOfSpeech, setPartOfSpeech] = useState<string>('');
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
		console.log(data);

		// setCurrWordData(data[0]);
		setCorrectDefinitionWord(data[0].word);
		setDefinitions(data[0].meanings[0].definitions);
		setPartOfSpeech(data[0].meanings[0].partOfSpeech);
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
		} else {
			if (incorrectGuesses.includes(currGuess)) {
				setGuessMessage('You already guessed that')
			} else {
				setIncorrectGuesses((prevIncorrectGuesses) => [...prevIncorrectGuesses, currGuess]);
				setGuessMessage('Not quite, try again!');
			}
		}
		setCurrGuess("");
	}

	return (
		<>
			<h1 className='cinnamon-message'>The Daily Cinnamon</h1>

				<ul>
					<p className='text-left'>- {partOfSpeech}</p>
					{definitions.map((definition) => (
						<p className='text-left' key={definition.definition}>{definition.definition}</p>
					))}
				</ul>


				<form onSubmit={submitGuess}>
					<input onChange={(e) => setCurrGuess(e.currentTarget.value.toLowerCase())} value={currGuess} />
					<br />
					<button className='submit-button' type='submit'>Submit Guess</button>
				</form>

				{guessedSynonyms.length === synonyms.length ? <p> You won it all! </p> : null}

				<p>{guessMessage}</p>


				{isCorrectDefinitionWord &&
					<>
						<hr />
						<h2 className='cinnamon-message'>You got it! The daily cinnamon was: {correctDefinitionWord}
						</h2>
						<hr />
					</>
				}
				{(guessedSynonyms.length > 0 || isCorrectDefinitionWord) &&
					<p>You have {synonyms.length - guessedSynonyms.length} synonyms left!</p>
				}
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>


					<div className='text-left'>
						<p>Correct Synonyms:</p>
						{(guessedSynonyms.length > 0 || isCorrectDefinitionWord) &&
							guessedSynonyms.map((guessedSynonym) => (
								<p className='guess-list text-left' key={guessedSynonym}>
									- {guessedSynonym}
								</p>
							))
						}
					</div>

					<div className='text-left'>
						<p>Incorrect guesses:</p>
						{incorrectGuesses.length > 0 &&
							incorrectGuesses.map((incorrectGuess) => {
								return <p className='guess-list' key={incorrectGuess}>- {incorrectGuess}</p>
							})
						}
					</div>
				</div>


			</>
			)
}