'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jsonStringifyPrettyCompact = require('json-stringify-pretty-compact');

var _jsonStringifyPrettyCompact2 = _interopRequireDefault(_jsonStringifyPrettyCompact);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDefaultProp(defaultProps, key, value) {
  if (!defaultProps) {
    return false;
  }
  return defaultProps[key] === value;
}

function stringifyObject(object, opts) {
  var result = void 0;
  if (Array.isArray(object)) {
    result = object.map(function (item) {
      return stringifyObject(item);
    });
  } else if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    result = {};
    Object.keys(object).map(function (key) {
      var value = object[key];
      if (_react2.default.isValidElement(value)) {
        value = jsxToString(value, opts);
      } else if (Array.isArray(value)) {
        value = value.map(function (item) {
          return stringifyObject(item, opts);
        });
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        value = stringifyObject(value, opts);
      } else if (typeof value === 'function') {
        value = opts.useFunctionCode ? opts.functionNameOnly ? value.name.toString() : value.toString() : '...';
      }
      result[key] = value;
    });
  } else {
    result = object;
  }
  return result;
}

var _JSX_REGEXP = /"<.+>"/g;

function serializeItem(item, options) {
  var delimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var result = void 0;

  if ((0, _immutable.isImmutable)(item)) {
    result = serializeItem(item.toJS(), options, delimit);
  } else if (typeof item === 'string') {
    result = delimit ? '\'' + item + '\'' : item;
  } else if (typeof item === 'number' || typeof item === 'boolean') {
    result = '' + item;
  } else if (Array.isArray(item)) {
    var indentation = new Array(options.spacing + 1).join(' ');
    var delimiter = delimit ? ', ' : '\n' + indentation;
    var items = item.map(function (i) {
      return serializeItem(i, options);
    }).join(delimiter);
    result = delimit ? '[' + items + ']' : '' + items;
  } else if (_react2.default.isValidElement(item)) {
    result = jsxToString(item, options);
  } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
    result = (0, _jsonStringifyPrettyCompact2.default)(stringifyObject(item, options));
    // remove string quotes from embeded JSX values
    result = result.replace(_JSX_REGEXP, function (match) {
      return match.slice(1, match.length - 1);
    });
  } else if (typeof item === 'function') {
    result = options.useFunctionCode ? options.functionNameOnly ? item.name.toString() : item.toString() : '...';
  }
  return result;
}

function jsxToString(component, options) {

  var baseOpts = {
    displayName: component.type.displayName || component.type.name || component.type,
    ignoreProps: [],
    ignoreTags: [],
    keyValueOverride: {},
    spacing: 0,
    detectFunctions: false
  };

  var opts = _extends({}, baseOpts, options);

  // Do not return anything if the root tag should be ignored
  if (opts.ignoreTags.indexOf(opts.displayName) !== -1) {
    return '';
  }

  var componentData = {
    name: opts.displayName
  };

  delete opts.displayName;
  if (component.props) {
    var indentation = new Array(opts.spacing + 3).join(' ');
    componentData.props = Object.keys(component.props).filter(function (key) {
      return key !== 'children' && !isDefaultProp(component.type.defaultProps, key, component.props[key]) && opts.ignoreProps.indexOf(key) === -1;
    }).map(function (key) {
      var value = void 0;
      if (typeof opts.keyValueOverride[key] === 'function') {
        value = opts.keyValueOverride[key](component.props[key]);
      } else if (opts.keyValueOverride[key]) {
        value = opts.keyValueOverride[key];
      } else if (opts.shortBooleanSyntax && typeof component.props[key] === 'boolean' && component.props[key]) {
        return key;
      } else {
        value = serializeItem(component.props[key], _extends({}, opts, { key: key }));
      }
      if (typeof value !== 'string' || value[0] !== "'") {
        value = '{' + value + '}';
      }
      // Is `value` a multi-line string?
      var valueLines = value.split(/\r\n|\r|\n/);
      if (valueLines.length > 1) {
        value = valueLines.join('\n' + indentation);
      }
      return key + '=' + value;
    }).join('\n' + indentation);

    if (component.key && opts.ignoreProps.indexOf('key') === -1) {
      componentData.props += 'key=\'' + component.key + '\'';
    }

    if (componentData.props.length > 0) {
      componentData.props = ' ' + componentData.props;
    }
  }

  if (component.props.children) {
    opts.spacing += 2;
    var _indentation = new Array(opts.spacing + 1).join(' ');
    if (Array.isArray(component.props.children)) {
      componentData.children = component.props.children.reduce(function (a, b) {
        return a.concat(b);
      }, []) // handle Array of Arrays
      .filter(function (child) {
        var childShouldBeRemoved = child && child.type && opts.ignoreTags.indexOf(child.type.displayName || child.type.name || child.type) === -1;
        // Filter the tag if it is in the ignoreTags list or if is not a tag
        return childShouldBeRemoved;
      }).map(function (child) {
        return serializeItem(child, opts, false);
      }).join('\n' + _indentation);
    } else {
      componentData.children = serializeItem(component.props.children, opts, false);
    }
    return '<' + componentData.name + componentData.props + '>\n' + ('' + _indentation + componentData.children + '\n') + (_indentation.slice(0, -2) + '</' + componentData.name + '>');
  } else {
    return '<' + componentData.name + componentData.props + ' />';
  }
}

exports.default = jsxToString;
module.exports = exports['default'];