"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactAddonsCreateFragment = _interopRequireDefault(require("react-addons-create-fragment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getValueStyles = function getValueStyles() {
  var codeColors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    func: {
      color: codeColors.func || '#170'
    },
    attr: {
      color: codeColors.attr || '#666'
    },
    object: {
      color: codeColors.object || '#666'
    },
    array: {
      color: codeColors.array || '#666'
    },
    number: {
      color: codeColors.number || '#a11'
    },
    string: {
      color: codeColors.string || '#22a',
      wordBreak: 'break-word'
    },
    bool: {
      color: codeColors.bool || '#a11'
    },
    empty: {
      color: '#444'
    }
  };
};

function indent(breakIntoNewLines, level, isBlock) {
  return breakIntoNewLines && _react["default"].createElement("span", null, _react["default"].createElement("br", null), "".concat(Array(level).join('  '), "  "), !isBlock && '  ');
}

function PreviewArray(_ref) {
  var val = _ref.val,
      level = _ref.level,
      maxPropArrayLength = _ref.maxPropArrayLength,
      maxPropStringLength = _ref.maxPropStringLength,
      maxPropsIntoLine = _ref.maxPropsIntoLine,
      valueStyles = _ref.valueStyles;
  var items = {};
  var breakIntoNewLines = val.length > maxPropsIntoLine;
  val.slice(0, maxPropArrayLength).forEach(function (item, i) {
    items["n".concat(i)] = _react["default"].createElement("span", null, indent(breakIntoNewLines, level), _react["default"].createElement(PropVal, {
      val: item,
      level: level + 1,
      valueStyles: valueStyles,
      maxPropStringLength: maxPropStringLength,
      maxPropsIntoLine: maxPropsIntoLine
    }));
    items["c".concat(i)] = ',';
  });

  if (val.length > maxPropArrayLength) {
    items.last = _react["default"].createElement("span", null, indent(breakIntoNewLines, level), '…');
  } else {
    delete items["c".concat(val.length - 1)];
  }

  return _react["default"].createElement("span", {
    style: valueStyles.array
  }, "[", (0, _reactAddonsCreateFragment["default"])(items), indent(breakIntoNewLines, level, true), "]");
}

PreviewArray.propTypes = {
  val: _propTypes["default"].any,
  // eslint-disable-line
  maxPropArrayLength: _propTypes["default"].number.isRequired,
  maxPropStringLength: _propTypes["default"].number.isRequired,
  maxPropsIntoLine: _propTypes["default"].number.isRequired,
  level: _propTypes["default"].number.isRequired,
  valueStyles: _propTypes["default"].shape({
    func: _propTypes["default"].object,
    attr: _propTypes["default"].object,
    object: _propTypes["default"].object,
    array: _propTypes["default"].object,
    number: _propTypes["default"].object,
    string: _propTypes["default"].object,
    bool: _propTypes["default"].object,
    empty: _propTypes["default"].object
  }).isRequired
};

function PreviewObject(_ref2) {
  var val = _ref2.val,
      level = _ref2.level,
      maxPropObjectKeys = _ref2.maxPropObjectKeys,
      maxPropStringLength = _ref2.maxPropStringLength,
      maxPropsIntoLine = _ref2.maxPropsIntoLine,
      valueStyles = _ref2.valueStyles;
  var names = Object.keys(val);
  var items = {};
  var breakIntoNewLines = names.length > maxPropsIntoLine;
  names.slice(0, maxPropObjectKeys).forEach(function (name, i) {
    items["k".concat(i)] = _react["default"].createElement("span", null, indent(breakIntoNewLines, level), _react["default"].createElement("span", {
      style: valueStyles.attr
    }, name));
    items["c".concat(i)] = ': ';
    items["v".concat(i)] = _react["default"].createElement(PropVal, {
      val: val[name],
      level: level + 1,
      valueStyles: valueStyles,
      maxPropStringLength: maxPropStringLength,
      maxPropsIntoLine: maxPropsIntoLine
    });
    items["m".concat(i)] = ',';
  });

  if (names.length > maxPropObjectKeys) {
    items.rest = _react["default"].createElement("span", null, indent(breakIntoNewLines, level), '…');
  } else {
    delete items["m".concat(names.length - 1)];
  }

  return _react["default"].createElement("span", {
    style: valueStyles.object
  }, '{', (0, _reactAddonsCreateFragment["default"])(items), indent(breakIntoNewLines, level, true), '}');
}

PreviewObject.propTypes = {
  val: _propTypes["default"].any,
  // eslint-disable-line
  maxPropObjectKeys: _propTypes["default"].number.isRequired,
  maxPropStringLength: _propTypes["default"].number.isRequired,
  maxPropsIntoLine: _propTypes["default"].number.isRequired,
  level: _propTypes["default"].number.isRequired,
  valueStyles: _propTypes["default"].shape({
    func: _propTypes["default"].object,
    attr: _propTypes["default"].object,
    object: _propTypes["default"].object,
    array: _propTypes["default"].object,
    number: _propTypes["default"].object,
    string: _propTypes["default"].object,
    bool: _propTypes["default"].object,
    empty: _propTypes["default"].object
  }).isRequired
};

function PropVal(props) {
  var level = props.level,
      maxPropObjectKeys = props.maxPropObjectKeys,
      maxPropArrayLength = props.maxPropArrayLength,
      maxPropStringLength = props.maxPropStringLength,
      maxPropsIntoLine = props.maxPropsIntoLine,
      theme = props.theme;
  var val = props.val;

  var _ref3 = theme || {},
      codeColors = _ref3.codeColors;

  var content = null;
  var valueStyles = props.valueStyles || getValueStyles(codeColors);

  if (typeof val === 'number') {
    content = _react["default"].createElement("span", {
      style: valueStyles.number
    }, val);
  } else if (typeof val === 'string') {
    if (val.length > maxPropStringLength) {
      val = "".concat(val.slice(0, maxPropStringLength), "\u2026");
    }

    if (level > 1) {
      val = "'".concat(val, "'");
    }

    content = _react["default"].createElement("span", {
      style: valueStyles.string
    }, val);
  } else if (typeof val === 'boolean') {
    content = _react["default"].createElement("span", {
      style: valueStyles.bool
    }, "".concat(val));
  } else if (Array.isArray(val)) {
    content = _react["default"].createElement(PreviewArray, {
      val: val,
      level: level,
      maxPropArrayLength: maxPropArrayLength,
      maxPropStringLength: maxPropStringLength,
      maxPropsIntoLine: maxPropsIntoLine,
      valueStyles: valueStyles
    });
  } else if (typeof val === 'function') {
    content = _react["default"].createElement("span", {
      style: valueStyles.func
    }, val.name || 'anonymous');
  } else if (!val) {
    content = _react["default"].createElement("span", {
      style: valueStyles.empty
    }, "".concat(val));
  } else if (_typeof(val) !== 'object') {
    content = _react["default"].createElement("span", null, "\u2026");
  } else if (_react["default"].isValidElement(val)) {
    content = _react["default"].createElement("span", {
      style: valueStyles.object
    }, "<".concat(val.type.displayName || val.type.name || val.type, " />"));
  } else {
    content = _react["default"].createElement(PreviewObject, {
      val: val,
      level: level,
      maxPropObjectKeys: maxPropObjectKeys,
      maxPropStringLength: maxPropStringLength,
      maxPropsIntoLine: maxPropsIntoLine,
      valueStyles: valueStyles
    });
  }

  return content;
}

PropVal.defaultProps = {
  val: null,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
  maxPropsIntoLine: 3,
  level: 1,
  theme: {},
  valueStyles: null
};
PropVal.propTypes = {
  val: _propTypes["default"].any,
  // eslint-disable-line
  maxPropObjectKeys: _propTypes["default"].number,
  maxPropArrayLength: _propTypes["default"].number,
  maxPropStringLength: _propTypes["default"].number,
  maxPropsIntoLine: _propTypes["default"].number,
  level: _propTypes["default"].number,
  theme: _propTypes["default"].shape({
    codeColors: _propTypes["default"].object
  }),
  valueStyles: _propTypes["default"].shape({
    func: _propTypes["default"].object,
    attr: _propTypes["default"].object,
    object: _propTypes["default"].object,
    array: _propTypes["default"].object,
    number: _propTypes["default"].object,
    string: _propTypes["default"].object,
    bool: _propTypes["default"].object,
    empty: _propTypes["default"].object
  })
};
var _default = PropVal;
exports["default"] = _default;