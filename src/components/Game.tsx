import { useEffect, useState } from 'react';
import './Game.css';
import cinnamonLogo from '/Cinnamon_logo.png';

const defaultWord = { "word": "ambivalent", "part_of_speech": "adjective", "definitions": [{ "definition": "Simultaneously experiencing or expressing opposing or contradictory feelings, beliefs, or motivations." }, { "definition": "Alternately having one opinion or feeling, and then the opposite." }], "synonyms": ["fluctuating", "vacillating", "wavering", "conflicted", "uncertain", "undecided", "unresolved"] }

export default function Game() {

	const [correctDefinitionWord, setCorrectDefinitionWord] = useState<string>('');
	const [partOfSpeech, setPartOfSpeech] = useState<string>('');
	const [definitions, setDefinitions] = useState<Array<any>>([]);
	const [isCorrectDefinitionWord, setIsCorrectDefinitionWord] = useState<boolean>(false);
	const [gaveUp, setGaveUp] = useState<boolean>(false);

	const [currGuess, setCurrGuess] = useState<string>('');
	const [incorrectGuesses, setIncorrectGuesses] = useState<Array<string>>([]);
	const [synonyms, setSynonyms] = useState<Array<string>>([]);
	const [guessedSynonyms, setGuessedSynonyms] = useState<Array<string>>([]);
	const [guessMessage, setGuessMessage] = useState<string>('');

	const [currDate, setCurrDate] = useState<Date>(new Date());
	const [validDate, setValidDate] = useState<boolean>(true);


	useEffect(() => {
		fetchWord();
	}, [currDate]);

	const fetchWord = async () => {

		try {
			const dictionaryUrl = new URL('../assets/dictionary.json', import.meta.url).href;
			const response = await fetch(dictionaryUrl);
			const data = await response.json();
			const currYear = currDate.getFullYear();
			const currMonth = currDate.getMonth() + 1;
			const currDay = currDate.getDate();
			const earliestDate = new Date(2024, 8, 9);
			const latestDate = new Date();
			if (
				currDate > earliestDate &&
				currDate < latestDate
			) {

				setValidDate(true);

				for (let i = 0; i < data.length; i++) {
					const dateSplit = data[i].date.split('-')
					const year = parseInt(dateSplit[0]);
					const month = parseInt(dateSplit[1]);
					const day = parseInt(dateSplit[2]);
					if (
						year === currYear &&
						month === currMonth &&
						day === currDay
					) {

						// Fix capitalization
						const wordRaw: string = data[i].word;
						const word = wordRaw.charAt(0).toUpperCase() + wordRaw.slice(1);
						const partOfSpeechRaw: string = data[i].part_of_speech;
						const partOfSpeech = partOfSpeechRaw.charAt(0).toUpperCase() + partOfSpeechRaw.slice(1);


						setCorrectDefinitionWord(word);
						setDefinitions(data[i].definitions);
						setPartOfSpeech(partOfSpeech);
						setSynonyms(data[i].synonyms);
						return;
					}
				}
			} else {
				setValidDate(false);
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

	const nextDate = () => {
		var newDate = new Date(currDate.setDate(currDate.getDate() + 1));
		if (newDate > new Date()) {
			newDate = new Date(currDate.setDate(currDate.getDate() - 1));
			setValidDate(false);
			return;
		}
		setCurrDate(newDate);
	}

	const prevDate = () => {
		var newDate = new Date(currDate.setDate(currDate.getDate() - 1));
		if (newDate < new Date(2024, 8, 9)) {
			newDate = new Date(currDate.setDate(currDate.getDate() + 1));
			setValidDate(false);
			return;
		}
		setCurrDate(newDate);
	}

	const onDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = new Date(event.currentTarget.value);

		if (newDate < new Date(2024, 8, 9)) {
			setValidDate(false);
			return;
		}

		if (newDate > new Date()) {
			setValidDate(false);
			return;
		}
		setCurrDate(newDate);
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

	const revealWord = () => {
		setGaveUp(true);
		setGuessMessage("No worries! Good luck with the synonyms!")
	}

	const revealSynonym = () => {
		for (let i = 0; i < synonyms.length; i++) {
			if (!guessedSynonyms.includes(synonyms[i])) {
				setGuessedSynonyms([...guessedSynonyms, synonyms[i]])
			}
		}
	}

	return (
		<>
			<img src={cinnamonLogo} className="logo" alt="Linkedin logo" />
			<h1 className='cinnamon-message'>The Daily Cinnamon</h1>

			<div className='date-container'>
				<button onClick={prevDate}><strong>&lt; Prev</strong></button>
				<input type='date' onChange={onDateChange} value={`${currDate.getFullYear()}-${(currDate.getMonth() + 1) >= 10 ? (currDate.getMonth() + 1) : "0" + (currDate.getMonth() + 1)}-${(currDate.getDate()) >= 10 ? currDate.getDate() : "0" + currDate.getDate()}`} />
				<button onClick={nextDate}><strong>Next &gt;</strong></button>
			</div>
			{!validDate && <p className='error-message'>Date must be after 09/09/24 and before current date ({new Date().toLocaleDateString()})</p>}

			<h2><em>{partOfSpeech}</em></h2>
			{definitions.map((definition) => (
				<p className='text-left definitions' key={definition.definition}>{definition.definition}</p>
			))}


			<form onSubmit={submitGuess}>
				<input onChange={(e) => setCurrGuess(e.currentTarget.value.toLowerCase())} value={currGuess} />
				<br />
				<button type='submit'>Submit Guess</button>
				<button type='button' onClick={() => revealWord()}>Reveal the Daily</button>
			</form>

			{(guessedSynonyms.length === synonyms.length && synonyms.length > 0)
				? <p> You won it all! </p> : null}

			<p>{guessMessage}</p>


			{(isCorrectDefinitionWord || gaveUp) &&
				<>
					<hr />
					<h2 className='cinnamon-message'>{gaveUp ? "" : "You got it!"} The Daily Cinnamon was: {correctDefinitionWord}
					</h2>
					<hr />
				</>
			}

			{synonyms.length === 0 &&
				<p>There are no synonyms to guess today :(</p>
			}

			<p>There {synonyms.length - guessedSynonyms.length > 1 ? "are" : "is"} {synonyms.length - guessedSynonyms.length} synonym{synonyms.length - guessedSynonyms.length > 1 ? "s" : ""} left</p>

			<button type='button' onClick={() => revealSynonym()}>Reveal one synonym</button>

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