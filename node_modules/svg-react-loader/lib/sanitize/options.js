var R = require('ramda');

var DEFAULTS = {
    namekey: require('../xml/xml2js-name-key'),
    tagkey:  'tagname',
    filters: []
};

module.exports = function (opts) {
    if (opts) {
        if (opts.filters) {
            opts.filters =
                DEFAULTS.
                filters.
                slice().
                concat(opts.filters);
        }
    }

    return R.merge(DEFAULTS, opts || {});
};

