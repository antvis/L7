"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodesToString = nodesToString;
exports.Trans = Trans;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireWildcard(require("react"));

var _htmlParseStringify = _interopRequireDefault(require("html-parse-stringify2"));

var _context = require("./context");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function hasChildren(node) {
  return node && (node.children || node.props && node.props.children);
}

function getChildren(node) {
  if (!node) return [];
  return node && node.children ? node.children : node.props && node.props.children;
}

function hasValidReactChildren(children) {
  if (Object.prototype.toString.call(children) !== '[object Array]') return false;
  return children.every(function (child) {
    return _react["default"].isValidElement(child);
  });
}

function getAsArray(data) {
  return Array.isArray(data) ? data : [data];
}

function nodesToString(startingString, children, index, i18nOptions) {
  if (!children) return '';
  var stringNode = startingString;
  var childrenArray = getAsArray(children);
  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  childrenArray.forEach(function (child, i) {
    var elementKey = "".concat(i);

    if (typeof child === 'string') {
      stringNode = "".concat(stringNode).concat(child);
    } else if (hasChildren(child)) {
      var elementTag = keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 1 && typeof hasChildren(child) === 'string' ? child.type : elementKey;

      if (child.props && child.props.i18nIsDynamicList) {
        // we got a dynamic list like "<ul>{['a', 'b'].map(item => ( <li key={item}>{item}</li> ))}</ul>""
        // the result should be "<0></0>" and not "<0><0>a</0><1>b</1></0>"
        stringNode = "".concat(stringNode, "<").concat(elementTag, "></").concat(elementTag, ">");
      } else {
        // regular case mapping the inner children
        stringNode = "".concat(stringNode, "<").concat(elementTag, ">").concat(nodesToString('', getChildren(child), i + 1, i18nOptions), "</").concat(elementTag, ">");
      }
    } else if (_react["default"].isValidElement(child)) {
      if (keepArray.indexOf(child.type) > -1 && Object.keys(child.props).length === 0) {
        stringNode = "".concat(stringNode, "<").concat(child.type, "/>");
      } else {
        stringNode = "".concat(stringNode, "<").concat(elementKey, "></").concat(elementKey, ">");
      }
    } else if ((0, _typeof2["default"])(child) === 'object') {
      var clone = _objectSpread({}, child);

      var format = clone.format;
      delete clone.format;
      var keys = Object.keys(clone);

      if (format && keys.length === 1) {
        stringNode = "".concat(stringNode, "{{").concat(keys[0], ", ").concat(format, "}}");
      } else if (keys.length === 1) {
        stringNode = "".concat(stringNode, "{{").concat(keys[0], "}}");
      } else {
        // not a valid interpolation object (can only contain one value plus format)
        (0, _utils.warn)("react-i18next: the passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.", child);
      }
    } else {
      (0, _utils.warn)("Trans: the passed in value is invalid - seems you passed in a variable like {number} - please pass in variables for interpolation as full objects like {{number}}.", child);
    }
  });
  return stringNode;
}

function renderNodes(children, targetString, i18n, i18nOptions, combinedTOpts) {
  if (targetString === '') return []; // check if contains tags we need to replace from html string to react nodes

  var keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  var emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.join('|')).test(targetString); // no need to replace tags in the targetstring

  if (!children && !emptyChildrenButNeedsHandling) return [targetString]; // v2 -> interpolates upfront no need for "some <0>{{var}}</0>"" -> will be just "some {{var}}" in translation file

  var data = {};

  function getData(childs) {
    var childrenArray = getAsArray(childs);
    childrenArray.forEach(function (child) {
      if (typeof child === 'string') return;
      if (hasChildren(child)) getData(getChildren(child));else if ((0, _typeof2["default"])(child) === 'object' && !_react["default"].isValidElement(child)) Object.assign(data, child);
    });
  }

  getData(children);
  var interpolatedString = i18n.services.interpolator.interpolate(targetString, _objectSpread({}, data, {}, combinedTOpts), i18n.language); // parse ast from string with additional wrapper tag
  // -> avoids issues in parser removing prepending text nodes

  var ast = _htmlParseStringify["default"].parse("<0>".concat(interpolatedString, "</0>"));

  function mapAST(reactNode, astNode) {
    var reactNodes = getAsArray(reactNode);
    var astNodes = getAsArray(astNode);
    return astNodes.reduce(function (mem, node, i) {
      var translationContent = node.children && node.children[0] && node.children[0].content;

      if (node.type === 'tag') {
        var child = reactNodes[parseInt(node.name, 10)] || {};

        var isElement = _react["default"].isValidElement(child);

        if (typeof child === 'string') {
          mem.push(child);
        } else if (hasChildren(child)) {
          var childs = getChildren(child);
          var mappedChildren = mapAST(childs, node.children);
          var inner = hasValidReactChildren(childs) && mappedChildren.length === 0 ? childs : mappedChildren;
          if (child.dummy) child.children = inner; // needed on preact!

          mem.push(_react["default"].cloneElement(child, _objectSpread({}, child.props, {
            key: i
          }), inner));
        } else if (emptyChildrenButNeedsHandling && (0, _typeof2["default"])(child) === 'object' && child.dummy && !isElement) {
          // we have a empty Trans node (the dummy element) with a targetstring that contains html tags needing
          // conversion to react nodes
          // so we just need to map the inner stuff
          var _inner = mapAST(reactNodes
          /* wrong but we need something */
          , node.children);

          mem.push(_react["default"].cloneElement(child, _objectSpread({}, child.props, {
            key: i
          }), _inner));
        } else if (Number.isNaN(parseFloat(node.name))) {
          if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
            if (node.voidElement) {
              mem.push(_react["default"].createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }));
            } else {
              var _inner2 = mapAST(reactNodes
              /* wrong but we need something */
              , node.children);

              mem.push(_react["default"].createElement(node.name, {
                key: "".concat(node.name, "-").concat(i)
              }, _inner2));
            }
          } else if (node.voidElement) {
            mem.push("<".concat(node.name, " />"));
          } else {
            var _inner3 = mapAST(reactNodes
            /* wrong but we need something */
            , node.children);

            mem.push("<".concat(node.name, ">").concat(_inner3, "</").concat(node.name, ">"));
          }
        } else if ((0, _typeof2["default"])(child) === 'object' && !isElement) {
          var content = node.children[0] ? translationContent : null; // v1
          // as interpolation was done already we just have a regular content node
          // in the translation AST while having an object in reactNodes
          // -> push the content no need to interpolate again

          if (content) mem.push(content);
        } else if (node.children.length === 1 && translationContent) {
          // If component does not have children, but translation - has
          // with this in component could be components={[<span class='make-beautiful'/>]} and in translation - 'some text <0>some highlighted message</0>'
          mem.push(_react["default"].cloneElement(child, _objectSpread({}, child.props, {
            key: i
          }), translationContent));
        } else {
          mem.push(_react["default"].cloneElement(child, _objectSpread({}, child.props, {
            key: i
          })));
        }
      } else if (node.type === 'text') {
        mem.push(node.content);
      }

      return mem;
    }, []);
  } // call mapAST with having react nodes nested into additional node like
  // we did for the string ast from translation
  // return the children of that extra node to get expected result


  var result = mapAST([{
    dummy: true,
    children: children
  }], ast);
  return getChildren(result[0]);
}

function Trans(_ref) {
  var children = _ref.children,
      count = _ref.count,
      parent = _ref.parent,
      i18nKey = _ref.i18nKey,
      tOptions = _ref.tOptions,
      values = _ref.values,
      defaults = _ref.defaults,
      components = _ref.components,
      ns = _ref.ns,
      i18nFromProps = _ref.i18n,
      tFromProps = _ref.t,
      additionalProps = (0, _objectWithoutProperties2["default"])(_ref, ["children", "count", "parent", "i18nKey", "tOptions", "values", "defaults", "components", "ns", "i18n", "t"]);

  var _ref2 = (0, _context.getHasUsedI18nextProvider)() ? (0, _react.useContext)(_context.I18nContext) || {} : {},
      i18nFromContext = _ref2.i18n,
      defaultNSFromContext = _ref2.defaultNS;

  var i18n = i18nFromProps || i18nFromContext || (0, _context.getI18n)();

  if (!i18n) {
    (0, _utils.warnOnce)('You will need pass in an i18next instance by using i18nextReactModule');
    return children;
  }

  var t = tFromProps || i18n.t.bind(i18n) || function (k) {
    return k;
  };

  var reactI18nextOptions = _objectSpread({}, (0, _context.getDefaults)(), {}, i18n.options && i18n.options.react);

  var useAsParent = parent !== undefined ? parent : reactI18nextOptions.defaultTransParent; // prepare having a namespace

  var namespaces = ns || t.ns || defaultNSFromContext || i18n.options && i18n.options.defaultNS;
  namespaces = typeof namespaces === 'string' ? [namespaces] : namespaces || ['translation'];
  var defaultValue = defaults || nodesToString('', children, 0, reactI18nextOptions) || reactI18nextOptions.transEmptyNodeValue;
  var hashTransKey = reactI18nextOptions.hashTransKey;
  var key = i18nKey || (hashTransKey ? hashTransKey(defaultValue) : defaultValue);
  var interpolationOverride = values ? {} : {
    interpolation: {
      prefix: '#$?',
      suffix: '?$#'
    }
  };

  var combinedTOpts = _objectSpread({}, tOptions, {
    count: count
  }, values, {}, interpolationOverride, {
    defaultValue: defaultValue,
    ns: namespaces
  });

  var translation = key ? t(key, combinedTOpts) : defaultValue;
  if (!useAsParent) return renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts);
  return _react["default"].createElement(useAsParent, additionalProps, renderNodes(components || children, translation, i18n, reactI18nextOptions, combinedTOpts));
}