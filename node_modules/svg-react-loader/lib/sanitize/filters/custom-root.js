var R = require('ramda');

module.exports = R.curry(function customRoot (opts, value) {
    if (this.isRoot) {
        if (opts.tagname) {
            value.tagname = opts.tagname;
        }
        if (opts.props) {
            value.props = R.merge(value.props || {}, opts.props);
        }
    }
});
