import cinnamonLogo from '/Cinnamon_logo.png';
import './Instructions.css';

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
			<div className='instruction-message'>

				<p>
					On the next page, you'll see definitions for a randomly chosen word. This word is the Daily Cinnamon, a vocab word meant to spice up your lexicon. There can be multiple definitions for the same word. If a word could have multiple meanings, then only one meaning is given.
				</p>
				<p>
					Along with the Daily Cinnamon, there are other synonyms to guess as well, to expand your vocabulary even further! The game will alert you to how many synonyms there are, and if you guess correct synonyms before the Daily Cinnamon, they will show up as correct synonyms.
				</p>
				<p>
					Are you ready?
				</p>
			</div>

			<button onClick={() => setShowInstructions(false)}>Click here to begin!</button>
		</>
	)
}