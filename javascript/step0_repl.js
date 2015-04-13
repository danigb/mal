'use strict';

function READ(input) {
  return input;
}

function EVAL(input) {
  return input;
}

function PRINT(input) {
  return input;
}

function rep(input) {
  return PRINT(EVAL(READ(input)));
}

var prefix = 'user> ';
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.setPrompt(prefix, prefix.length);

rl.on('line', function(input) {
  console.log(rep(input));
  rl.prompt();
});

rl.on('close', function() {
  console.log("Adiós!");
  process.exit(0);
});

rl.prompt();
