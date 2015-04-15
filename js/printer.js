'use strict';

module.exports = {
  pr_str: pr_str
}

function pr_str(data) {
  if (typeof data == 'string') return data;
  else if (typeof data == 'number') return '' + data;
  else {
    var list = data.map(function(e) { return pr_str(e); });
    return "(" + list.join(' ') + ")";
  }
}
