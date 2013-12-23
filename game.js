var Alphabet = require('./alphabet');
var parser = require('./parser');

var utils = require('util');
var EventEmitter = require('events').EventEmitter;

function Game (words) {

  var size = words[0].length;
  this.words = words;
  this.choices = new Alphabet();
  this.tries = 10;
  this.guesses = [];
  this.lastGuess = null;
  this.pattern = parser.initialPattern(size);

}

utils.inherits(Game, EventEmitter);

Game.prototype.guess = function (guess) {

  var ok = this.checkAlreadyGuessed(guess);

  if (!ok) {
    return this.emit('guessed', guess);
  }

  // Capture the last guess
  this.lastGuess = guess;
  this.guesses.push(guess);

  // Copy the current choices
  var choices = this.choices.slice();
  // Remove letter from available choices
  this.choices.splice(this.choices.indexOf(guess), 1);
  

  // Current word set
  var words = this.words;

  // Create the pattern map
  var patterns = parser.createPatterns(this.pattern, guess);

  // Now we calculate the decision based on word subsets
  // 
  // The pattern choices can use current alphabet
  // Calculate the patterns and words with the guessed letter in it
  Object.keys(patterns).forEach(function(pattern) {

    patterns[pattern] = words.filter(parser.filterPattern(pattern, choices));

  });

  // Calculate the words without the guessed letters in it
  patterns[this.pattern] = this.words.filter(parser.filterGuesses(this.pattern, this.guesses));

  // Lets find the largest set and "choose" that one
  var newPattern = Object.keys(patterns).reduce(function(previous, current, index){

    if (index === 1) console.log(previous, patterns[previous].length);
    console.log(current, patterns[current].length);
    
    return (patterns[previous].length >= patterns[current].length) ? previous : current;

  });

  console.log('largest', newPattern);

  if (this.pattern == newPattern) {
    this.words = patterns[this.pattern];
    // Decrement the "hangman"
    this.tries--;
    if (this.tries > 0) return this.emit('miss');
    else {
      var word = this.words[Math.floor(Math.random() * this.words.length)];
      return this.emit('lose', word);
    }
  }

  // otherwise we got a hit

  this.pattern = newPattern;
  this.words = patterns[newPattern];
  
  if (this.pattern.indexOf('-') < 0) return this.emit('win');
  else return this.emit('hit');

};

Game.prototype.checkAlreadyGuessed = function(guess) {

  // var truth = true;
  var i = this.choices.indexOf(guess);
  return (i >= 0);

};

module.exports = Game;
