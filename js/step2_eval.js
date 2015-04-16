'use strict';

var reader = require('./reader');
var printer = require('./printer');

function READ(input) {
  return reader.read_str(input);
}

function EVAL(ast, env) {
  if (Array.isArray(ast)) {
    var evaluated = eval_ast(ast, env);
    var func = evaluated.shift();
    return func.apply(undefined, evaluated);
  } else {
    return eval_ast(ast, env);
  }
}

function eval_ast(ast, env) {
  if (typeof ast === 'string') {
    var value = env[ast];
    if (value == null) {
      throw "Symbol " + ast + " not found."
    }
    return value;
  } else if (Array.isArray(ast)) {
    return ast.map(function(ast) { return EVAL(ast, env); });
  } else {
    return ast;
  }
}

function PRINT(data) {
  return printer.pr_str(data);
}

var repl_env = {
  '+': function(a, b) { return a + b; },
  '-': function(a, b) { return a - b; },
  '*': function(a, b) { return a * b; },
  '/': function(a, b) { return a / b; }
}

function rep(input) {
  return PRINT(EVAL(READ(input), repl_env));
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
    console.error(e, e.stack);
  }
  rl.prompt();
});

rl.on('close', function() {
  console.log("Adiós!");
  process.exit(0);
});

rl.prompt();
