var R          = require('ramda');
var fromObject = require('./from-object');

module.exports = R.curry(function stringify (opts, tree) {
    var displayName = opts.displayName;

    var preamble = [
        'var React = require(\'react\');',
        '',
        'function ' + displayName + ' (props) {',
    ];

    var postamble = [
        '}',
        '',
        displayName + '.defaultProps = ' + JSON.stringify(tree.props || {}) + ';',
        '',
        'module.exports = ' + displayName + ';',
        '',
        displayName + '.default = ' + displayName + ';',
        ''
    ];

    return preamble.
        concat([fromObject(tree, true)]).
        concat(postamble).
        join('\n');
});
