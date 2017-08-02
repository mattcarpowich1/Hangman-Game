//where the word to be guessed will be displayed
var wordZone = document.getElementById("word");

//where the result icon will be displayed
var resultIcon = document.getElementById("result_icon");

//where letters guessed will be displayed
var guessedZone = document.getElementById("guessed_list");

//where remaining guesses will be displayed
var remainingZone = document.getElementById("remaining");

//button to start new game
var newGameButton = document.querySelector('button');

//where picture of composer will be displayed
var composerPic = document.getElementById("composer_area");

//where composer's name will show underneath photo
var composerName = document.getElementById("name");

//words for the game 
var composers = ['Mozart', 'Beethoven', 'Haydn', 'Debussy', 'Wagner', 'Bach', 'Stravinsky', 'Chopin', 'Schubert', 'Tchaikovsky', 'Handel', 'Brahms', 'Vivaldi', 'Mahler', 'Liszt', 'Verdi', 'Ravel', 'Rachmaninoff', 'Mendelssohn', 'Shostakovich', 'Schoenberg', 'Dvorak', 'Puccini', 'Prokofiev', 'Strauss', 'Bartok', 'Berlioz', 'Bruckner', 'Monteverdi', 'Copland'];

//keep track of wins and losses
var wins, losses;
wins = losses = 0;
var winsDisplay = document.getElementById("wins");
var lossesDisplay = document.getElementById("losses");


//checks if letter is alphabetical
var isAlpha = function(ch){
	return /^[A-Z]$/i.test(ch);
}

//replaces certain letter in string
String.prototype.replaceAt=function(index, replacement) {
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

//returns a string of word.length _ 's 
function lineify(word) {
	var lines = ""
	for (var i = 0; i < word.length; i++) {
		lines+="_";
	}
	return lines;
}

//game constructor
function GameBuilder(word) {
	this.word = word.toUpperCase().toLowerCase();
	this.wordSpace = lineify(word);
	this.remainingGuesses = 5;
	this.lettersGuessed = [];
	this.isOver = false;
  
	//returns true if the user has correctly guessed the word
 	this.wordHasBeenGuessed = function() {
		for (var i = 0; i < this.word.length; i++) {
			if (!isAlpha(this.wordSpace.charAt(i))) {
				return false;
			}
		}
		return true;
	};

	//does what it says it does
	this.updateDisplay = function() {
		//update word area
		wordZone.textContent = this.wordSpace.toUpperCase();
		//update guessed letters
		var letters = "";
		for (var i = 0; i < this.lettersGuessed.length; i++) {
			if (i !== 0) {
				letters += " ";
			}
			letters += this.lettersGuessed[i];
		}
		guessedZone.textContent = letters;
		//update guesses remaining
		remainingZone.textContent = this.remainingGuesses;
		//update wins or losses if game is over
		if (this.isOver) {
			winsDisplay.textContent = wins + "";
			lossesDisplay.textContent = losses + "";
		}
	};
}

//call to test values
function testGame(gameX) {
	console.log("this.word = " + gameX.word);
	console.log("this.wordSpace = " + gameX.wordSpace);
	console.log("this.wordLength = " + gameX.word.length);
	console.log ("this.remainingGuesses = " + gameX.remainingGuesses);
	for (var i = 0; i < gameX.lettersGuessed.length; i++) {
		console.log("guessed letter " + gameX.lettersGuessed[i]);
	}
	console.log("Game over = " + game.isOver);
}

//initialize game
var randomWord = composers[Math.floor(Math.random()*composers.length)];
console.log("random word " + randomWord);
var game = new GameBuilder(randomWord);
game.updateDisplay();

//when key is pressed...
document.addEventListener("keyup", function(event) {

	//do nothing if game is over
	if (game.isOver) {
		return false;
	}
															   
	//figure out which key it was //
	var key = event.key;

	//check if the key is actually a letter
	// or if it has already been guessed
	if ((!isAlpha(key)) || (game.lettersGuessed.indexOf(key) > -1)) {
		return false;
	} else {
		//add to the guessed letters list
		game.lettersGuessed.push(key.toLowerCase());
	}

	//check if the letter is in the word
	if (game.word.indexOf(key) > -1) {
		//fill in the letter for each appearance in word
		for (var i = 0; i < game.word.length; i++) {
			if (game.word.charAt(i) === key) {
				game.wordSpace = game.wordSpace.replaceAt(i, key);
			}
		} 
	} else {
		//SUBRTACT one from remaining guesses
		game.remainingGuesses-=1;
	}

	//is the game over?
	if (game.remainingGuesses === 0) {
		//the player has lost
		game.isOver = true;
		losses++;
		//turn the loss column header red indicating a loss
		document.getElementById("lossHeader").style.color = "#c93636";
	} else if (game.wordHasBeenGuessed()) {
		//the player has won
		game.isOver = true;
		wins++;
		//display picture of composer
		composerPic.innerHTML = "<img src='assets/images/" + game.word + ".jpg' alt='composer'>";
		//turn the win column header green indicating a win
		document.getElementById("winHeader").style.color = "#31af91";
	}

	//update the display     
	game.updateDisplay();

	//check values
	testGame(game);

});

//start new game when new word button is pressed
newGameButton.addEventListener("click", function() {
	//generate word for new game
	randomWord = composers[Math.floor(Math.random()*composers.length)];
	//create new game
	game = new GameBuilder(randomWord);
	//refresh display
	game.updateDisplay();
	//turn composer pic back to mystery pic
	composerPic.innerHTML = "<img src='assets/images/questionmark.jpg' alt='question mark'>";
	//turn wins/losses font back to white
	document.getElementById("lossHeader").style.color = "white";
	document.getElementById("winHeader").style.color = "white";
});




