require('./extension.js');

var validChars = /[a-zA-Z]/;
// TODO: pull words from some API
var words = ['shoobx','tissue','league','banana','eat','peanut','butter'];
var maxTrials = 10;


class Hangman {
  constructor() {
    // getting a random word from words array. See extension.js for random()
    this.word = words.random().toLowerCase();
    this.letters = new Array(this.word.length).fill('_');
    this.missed = [];
    this.guessed = [];
  }

  getWord() {
    return this.word;
  }

  getLetters() {
    return this.letters;
  }

  guess(letter) {
    letter = letter.toLowerCase();
    // mark the letter as guessed
    if (this.guessed.indexOf(letter) === -1) this.guessed.push(letter);
    // get all indexes of this letter in the word
    var indexes = this.word.indexesOf(letter);
    // we add all correct letters to the word array, flip _ to letters, and return true
    if (indexes.length > 0) {
      for (let idx of indexes) this.letters[idx] = this.word[idx];
      return true;
    }
    // else we push the letter to missed array and return false
    if (this.missed.indexOf(letter) === -1) this.missed.push(letter);
    return false;
  }

  getStatus() {
    // if number of missed letters is larger than maximum trials
    if (this.missed.length >= maxTrials) return Hangman.Status.Lost;
    // if the letters array's _ has been replaced by letters
    if (this.letters.indexOf('_') === -1) return Hangman.Status.Won;
    // else game is in progress
    return Hangman.Status.InProgress;
  }

  getRemainingMissesCount() {
    return maxTrials - this.missed.length;
  }

  getGuesses() {
    return this.guessed;
  }

  getMisses() {
    return this.missed;
  }
}

Hangman.Status = {
  InProgress: 1,
  Won: 2,
  Lost: 3
};

module.exports = Hangman;
