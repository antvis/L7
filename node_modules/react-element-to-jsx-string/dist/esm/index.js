import React, { Fragment, isValidElement } from 'react';

var spacer = (function (times, tabStop) {
  if (times === 0) {
    return '';
  }

  return new Array(times * tabStop).fill(' ').join('');
});

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var seen = [];
/**
 * Check if a value is an object or a function. Keep in mind that array, function, regexp, etc, are objects in JavaScript.
 *
 * @param value the value to check
 * @return true if the value is an object or a function
 */
function isObj(value) {
    var type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}
/**
 * Check if a value is a regular expression.
 *
 * @param value the value to check
 * @return true if the value is a regular expression
 */
function isRegexp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
}
/**
 * Get an array of all of the enumerable symbols for an object.
 *
 * @param object the object to get the enumerable symbols for
 */
function getOwnEnumPropSymbols(object) {
    return Object.getOwnPropertySymbols(object).filter(function (keySymbol) { return Object.prototype.propertyIsEnumerable.call(object, keySymbol); });
}
/**
 * pretty print an object
 *
 * @param input the object to pretty print
 * @param options the formatting options, transforms, and filters
 * @param pad the padding string
 */
function prettyPrint(input, options, pad) {
    if (pad === void 0) { pad = ''; }
    // sensible option defaults
    var defaultOptions = {
        indent: '\t',
        singleQuotes: true
    };
    var combinedOptions = __assign(__assign({}, defaultOptions), options);
    var tokens;
    if (combinedOptions.inlineCharacterLimit === undefined) {
        tokens = {
            newLine: '\n',
            newLineOrSpace: '\n',
            pad: pad,
            indent: pad + combinedOptions.indent
        };
    }
    else {
        tokens = {
            newLine: '@@__PRETTY_PRINT_NEW_LINE__@@',
            newLineOrSpace: '@@__PRETTY_PRINT_NEW_LINE_OR_SPACE__@@',
            pad: '@@__PRETTY_PRINT_PAD__@@',
            indent: '@@__PRETTY_PRINT_INDENT__@@'
        };
    }
    var expandWhiteSpace = function (string) {
        if (combinedOptions.inlineCharacterLimit === undefined) {
            return string;
        }
        var oneLined = string
            .replace(new RegExp(tokens.newLine, 'g'), '')
            .replace(new RegExp(tokens.newLineOrSpace, 'g'), ' ')
            .replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');
        if (oneLined.length <= combinedOptions.inlineCharacterLimit) {
            return oneLined;
        }
        return string
            .replace(new RegExp(tokens.newLine + '|' + tokens.newLineOrSpace, 'g'), '\n')
            .replace(new RegExp(tokens.pad, 'g'), pad)
            .replace(new RegExp(tokens.indent, 'g'), pad + combinedOptions.indent);
    };
    if (seen.indexOf(input) !== -1) {
        return '"[Circular]"';
    }
    if (input === null ||
        input === undefined ||
        typeof input === 'number' ||
        typeof input === 'boolean' ||
        typeof input === 'function' ||
        typeof input === 'symbol' ||
        isRegexp(input)) {
        return String(input);
    }
    if (input instanceof Date) {
        return "new Date('" + input.toISOString() + "')";
    }
    if (Array.isArray(input)) {
        if (input.length === 0) {
            return '[]';
        }
        seen.push(input);
        var ret = '[' + tokens.newLine + input.map(function (el, i) {
            var eol = input.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
            var value = prettyPrint(el, combinedOptions, pad + combinedOptions.indent);
            if (combinedOptions.transform) {
                value = combinedOptions.transform(input, i, value);
            }
            return tokens.indent + value + eol;
        }).join('') + tokens.pad + ']';
        seen.pop();
        return expandWhiteSpace(ret);
    }
    if (isObj(input)) {
        var objKeys_1 = __spreadArrays(Object.keys(input), (getOwnEnumPropSymbols(input)));
        if (combinedOptions.filter) {
            objKeys_1 = objKeys_1.filter(function (el) { return combinedOptions.filter && combinedOptions.filter(input, el); });
        }
        if (objKeys_1.length === 0) {
            return '{}';
        }
        seen.push(input);
        var ret = '{' + tokens.newLine + objKeys_1.map(function (el, i) {
            var eol = objKeys_1.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
            var isSymbol = typeof el === 'symbol';
            var isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el.toString());
            var key = isSymbol || isClassic ? el : prettyPrint(el, combinedOptions);
            var value = prettyPrint(input[el], combinedOptions, pad + combinedOptions.indent);
            if (combinedOptions.transform) {
                value = combinedOptions.transform(input, el, value);
            }
            return tokens.indent + String(key) + ': ' + value + eol;
        }).join('') + tokens.pad + '}';
        seen.pop();
        return expandWhiteSpace(ret);
    }
    input = String(input).replace(/[\r\n]/g, function (x) { return x === '\n' ? '\\n' : '\\r'; });
    if (!combinedOptions.singleQuotes) {
        input = input.replace(/"/g, '\\"');
        return "\"" + input + "\"";
    }
    input = input.replace(/\\?'/g, '\\\'');
    return "'" + input + "'";
}
exports.prettyPrint = prettyPrint;

});

unwrapExports(dist);
var dist_1 = dist.prettyPrint;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function sortObject(value) {
  // return non-object value as is
  if (value === null || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    return value;
  }

  // return date and regexp values as is
  if (value instanceof Date || value instanceof RegExp) {
    return value;
  }

  // make a copy of array with each item passed through sortObject()
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  // make a copy of object with key sorted
  return Object.keys(value).sort().reduce(function (result, key) {
    if (key === '_owner') {
      return result;
    }
    if (key === 'current') {
      // eslint-disable-next-line no-param-reassign
      result[key] = '[Circular]';
    } else {
      // eslint-disable-next-line no-param-reassign
      result[key] = sortObject(value[key]);
    }
    return result;
  }, {});
}

/* eslint-disable no-use-before-define */

var createStringTreeNode = function createStringTreeNode(value) {
  return {
    type: 'string',
    value: value
  };
};

var createNumberTreeNode = function createNumberTreeNode(value) {
  return {
    type: 'number',
    value: value
  };
};

var createReactElementTreeNode = function createReactElementTreeNode(displayName, props, defaultProps, childrens) {
  return {
    type: 'ReactElement',
    displayName: displayName,
    props: props,
    defaultProps: defaultProps,
    childrens: childrens
  };
};

var createReactFragmentTreeNode = function createReactFragmentTreeNode(key, childrens) {
  return {
    type: 'ReactFragment',
    key: key,
    childrens: childrens
  };
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var supportFragment = Boolean(Fragment);

var getReactElementDisplayName = function getReactElementDisplayName(element) {
  return element.type.displayName || element.type.name || ( // function name
  typeof element.type === 'function' // function without a name, you should provide one
  ? 'No Display Name' : element.type);
};

var noChildren = function noChildren(propsValue, propName) {
  return propName !== 'children';
};

var onlyMeaningfulChildren = function onlyMeaningfulChildren(children) {
  return children !== true && children !== false && children !== null && children !== '';
};

var filterProps = function filterProps(originalProps, cb) {
  var filteredProps = {};

  Object.keys(originalProps).filter(function (key) {
    return cb(originalProps[key], key);
  }).forEach(function (key) {
    return filteredProps[key] = originalProps[key];
  });

  return filteredProps;
};

var parseReactElement = function parseReactElement(element, options) {
  var _options$displayName = options.displayName,
      displayNameFn = _options$displayName === undefined ? getReactElementDisplayName : _options$displayName;


  if (typeof element === 'string') {
    return createStringTreeNode(element);
  } else if (typeof element === 'number') {
    return createNumberTreeNode(element);
  } else if (!React.isValidElement(element)) {
    throw new Error('react-element-to-jsx-string: Expected a React.Element, got `' + (typeof element === 'undefined' ? 'undefined' : _typeof$1(element)) + '`');
  }

  var displayName = displayNameFn(element);

  var props = filterProps(element.props, noChildren);
  if (element.ref !== null) {
    props.ref = element.ref;
  }

  var key = element.key;
  if (typeof key === 'string' && key.search(/^\./)) {
    // React automatically add key=".X" when there are some children
    props.key = key;
  }

  var defaultProps = filterProps(element.type.defaultProps || {}, noChildren);
  var childrens = React.Children.toArray(element.props.children).filter(onlyMeaningfulChildren).map(function (child) {
    return parseReactElement(child, options);
  });

  if (supportFragment && element.type === Fragment) {
    return createReactFragmentTreeNode(key, childrens);
  }

  return createReactElementTreeNode(displayName, props, defaultProps, childrens);
};

function noRefCheck() {}

var inlineFunction = function inlineFunction(fn) {
  return fn.toString().split('\n').map(function (line) {
    return line.trim();
  }).join('');
};

var preserveFunctionLineBreak = function preserveFunctionLineBreak(fn) {
  return fn.toString();
};

var defaultFunctionValue = inlineFunction;

var formatFunction = (function (fn, options) {
  var _options$functionValu = options.functionValue,
      functionValue = _options$functionValu === undefined ? defaultFunctionValue : _options$functionValu,
      showFunctions = options.showFunctions;

  if (!showFunctions && functionValue === defaultFunctionValue) {
    return functionValue(noRefCheck);
  }

  return functionValue(fn);
});

var formatComplexDataStructure = (function (value, inline, lvl, options) {
  var normalizedValue = sortObject(value);

  var stringifiedValue = dist_1(normalizedValue, {
    transform: function transform(currentObj, prop, originalResult) {
      var currentValue = currentObj[prop];

      if (currentValue && isValidElement(currentValue)) {
        return formatTreeNode(parseReactElement(currentValue, options), true, lvl, options);
      }

      if (typeof currentValue === 'function') {
        return formatFunction(currentValue, options);
      }

      return originalResult;
    }
  });

  if (inline) {
    return stringifiedValue.replace(/\s+/g, ' ').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\[ /g, '[').replace(/ ]/g, ']');
  }

  // Replace tabs with spaces, and add necessary indentation in front of each new line
  return stringifiedValue.replace(/\t/g, spacer(1, options.tabStop)).replace(/\n([^$])/g, '\n' + spacer(lvl + 1, options.tabStop) + '$1');
});

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var escape = function escape(s) {
  return s.replace(/"/g, '&quot;');
};

var formatPropValue = function formatPropValue(propValue, inline, lvl, options) {
  if (typeof propValue === 'number') {
    return '{' + String(propValue) + '}';
  }

  if (typeof propValue === 'string') {
    return '"' + escape(propValue) + '"';
  }

  // > "Symbols (new in ECMAScript 2015, not yet supported in Flow)"
  // @see: https://flow.org/en/docs/types/primitives/
  // $FlowFixMe: Flow does not support Symbol
  if ((typeof propValue === 'undefined' ? 'undefined' : _typeof$2(propValue)) === 'symbol') {
    var symbolDescription = propValue.valueOf().toString().replace(/Symbol\((.*)\)/, '$1');

    if (!symbolDescription) {
      return '{Symbol()}';
    }

    return '{Symbol(\'' + symbolDescription + '\')}';
  }

  if (typeof propValue === 'function') {
    return '{' + formatFunction(propValue, options) + '}';
  }

  if (isValidElement(propValue)) {
    return '{' + formatTreeNode(parseReactElement(propValue, options), true, lvl, options) + '}';
  }

  if (propValue instanceof Date) {
    return '{new Date("' + propValue.toISOString() + '")}';
  }

  if (isPlainObject(propValue) || Array.isArray(propValue)) {
    return '{' + formatComplexDataStructure(propValue, inline, lvl, options) + '}';
  }

  return '{' + String(propValue) + '}';
};

var formatProp = (function (name, hasValue, value, hasDefaultValue, defaultValue, inline, lvl, options) {
  if (!hasValue && !hasDefaultValue) {
    throw new Error('The prop "' + name + '" has no value and no default: could not be formatted');
  }

  var usedValue = hasValue ? value : defaultValue;

  var useBooleanShorthandSyntax = options.useBooleanShorthandSyntax,
      tabStop = options.tabStop;


  var formattedPropValue = formatPropValue(usedValue, inline, lvl, options);

  var attributeFormattedInline = ' ';
  var attributeFormattedMultiline = '\n' + spacer(lvl + 1, tabStop);
  var isMultilineAttribute = formattedPropValue.includes('\n');

  if (useBooleanShorthandSyntax && formattedPropValue === '{false}' && !hasDefaultValue) {
    // If a boolean is false and not different from it's default, we do not render the attribute
    attributeFormattedInline = '';
    attributeFormattedMultiline = '';
  } else if (useBooleanShorthandSyntax && formattedPropValue === '{true}') {
    attributeFormattedInline += '' + name;
    attributeFormattedMultiline += '' + name;
  } else {
    attributeFormattedInline += name + '=' + formattedPropValue;
    attributeFormattedMultiline += name + '=' + formattedPropValue;
  }

  return {
    attributeFormattedInline: attributeFormattedInline,
    attributeFormattedMultiline: attributeFormattedMultiline,
    isMultilineAttribute: isMultilineAttribute
  };
});

var mergeSiblingPlainStringChildrenReducer = (function (previousNodes, currentNode) {
  var nodes = previousNodes.slice(0, previousNodes.length > 0 ? previousNodes.length - 1 : 0);
  var previousNode = previousNodes[previousNodes.length - 1];

  if (previousNode && (currentNode.type === 'string' || currentNode.type === 'number') && (previousNode.type === 'string' || previousNode.type === 'number')) {
    nodes.push(createStringTreeNode(String(previousNode.value) + String(currentNode.value)));
  } else {
    if (previousNode) {
      nodes.push(previousNode);
    }

    nodes.push(currentNode);
  }

  return nodes;
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isKeyOrRefProps = function isKeyOrRefProps(propName) {
  return ['key', 'ref'].includes(propName);
};

var sortPropsByNames = (function (shouldSortUserProps) {
  return function (props) {
    var haveKeyProp = props.includes('key');
    var haveRefProp = props.includes('ref');

    var userPropsOnly = props.filter(function (oneProp) {
      return !isKeyOrRefProps(oneProp);
    });

    var sortedProps = shouldSortUserProps ? [].concat(_toConsumableArray(userPropsOnly.sort())) // We use basic lexical order
    : [].concat(_toConsumableArray(userPropsOnly));

    if (haveRefProp) {
      sortedProps.unshift('ref');
    }

    if (haveKeyProp) {
      sortedProps.unshift('key');
    }

    return sortedProps;
  };
});

var compensateMultilineStringElementIndentation = function compensateMultilineStringElementIndentation(element, formattedElement, inline, lvl, options) {
  var tabStop = options.tabStop;


  if (element.type === 'string') {
    return formattedElement.split('\n').map(function (line, offset) {
      if (offset === 0) {
        return line;
      }

      return '' + spacer(lvl, tabStop) + line;
    }).join('\n');
  }

  return formattedElement;
};

var formatOneChildren = function formatOneChildren(inline, lvl, options) {
  return function (element) {
    return compensateMultilineStringElementIndentation(element, formatTreeNode(element, inline, lvl, options), inline, lvl, options);
  };
};

var onlyPropsWithOriginalValue = function onlyPropsWithOriginalValue(defaultProps, props) {
  return function (propName) {
    var haveDefaultValue = Object.keys(defaultProps).includes(propName);
    return !haveDefaultValue || haveDefaultValue && defaultProps[propName] !== props[propName];
  };
};

var isInlineAttributeTooLong = function isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) {
  if (!maxInlineAttributesLineLength) {
    return attributes.length > 1;
  }

  return spacer(lvl, tabStop).length + inlineAttributeString.length > maxInlineAttributesLineLength;
};

var shouldRenderMultilineAttr = function shouldRenderMultilineAttr(attributes, inlineAttributeString, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength) {
  return (isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) || containsMultilineAttr) && !inline;
};

var formatReactElementNode = (function (node, inline, lvl, options) {
  var type = node.type,
      _node$displayName = node.displayName,
      displayName = _node$displayName === undefined ? '' : _node$displayName,
      childrens = node.childrens,
      _node$props = node.props,
      props = _node$props === undefined ? {} : _node$props,
      _node$defaultProps = node.defaultProps,
      defaultProps = _node$defaultProps === undefined ? {} : _node$defaultProps;


  if (type !== 'ReactElement') {
    throw new Error('The "formatReactElementNode" function could only format node of type "ReactElement". Given:  ' + type);
  }

  var filterProps = options.filterProps,
      maxInlineAttributesLineLength = options.maxInlineAttributesLineLength,
      showDefaultProps = options.showDefaultProps,
      sortProps = options.sortProps,
      tabStop = options.tabStop;


  var out = '<' + displayName;

  var outInlineAttr = out;
  var outMultilineAttr = out;
  var containsMultilineAttr = false;

  var visibleAttributeNames = [];

  Object.keys(props).filter(function (propName) {
    return filterProps.indexOf(propName) === -1;
  }).filter(onlyPropsWithOriginalValue(defaultProps, props)).forEach(function (propName) {
    return visibleAttributeNames.push(propName);
  });

  Object.keys(defaultProps).filter(function (defaultPropName) {
    return filterProps.indexOf(defaultPropName) === -1;
  }).filter(function () {
    return showDefaultProps;
  }).filter(function (defaultPropName) {
    return !visibleAttributeNames.includes(defaultPropName);
  }).forEach(function (defaultPropName) {
    return visibleAttributeNames.push(defaultPropName);
  });

  var attributes = sortPropsByNames(sortProps)(visibleAttributeNames);

  attributes.forEach(function (attributeName) {
    var _formatProp = formatProp(attributeName, Object.keys(props).includes(attributeName), props[attributeName], Object.keys(defaultProps).includes(attributeName), defaultProps[attributeName], inline, lvl, options),
        attributeFormattedInline = _formatProp.attributeFormattedInline,
        attributeFormattedMultiline = _formatProp.attributeFormattedMultiline,
        isMultilineAttribute = _formatProp.isMultilineAttribute;

    if (isMultilineAttribute) {
      containsMultilineAttr = true;
    }

    outInlineAttr += attributeFormattedInline;
    outMultilineAttr += attributeFormattedMultiline;
  });

  outMultilineAttr += '\n' + spacer(lvl, tabStop);

  if (shouldRenderMultilineAttr(attributes, outInlineAttr, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength)) {
    out = outMultilineAttr;
  } else {
    out = outInlineAttr;
  }

  if (childrens && childrens.length > 0) {
    var newLvl = lvl + 1;

    out += '>';

    if (!inline) {
      out += '\n';
      out += spacer(newLvl, tabStop);
    }

    out += childrens.reduce(mergeSiblingPlainStringChildrenReducer, []).map(formatOneChildren(inline, newLvl, options)).join(!inline ? '\n' + spacer(newLvl, tabStop) : '');

    if (!inline) {
      out += '\n';
      out += spacer(newLvl - 1, tabStop);
    }
    out += '</' + displayName + '>';
  } else {
    if (!isInlineAttributeTooLong(attributes, outInlineAttr, lvl, tabStop, maxInlineAttributesLineLength)) {
      out += ' ';
    }

    out += '/>';
  }

  return out;
});

var REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX = '';
var REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX = 'React.Fragment';

var toReactElementTreeNode = function toReactElementTreeNode(displayName, key, childrens) {
  var props = {};
  if (key) {
    props = { key: key };
  }

  return {
    type: 'ReactElement',
    displayName: displayName,
    props: props,
    defaultProps: {},
    childrens: childrens
  };
};

var isKeyedFragment = function isKeyedFragment(_ref) {
  var key = _ref.key;
  return Boolean(key);
};
var hasNoChildren = function hasNoChildren(_ref2) {
  var childrens = _ref2.childrens;
  return childrens.length === 0;
};

var formatReactFragmentNode = (function (node, inline, lvl, options) {
  var type = node.type,
      key = node.key,
      childrens = node.childrens;


  if (type !== 'ReactFragment') {
    throw new Error('The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: ' + type);
  }

  var useFragmentShortSyntax = options.useFragmentShortSyntax;


  var displayName = void 0;
  if (useFragmentShortSyntax) {
    if (hasNoChildren(node) || isKeyedFragment(node)) {
      displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
    } else {
      displayName = REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX;
    }
  } else {
    displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
  }

  return formatReactElementNode(toReactElementTreeNode(displayName, key, childrens), inline, lvl, options);
});

var jsxStopChars = ['<', '>', '{', '}'];
var shouldBeEscaped = function shouldBeEscaped(s) {
  return jsxStopChars.some(function (jsxStopChar) {
    return s.includes(jsxStopChar);
  });
};

var escape$1 = function escape(s) {
  if (!shouldBeEscaped(s)) {
    return s;
  }

  return '{`' + s + '`}';
};

var preserveTrailingSpace = function preserveTrailingSpace(s) {
  var result = s;
  if (result.endsWith(' ')) {
    result = result.replace(/^(\S*)(\s*)$/, "$1{'$2'}");
  }

  if (result.startsWith(' ')) {
    result = result.replace(/^(\s*)(\S*)$/, "{'$1'}$2");
  }

  return result;
};

var formatTreeNode = (function (node, inline, lvl, options) {
  if (node.type === 'number') {
    return String(node.value);
  }

  if (node.type === 'string') {
    return node.value ? '' + preserveTrailingSpace(escape$1(String(node.value))) : '';
  }

  if (node.type === 'ReactElement') {
    return formatReactElementNode(node, inline, lvl, options);
  }

  if (node.type === 'ReactFragment') {
    return formatReactFragmentNode(node, inline, lvl, options);
  }

  throw new TypeError('Unknow format type "' + node.type + '"');
});

var formatTree = (function (node, options) {
  return formatTreeNode(node, false, 0, options);
});

var reactElementToJsxString = function reactElementToJsxString(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$filterProps = _ref.filterProps,
      filterProps = _ref$filterProps === undefined ? [] : _ref$filterProps,
      _ref$showDefaultProps = _ref.showDefaultProps,
      showDefaultProps = _ref$showDefaultProps === undefined ? true : _ref$showDefaultProps,
      _ref$showFunctions = _ref.showFunctions,
      showFunctions = _ref$showFunctions === undefined ? false : _ref$showFunctions,
      functionValue = _ref.functionValue,
      _ref$tabStop = _ref.tabStop,
      tabStop = _ref$tabStop === undefined ? 2 : _ref$tabStop,
      _ref$useBooleanShorth = _ref.useBooleanShorthandSyntax,
      useBooleanShorthandSyntax = _ref$useBooleanShorth === undefined ? true : _ref$useBooleanShorth,
      _ref$useFragmentShort = _ref.useFragmentShortSyntax,
      useFragmentShortSyntax = _ref$useFragmentShort === undefined ? true : _ref$useFragmentShort,
      _ref$sortProps = _ref.sortProps,
      sortProps = _ref$sortProps === undefined ? true : _ref$sortProps,
      maxInlineAttributesLineLength = _ref.maxInlineAttributesLineLength,
      displayName = _ref.displayName;

  if (!element) {
    throw new Error('react-element-to-jsx-string: Expected a ReactElement');
  }

  var options = {
    filterProps: filterProps,
    showDefaultProps: showDefaultProps,
    showFunctions: showFunctions,
    functionValue: functionValue,
    tabStop: tabStop,
    useBooleanShorthandSyntax: useBooleanShorthandSyntax,
    useFragmentShortSyntax: useFragmentShortSyntax,
    sortProps: sortProps,
    maxInlineAttributesLineLength: maxInlineAttributesLineLength,
    displayName: displayName
  };

  return formatTree(parseReactElement(element, options), options);
};

export default reactElementToJsxString;
export { inlineFunction, preserveFunctionLineBreak };
//# sourceMappingURL=index.js.map
