var R = require('ramda');

var DEFAULTS = {
    test: /^xmlns(Xlink)?$/
};

module.exports = R.curryN(2, function removeXmlnsProps (opts) {
    var options = R.merge(DEFAULTS, opts || {});
    var path    = this.path;
    var key     = path[path.length - 1];
    var isXmlns = options.test.test(key);

    if (this.isLeaf && isXmlns) {
        this.delete();
    }
});
