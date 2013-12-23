var fs = require('fs');
var readline = require('readline');

function initialPattern (size) {
  return new Array(size + 1).join('-');
}

module.exports.initialPattern = initialPattern;

function createPatterns (pattern, guess) {
  
  var res = {};
  var p;
  
  for (var i = Math.pow(2, pattern.length) - 1; i >= 0; i--) {

    p = null; 
    p = pattern.replace(/-/g, function(c, n) { 
      return (i & (1 << n)) ? guess : c; 
    });

    res[p] = [];

  }

  return res;
}

module.exports.createPatterns = createPatterns;

function filterGuesses(pattern, guesses) {

  var r = new RegExp('^' + pattern.replace(/-/g, '[^' + guesses.join('') + ']') + '$');
  return function(word){
    return r.test(word);
  };
}

module.exports.filterGuesses = filterGuesses;

function filterPattern(pattern, alphabet) {
  var r = new RegExp('^' + pattern.replace(/-/g, '[' + alphabet.join('') + ']') + '$');
  return function(word) {
    return r.test(word);
  };
}

module.exports.filterPattern = filterPattern;

