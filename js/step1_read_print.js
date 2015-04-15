'use strict';

var reader = require('./reader');
var printer = require('./printer');

function READ(input) {
  return reader.read_str(input);
}

function EVAL(input) {
  return input;
}

function PRINT(data) {
  return printer.pr_str(data);
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
  try {
    console.log(rep(input));
  } catch(e) {
    console.log(e);
  }
  rl.prompt();
});

rl.on('close', function() {
  console.log("Adiós!");
  process.exit(0);
});

rl.prompt();
