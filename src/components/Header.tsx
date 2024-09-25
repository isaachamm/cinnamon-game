import personalLogo from '../assets/IH_Logo_Inverted_Blank.png';
import './Header.css';

export default function Header() {

	return (
		<>
			<div className='header'>
				<a href='https://isaachamm.github.io'>
					<img src={personalLogo} className="logo" alt="Linkedin logo" />
				</a>

				<div className='information-container'>

					<a className='information'>
						&#9432;
					</a>

					<div className='hover-information'>
						<p>Instructions reminder:</p>
						<p>Use the textbox to guess the Daily Cinnamon—-That's the word that the definitions describe.</p>
						<p>Then, guess the remaining synonyms!</p>

					</div>
				</div>

			</div>
			<hr />

		</>
	)
}