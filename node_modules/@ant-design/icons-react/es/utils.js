import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import { generate as generateColor } from '@ant-design/colors';
import * as React from 'react';
export function log(message) {
    if (!(process && process.env && process.env.NODE_ENV === 'production')) {
        console.error('[@ant-design/icons-react]: ' + message + '.');
    }
}
export function isIconDefinition(target) {
    return typeof target === 'object' && typeof target.name === 'string' && typeof target.theme === 'string' && (typeof target.icon === 'object' || typeof target.icon === 'function');
}
export function normalizeAttrs() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Object.keys(attrs).reduce(function (acc, key) {
        var val = attrs[key];
        switch (key) {
            case 'class':
                acc.className = val;
                delete acc['class'];
                break;
            default:
                acc[key] = val;
        }
        return acc;
    }, {});
}
export var MiniMap = function () {
    function MiniMap() {
        _classCallCheck(this, MiniMap);

        this.collection = {};
    }

    _createClass(MiniMap, [{
        key: 'clear',
        value: function clear() {
            this.collection = {};
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            return delete this.collection[key];
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this.collection[key];
        }
    }, {
        key: 'has',
        value: function has(key) {
            return Boolean(this.collection[key]);
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            this.collection[key] = value;
            return this;
        }
    }, {
        key: 'size',
        get: function get() {
            return Object.keys(this.collection).length;
        }
    }]);

    return MiniMap;
}();
export function generate(node, key, rootProps) {
    if (!rootProps) {
        return React.createElement(node.tag, _extends({ key: key }, normalizeAttrs(node.attrs)), (node.children || []).map(function (child, index) {
            return generate(child, key + '-' + node.tag + '-' + index);
        }));
    }
    return React.createElement(node.tag, _extends({
        key: key
    }, normalizeAttrs(node.attrs), rootProps), (node.children || []).map(function (child, index) {
        return generate(child, key + '-' + node.tag + '-' + index);
    }));
}
export function getSecondaryColor(primaryColor) {
    // choose the second color
    return generateColor(primaryColor)[0];
}
export function withSuffix(name, theme) {
    switch (theme) {
        case 'fill':
            return name + '-fill';
        case 'outline':
            return name + '-o';
        case 'twotone':
            return name + '-twotone';
        default:
            throw new TypeError('Unknown theme type: ' + theme + ', name: ' + name);
    }
}