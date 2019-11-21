var R = require('ramda');

var DEFAULTS = {
    explicitChildren:      true,
    preserveChildrenOrder: true,
    explicitRoot:          false,
    attrkey:               'props',
    childkey:              'children',
    tagkey:                'tagname'
};

module.exports = function (opts) {
    return R.merge(DEFAULTS, opts || {});
};

