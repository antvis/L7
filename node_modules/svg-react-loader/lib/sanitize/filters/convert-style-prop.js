var R = require('ramda');
var css = require('css');
var camelCase = require('../../util/camel-case')(/-/);

function camelCaseStyles (styles) {
    var ast = css.parse('.styles{' + styles + '}');
    var styles =
        ast.
        stylesheet.
        rules[0].
        declarations.
            reduce(function (acc, cur) {
                acc[camelCase(cur.property)] = cur.value;
                return acc;
            }, {});

    return styles;
}

module.exports = R.curry(function convertStyleProp (opts, value) {
    var path = this.path;
    var isProps = path[path.length - 2] === 'props';
    var isStyle = path[path.length - 1] === 'style';

    if (isProps && isStyle) {
        this.update(camelCaseStyles(value));
    }
});

module.exports.camelCaseStyles = camelCaseStyles;
