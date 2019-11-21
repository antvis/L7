var R = require('ramda');

module.exports = R.curry(function indexOfRegExp (delim, text) {
    var results = delim.exec(text);
    return results && results.index || -1;
});
