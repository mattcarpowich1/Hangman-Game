//where the word to be guessed will be displayed
var wordZone = document.getElementById("word");

//where total number of wins will be displayed
var winsDisplay = document.getElementById("wins");

//where total number of losses will be displayed
var lossesDisplay = document.getElementById("losses");

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

//element through which audio will play
var song = document.getElementById("player");

//words for the game [lastName, firstName]
var composers = [ ['Mozart', 'Wolfgang Amadeus'], ['Beethoven', 'Ludwig Van'], ['Haydn', 'Joseph'], ['Debussy', 'Claude'], ['Wagner', 'Richard'], ['Bach', 'Johann Sebastian'], ['Stravinsky', 'Igor'], ['Chopin', 'Frederic'], ['Schubert', 'Franz'], ['Tchaikovsky', 'Pyotr Ilyich'], ['Brahms', 'Johannes'], ['Vivaldi', 'Antonio'], ['Handel', 'George Frideric'], ['Ravel', 'Maurice'], ['Mahler', 'Gustav'] ];

//second array to keep track of words already used
var composers2 = [];

//keep track of wins and losses
var wins, losses;
wins = losses = 0;


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

//call to test game values
function testGame(gameX) {
	console.log("this.word = " + gameX.word);
  console.log("this.firstName = " + gameX.firstName);
	console.log("this.wordSpace = " + gameX.wordSpace);
	console.log ("this.remainingGuesses = " + gameX.remainingGuesses);
	for (var i = 0; i < gameX.lettersGuessed.length; i++) {
		console.log("guessed letter " + gameX.lettersGuessed[i]);
	}
	console.log("Game over = " + game.isOver);
}

//game constructor
function GameBuilder(word) {
	this.word = word[0];
	this.firstName = word[1];
	this.wordSpace = lineify(this.word);
	this.remainingGuesses = 8;
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

	//updates what the user sees in browser
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

  //INITIALIZE FIRST GAME//
 /////////////////////////
//choose random index between 0 and composers.lenth - 1
var randomIndex = Math.floor(Math.random()*composers.length);

//using that index, select word from list of words
var randomWord = composers[randomIndex];

//remove word from composers array so it won't be used again
composers.splice(randomIndex, 1);

//put word into the list of already used words
composers2.push(randomWord);

//create new game object
var game = new GameBuilder(randomWord);

//update the display on screen
game.updateDisplay();



  //EVENT LISTENER//
 //////////////////
//when key is pressed...
document.addEventListener("keyup", function(event) {

	//do nothing if game is over
	if (game.isOver) {
		return false;
	}
															   
	//figure out which key it was 
	var key = event.key;

	//check if the key is actually a letter
	// or if it has already been guessed
	if ((!isAlpha(key)) || (game.lettersGuessed.indexOf(key) > -1)) {
		return false;
	} 

	//check if the letter is in the lowercase version of the word
	if (game.word.toUpperCase().toLowerCase().indexOf(key) > -1) {
		//fill in the letter for each appearance in word
		for (var i = 0; i < game.word.length; i++) {
			if (game.word.toUpperCase().toLowerCase().charAt(i) === key) {
				game.wordSpace = game.wordSpace.replaceAt(i, key);
			}
		} 
	} else {
		//SUBRTACT one from remaining guesses
		game.remainingGuesses-=1;
		//add the letter to letters guessed list
		game.lettersGuessed.push(key.toLowerCase());

	}

	//is the game over?
	if (game.remainingGuesses === 0) {
		//the player has lost
		game.isOver = true;
		//increment total losses
		losses++;
		//turn the loss column header red indicating a loss
		document.getElementById("lossHeader").style.color = "#c93636";
	} else if (game.wordHasBeenGuessed()) {
		//the player has won
		game.isOver = true;
		//increment total wins
		wins++;
		//display picture of composer
		composerPic.innerHTML = "<img src='assets/images/" + game.word + ".jpg' alt='composer'>";
		//include the composer's full name below the image
		composerName.textContent = game.firstName + " " + game.word;
    //play audio from composer  
    song.innerHTML = "<source src='assets/music/" + game.word + ".mp3' type=audio/mpeg>";
    song.load();
    song.play();
		//turn the win column header green indicating a win
		document.getElementById("winHeader").style.color = "#31af91";
	}

	//update the display     
	game.updateDisplay();

	//if game is over automatically generate a new game
	if (game.isOver) {

		//after a short delay, start new game
		setTimeout(function() {

			//if all words have been exhausted...
			if (composers.length === 0) {
				//reset the arrays to original state
				composers = composers2;
				composers2 = [];
			}

			//choose random index between 0 and composers.length - 1
			randomIndex = Math.floor(Math.random()*composers.length);

			//using that index, select word from list of words
			randomWord = composers[randomIndex];
			
			//remove word from composers array so it won't be used again
			composers.splice(randomIndex, 1);

			//put word into the list of already used words
			composers2.push(randomWord);

			//create new game object using selected composer
			game = new GameBuilder(randomWord);

			//turn win/loss column headers back to white
			document.getElementById("winHeader").style.color = "white";
			document.getElementById("lossHeader").style.color = "white";

			//...and update the display
			game.updateDisplay();

		}, 2000);
	}

});
