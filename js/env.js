'use strict';

module.exports = Env;

function assert(condition, message) {
  if (!condition) throw "ERROR: " + message;
}

function Env(outer, binds, exprs) {
  this.outer = outer;
  this.data = {};
  binds = binds || []
  exprs = exprs || []
  assert(binds.length == exprs.length, "binds and exprs should have same length.");
  for(var i = 0; i < binds.length; i++) {
    this.data[binds[i]] = exprs[i];
  }
}

Env.prototype.set = function(symbol, value) {
  this.data[symbol] = value;
  return value;
}

Env.prototype.find = function(symbol) {
  var value = this.data[symbol];
  return value ? value :
    ((this.outer != null) ? this.outer.find(symbol) : null);
}

Env.prototype.get = function(symbol) {
  var value = this.find(symbol);
  if (!value) throw symbol + " not found.";
  return value;
}
