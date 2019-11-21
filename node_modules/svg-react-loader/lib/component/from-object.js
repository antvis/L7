var R = require('ramda');

var objectToElement = R.unary(fromObject);
var mapChildren     = R.pipe(
    function (children) {
        return children.
            map(function (child, idx) {
                child.props = R.merge(child.props || {}, { key: idx });
                return child;
            });
    },
    R.map(objectToElement)
);

function fromObject (obj, isRoot) {
    if (typeof obj === 'string') {
        return JSON.stringify(obj);
    }

    var tagname  = obj.tagname;
    var props    = obj.props;
    var children = obj.children;
    var result   = '';

    if (isRoot) {
        result += '    return ';
    }

    result += 'React.createElement(' + JSON.stringify(tagname);

    if (props && !isRoot) {
        result += ',' + JSON.stringify(props);
    }
    else if (isRoot) {
        result += ',props';
    }
    else {
        result += ',null';
    }

    if (children && children.length) {
        result +=
            children.length === 1 ?
                ',' + fromObject(children[0]) :
                ',[' + mapChildren(children).join(',') + ']';
    }

    result += ')';

    if (isRoot) {
        result += ';';
    }

    return result;
}

module.exports = fromObject;
