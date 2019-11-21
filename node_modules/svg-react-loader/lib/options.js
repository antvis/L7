var R = require('ramda');

var DEFAULTS = {
    displayName: 'SvgReactComponent',
    filters: [],
    propsMap: {
        'class': 'className',
        'for': 'htmlFor'
    },
    classIdPrefix: false,
    raw: false,
    xmlnsTest: /^xmlns(Xlink)?$/
};

module.exports = function (opts) {
    var filters = [];

    if (opts && opts.propsMap) {
        opts.propsMap = R.merge(DEFAULTS.propsMap, opts.propsMap);
    }

    var options = R.merge(DEFAULTS, opts || {});

    filters.
        push(
            require('./sanitize/filters/text-content')(null),
            require('./sanitize/filters/normalize-node')(null),
            require('./sanitize/filters/convert-style-prop')(null),
            require('./sanitize/filters/prop-mapper')(options.propsMap),
            require('./sanitize/filters/camel-case-props')(null),
            require('./sanitize/filters/remove-xmlns-props')(options.xmlnsTest)
        );

    if (options.classIdPrefix) {
        filters.
            push(require('./sanitize/filters/prefix-style-class-id')({
                prefix: options.classIdPrefix
            }));
    }

    if (options.root) {
        filters.
            push(require('./sanitize/filters/custom-root')(options.root));
    }

    options.filters = filters.concat(options.filters);

    return options;
};
