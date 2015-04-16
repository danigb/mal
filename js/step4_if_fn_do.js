'use strict';

var reader = require('./reader');
var printer = require('./printer');
var Env = require('./env');

function READ(input) {
  return reader.read_str(input);
}

function EVAL(ast, env) {
  if (Array.isArray(ast)) {
    if(ast[0] == 'def!') {
      return env.set(ast[1], EVAL(ast[2], env));
    } else if (ast[0] == 'let*') {
      var newEnv = new Env(env);
      var bindings = ast[1];
      for(var i = 0; i < bindings.length; i += 2) {
        newEnv.set(bindings[i], EVAL(bindings[i + 1], env));
      }
      return EVAL(ast[2], newEnv);
    } else {
      var evaluated = eval_ast(ast, env);
      var func = evaluated.shift();
      return func.apply(undefined, evaluated);
    }
  } else {
    return eval_ast(ast, env);
  }
}

function eval_ast(ast, env) {
  if (typeof ast === 'string') {
    var value = env.get(ast)
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
  return printer.pr_str(data, true);
}

var repl_env = new Env(null);
repl_env.set('+', function(a, b) { return a + b; });
repl_env.set('-', function(a, b) { return a - b; });
repl_env.set('*', function(a, b) { return a * b; });
repl_env.set('/', function(a, b) { return a / b; });

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
