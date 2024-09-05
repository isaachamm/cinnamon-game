import cinnamonLogo from '/Cinnamon_logo.png';

type InstructionsProps = {
	setShowInstructions: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Instructions({
	setShowInstructions
}: InstructionsProps) {

	return (
		<>
			<img src={cinnamonLogo} className="logo" alt="Linkedin logo" />

			<h1 className='cinnamon-message'>Welcome to the Daily Cinnamon Game!</h1>
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

			<button onClick={() => setShowInstructions(false)}>Click here to begin!</button>
		</>
	)
}