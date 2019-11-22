var R = require('ramda');

var DEFAULTS = {
    tagName:      'tagname',
    propsName:    'props',
    childrenName: 'children'
};

module.exports = function configureNormalizeNode (opts) {
    var options = R.merge(DEFAULTS, opts || {});

    var props    = options.propsName;
    var children = options.childrenName;
    var tagname  = options.tagName;

    var hasProps    = R.has(props);
    var hasChildren = R.has(children);
    var pickKeys    = R.pick([props, tagname, children]);

    return function normalizeNode (value) {
        if (hasProps(value) || hasChildren(value)) {
            this.update(pickKeys(value));
        }
    };
};
