var regexp;

module.exports = function coerceToRegExp (stringOrRegExp) {
  var result = stringOrRegExp;

  if (typeof result === 'string') {
    eval('regexp = ' + stringOrRegExp);
    result = regexp;
  }

  return result;
};
