var R = require('ramda');
var coerceToRegExp = require('./coerce-to-reg-exp');
var uppercaseFirst = require('./upper-case-first');

var DEFAULT = /[:\w-]/;

module.exports = R.curry(function titleCase (delim, text) {
    var words = text.split(coerceToRegExp(delim) || DEFAULT);
    return words.
        map(uppercaseFirst).
        join('');
});
