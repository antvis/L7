var R = require('ramda');

var DEFAULTS = {
    'class': 'className',
    'for': 'htmlFor'
};

module.exports = R.curry(function propMapper (opts, value) {
    var options = R.merge(DEFAULTS, opts || {});
    var path = this.path;
    var isProps = path[path.length - 1] === 'props';

    if (isProps) {
        this.update(
            Object.
            keys(value).
            reduce(function (acc, cur) {
                var key = cur;

                if (key in options) {
                    key = options[key];
                }

                acc[key] = value[cur];

                return acc;
            }, {})
        );
    }
});
