'use strict';

module.exports = {
  read_str: read_str
}

var Reader = function(tokens) {
  if (!(this instanceof Reader)) return new Reader(tokens);
  this.tokens = tokens;
  this.length = tokens.length;
  this.position = 0;
}
Reader.prototype.peek = function() {
  return this.tokens[this.position];
}
Reader.prototype.next = function() {
  return this.tokens[this.position++];
}

function read_str(string) {
  var reader = new Reader(tokenize(string));
  return read_form(reader);
}

// This function will take a single string
// and return an array/list of all the tokens (strings) in it.
var REGEX = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/;
function tokenize(string) {
  return string.split(REGEX).filter(function(e) { return e != '' });
}

function read_form(reader) {
  var token = reader.peek();
  if (token == '(') {
    return read_list(reader);
  } else {
    return read_atom(reader);
  }
}

function read_list(reader) {
  var list = [];
  reader.next(); // consume the '('

  while(reader.peek() != ')' && reader.peek() != null) {
    list.push(read_form(reader));
  }

  if (reader.peek() != ')') {
    throw "expected ')'"
  } else {
    reader.next();
  }
  return list;
}

function read_atom(reader) {
  var token = reader.next();
  if (token.match(/^-?[0-9]+$/)) {
      return parseInt(token,10)        // integer
  } else if (token.match(/^-?[0-9][0-9.]*$/)) {
      return parseFloat(token,10);     // float
  } else if (token[0] === "\"") {
      return token.slice(1,token.length-1)
          .replace(/\\"/g, '"')
          .replace(/\\n/g, "\n"); // string
  } else if (token === "nil") {
      return null;
  } else if (token === "true") {
      return true;
  } else if (token === "false") {
      return false;
  } else {
    return token;
  }
}
