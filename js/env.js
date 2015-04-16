'use strict';

module.exports = Env;

function Env(outer) {
  this.outer = outer;
  this.data = {};
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
