var R = require('ramda');

module.exports = R.curry(function logging (opts, value) {
    console.log(
        '%s %j => %j',
        this.isLeaf ? 'leafNode' : 'node',
        this.path,
        value
    );
});
