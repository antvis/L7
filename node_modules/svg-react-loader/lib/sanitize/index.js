var R        = require('ramda');
var traverse = require('traverse');

module.exports = R.curry(function sanitize (opts, tree) {
    var options    = require('./options')(opts);
    var namekey    = options.namekey;
    var hasNameKey = R.has(namekey);
    var tagkey     = options.tagkey;
    var filters    = options.filters;

    return traverse.map(tree, function (value) {
        var update = this.update;
        this.update = function (val, stopHere) {
            value = val;
            update.call(this, val, stopHere);
        };

        if (this.notLeaf && hasNameKey(value)) {
            Object.assign(value, R.objOf(tagkey, value[namekey]));
            delete value[namekey];
        }

        filters.
            forEach(function (fn) {
                fn.call(this, value);
            }, this);
    });
});
