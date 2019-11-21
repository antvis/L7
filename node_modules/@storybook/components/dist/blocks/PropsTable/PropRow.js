"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropRow = exports.PrettyPropVal = exports.PrettyPropType = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _polished = require("polished");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PropType;

(function (PropType) {
  PropType["SHAPE"] = "shape";
  PropType["UNION"] = "union";
  PropType["ARRAYOF"] = "arrayOf";
  PropType["OBJECTOF"] = "objectOf";
  PropType["ENUM"] = "enum";
  PropType["INSTANCEOF"] = "instanceOf";
})(PropType || (PropType = {}));

var Name = _theming.styled.span({
  fontWeight: 'bold'
});

var Required = _theming.styled.span(function (_ref) {
  var theme = _ref.theme;
  return {
    color: theme.color.negative,
    fontFamily: theme.typography.fonts.mono,
    cursor: 'help'
  };
});

var StyledPropDef = _theming.styled.div(function (_ref2) {
  var theme = _ref2.theme;
  return {
    color: theme.base === 'light' ? (0, _polished.transparentize)(0.4, theme.color.defaultText) : (0, _polished.transparentize)(0.6, theme.color.defaultText),
    fontFamily: theme.typography.fonts.mono,
    fontSize: "".concat(theme.typography.size.code, "%")
  };
});

var prettyPrint = function prettyPrint(type) {
  if (!type || !type.name) {
    return '';
  }

  var fields = '';

  switch (type.name) {
    case PropType.SHAPE:
      fields = Object.keys(type.value).map(function (key) {
        return "".concat(key, ": ").concat(prettyPrint(type.value[key]));
      }).join(', ');
      return "{ ".concat(fields, " }");

    case PropType.UNION:
      return Array.isArray(type.value) ? "Union<".concat(type.value.map(prettyPrint).join(' | '), ">") : JSON.stringify(type.value);

    case PropType.ARRAYOF:
      return "[ ".concat(prettyPrint(type.value), " ]");

    case PropType.OBJECTOF:
      return "objectOf(".concat(prettyPrint(type.value), ")");

    case PropType.ENUM:
      if (type.computed) {
        return JSON.stringify(type);
      }

      return Array.isArray(type.value) ? type.value.map(function (v) {
        return v && v.value && v.value.toString();
      }).join(' | ') : JSON.stringify(type);

    case PropType.INSTANCEOF:
      return "instanceOf(".concat(JSON.stringify(type.value), ")");

    default:
      return type.name;
  }
};

var PrettyPropType = function PrettyPropType(_ref3) {
  var type = _ref3.type;
  return _react["default"].createElement("span", null, prettyPrint(type));
};

exports.PrettyPropType = PrettyPropType;
PrettyPropType.displayName = "PrettyPropType";

var PrettyPropVal = function PrettyPropVal(_ref4) {
  var value = _ref4.value;
  return _react["default"].createElement("span", null, JSON.stringify(value));
};

exports.PrettyPropVal = PrettyPropVal;
PrettyPropVal.displayName = "PrettyPropVal";

var _ref6 =
/*#__PURE__*/
_react["default"].createElement(Required, {
  title: "Required"
}, "*");

var PropRow = function PropRow(_ref5) {
  var _ref5$row = _ref5.row,
      name = _ref5$row.name,
      type = _ref5$row.type,
      required = _ref5$row.required,
      description = _ref5$row.description,
      defaultValue = _ref5$row.defaultValue;
  return _react["default"].createElement("tr", null, _react["default"].createElement("td", null, _react["default"].createElement(Name, null, name), required ? _ref6 : null), _react["default"].createElement("td", null, _react["default"].createElement("div", null, description), _react["default"].createElement(StyledPropDef, null, _react["default"].createElement(PrettyPropType, {
    type: type
  }))), _react["default"].createElement("td", null, defaultValue === undefined ? '-' : _react["default"].createElement(PrettyPropVal, {
    value: defaultValue
  })));
};

exports.PropRow = PropRow;
PropRow.displayName = "PropRow";