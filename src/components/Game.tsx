import { useEffect, useState } from 'react';
import './Game.css';
import cinnamonLogo from '/Cinnamon_logo.png';

const defaultWord = { "word": "ambivalent", "part_of_speech": "adjective", "definitions": [{ "definition": "Simultaneously experiencing or expressing opposing or contradictory feelings, beliefs, or motivations." }, { "definition": "Alternately having one opinion or feeling, and then the opposite." }], "synonyms": ["fluctuating", "vacillating", "wavering", "conflicted", "uncertain", "undecided", "unresolved"] }

export default function Game() {

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

		try {
			const dictionaryUrl = new URL('../assets/dictionary.json', import.meta.url).href;
			const response = await fetch(dictionaryUrl);
			const data = await response.json();
			const currDate = new Date();
			const currYear = currDate.getFullYear();
			const currMonth = currDate.getMonth() + 1;
			const currDay = currDate.getDate();
			for (let i = 0; i < data.length; i++) {
				const dateSplit = data[i].date.split('-')
				const year = parseInt(dateSplit[0]);
				const month = parseInt(dateSplit[1]);
				const day = parseInt(dateSplit[2]);
				if (year === currYear &&
					month === currMonth &&
					day === currDay
				) {
					
					// Fix capitalization
					const wordRaw: string = data[i].word;
					const word = wordRaw.charAt(0).toUpperCase() + wordRaw.slice(1);
					const partOfSpeechRaw: string = data[i].part_of_speech;
					const partOfSpeech = partOfSpeechRaw.charAt(0).toUpperCase() + partOfSpeechRaw.slice(1);
					const synonymsRaw: string[] = data[i].synonyms;
					const synonyms: string[] = [];
					for (let i = 0; i < synonymsRaw.length; i++) {
						synonyms.push(synonymsRaw[i].charAt(0).toUpperCase() + synonymsRaw[i].slice(1));
					}

					setCorrectDefinitionWord(word);
					setDefinitions(data[i].definitions);
					setPartOfSpeech(partOfSpeech);
					setSynonyms(synonyms);
					return;
				}
			}
			setCorrectDefinitionWord(defaultWord.word);
			setDefinitions(defaultWord.definitions);
			setPartOfSpeech(defaultWord.part_of_speech);
			setSynonyms(defaultWord.synonyms);
		} catch (exception) {
			console.error("An error occurred: ", exception);
			setCorrectDefinitionWord(defaultWord.word);
			setDefinitions(defaultWord.definitions);
			setPartOfSpeech(defaultWord.part_of_speech);
			setSynonyms(defaultWord.synonyms);
		}
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
			<img src={cinnamonLogo} className="logo" alt="Linkedin logo" />
			<h1 className='cinnamon-message'>The Daily Cinnamon</h1>

				<h2><em>{partOfSpeech}</em></h2>
				{definitions.map((definition) => (
					<p className='text-left' key={definition.definition}>{definition.definition}</p>
				))}


			<form onSubmit={submitGuess}>
				<input onChange={(e) => setCurrGuess(e.currentTarget.value.toLowerCase())} value={currGuess} />
				<br />
				<button className='submit-button' type='submit'>Submit Guess</button>
			</form>

			{(guessedSynonyms.length === synonyms.length && synonyms.length > 0)
				? <p> You won it all! </p> : null}

			<p>{guessMessage}</p>


			{isCorrectDefinitionWord &&
				<>
					<hr />
					<h2 className='cinnamon-message'>You got it! The daily cinnamon was: {correctDefinitionWord}
					</h2>
					<hr />
				</>
			}

			{synonyms.length === 0 &&
				<p>There are no synonyms to guess today :(</p>
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