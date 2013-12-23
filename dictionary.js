var FILE = __dirname + '/dictionary.txt';

var readline = require('readline');
var fs = require('fs');

module.exports.stats = function initialize(size, cb) {

  var data = {
    smallest: Number.MAX_VALUE,
    largest: Number.MIN_VALUE,
  };

  var rd = readline.createInterface({
      input: fs.createReadStream(FILE),
      output: process.stdout,
      terminal: false
  });

  rd.on('line', function(line) {
    
    if(line.length < data.smallest) {
      data.smallest = line.length;
    }

    if (line.length > data.largest) {
      data.largest = line.length;
    }

    var count = data[line.length] || 0;
    data[line.length] = ++count;

  });

  rd.on('close', function() {
    cb(null, data);
  });

};

module.exports.init = function(size, callback) {

  var rd = readline.createInterface({
      input: fs.createReadStream(FILE),
      output: process.stdout,
      terminal: false
  });

  var words = [];

  rd.on('line', function(line) {

    if (line.length === size ) words.push(line);

  });

  rd.on('close', function() {
    callback(null, words);
  });

};