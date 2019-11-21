var R = require('ramda');

module.exports = R.curry(function attributeMapper (opts, name) {
    var mappings = opts;

    if (name in mappings) {
        return mappings[name];
    }

    return name;
});
