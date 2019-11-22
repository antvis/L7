var R = require('ramda');

var indexOfRegExp = require('./index-of-regex');
var titleCase     = require('./title-case');
var DEFAULT_DELIM = require('./default-delimiter');

module.exports = R.curry(function camelCase (delim, text) {
    var delimiter = delim || DEFAULT_DELIM;
    var idx       = indexOfRegExp(delimiter, text);
    var first     = text.slice(0, idx === -1 ? text.length : idx);
    var remainder = idx > -1 ? titleCase(delimiter, text.slice(idx+1)) : '';
    var result    = first + remainder;
    return result;
});
