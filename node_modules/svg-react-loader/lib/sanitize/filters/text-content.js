var R = require('ramda');

var DEFAULTS = {
    contentKey:  '_',
    childrenKey: 'children'
};

module.exports = function configureTextContent (opts) {
    var options       = R.merge(DEFAULTS, opts || {});
    var contentKey    = options.contentKey;
    var childrenKey   = options.childrenKey;
    var hasContentKey = R.has(contentKey);

    return function textContent (value) {
        if (this.notLeaf && hasContentKey(value)) {
            var text = value[contentKey];
            delete value[contentKey];

            if (value[childrenKey]) {
                value[childrenKey].push(text);
            }
            else {
                value[childrenKey] = [text];
            }
        }
    };
};

