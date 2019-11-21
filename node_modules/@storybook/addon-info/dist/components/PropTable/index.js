"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PropTable;
exports.multiLineText = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _PrettyPropType = _interopRequireDefault(require("../types/PrettyPropType"));

var _PropVal = _interopRequireDefault(require("../PropVal"));

var _Table = _interopRequireDefault(require("./components/Table"));

var _Tbody = _interopRequireDefault(require("./components/Tbody"));

var _Td = _interopRequireDefault(require("./components/Td"));

var _Th = _interopRequireDefault(require("./components/Th"));

var _Thead = _interopRequireDefault(require("./components/Thead"));

var _Tr = _interopRequireDefault(require("./components/Tr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var multiLineText = function multiLineText(input) {
  if (!input) {
    return input;
  }

  var text = String(input);
  var arrayOfText = text.split(/\r?\n|\r/g);
  var isSingleLine = arrayOfText.length < 2;
  return isSingleLine ? text : arrayOfText.map(function (lineOfText, i) {
    return (// eslint-disable-next-line react/no-array-index-key
      _react["default"].createElement("span", {
        key: "".concat(lineOfText, ".").concat(i)
      }, i > 0 && _react["default"].createElement("br", null), " ", lineOfText)
    );
  });
};

exports.multiLineText = multiLineText;

var determineIncludedPropTypes = function determineIncludedPropTypes(propDefinitions, excludedPropTypes) {
  if (excludedPropTypes.length === 0) {
    return propDefinitions;
  }

  return propDefinitions.filter(function (propDefinition) {
    return !excludedPropTypes.includes(propDefinition.property);
  });
};

function PropTable(props) {
  var type = props.type,
      maxPropObjectKeys = props.maxPropObjectKeys,
      maxPropArrayLength = props.maxPropArrayLength,
      maxPropStringLength = props.maxPropStringLength,
      propDefinitions = props.propDefinitions,
      excludedPropTypes = props.excludedPropTypes;

  if (!type) {
    return null;
  }

  var includedPropDefinitions = determineIncludedPropTypes(propDefinitions, excludedPropTypes);

  if (!includedPropDefinitions.length) {
    return _react["default"].createElement("small", null, "No propTypes defined!");
  }

  var propValProps = {
    maxPropObjectKeys: maxPropObjectKeys,
    maxPropArrayLength: maxPropArrayLength,
    maxPropStringLength: maxPropStringLength
  };
  return _react["default"].createElement(_Table["default"], null, _react["default"].createElement(_Thead["default"], null, _react["default"].createElement(_Tr["default"], null, _react["default"].createElement(_Th["default"], null, "property"), _react["default"].createElement(_Th["default"], null, "propType"), _react["default"].createElement(_Th["default"], null, "required"), _react["default"].createElement(_Th["default"], null, "default"), _react["default"].createElement(_Th["default"], null, "description"))), _react["default"].createElement(_Tbody["default"], null, includedPropDefinitions.map(function (row) {
    return _react["default"].createElement(_Tr["default"], {
      key: row.property
    }, _react["default"].createElement(_Td["default"], {
      isMonospace: true
    }, row.property), _react["default"].createElement(_Td["default"], {
      isMonospace: true
    }, _react["default"].createElement(_PrettyPropType["default"], {
      propType: row.propType
    })), _react["default"].createElement(_Td["default"], null, row.required ? 'yes' : '-'), _react["default"].createElement(_Td["default"], null, row.defaultValue === undefined ? '-' : _react["default"].createElement(_PropVal["default"], _extends({
      val: row.defaultValue
    }, propValProps, {
      valueStyles: {}
    }))), _react["default"].createElement(_Td["default"], null, multiLineText(row.description)));
  })));
}

PropTable.displayName = 'PropTable';
PropTable.defaultProps = {
  type: null,
  propDefinitions: [],
  excludedPropTypes: []
};
PropTable.propTypes = {
  type: _propTypes["default"].func,
  maxPropObjectKeys: _propTypes["default"].number.isRequired,
  maxPropArrayLength: _propTypes["default"].number.isRequired,
  maxPropStringLength: _propTypes["default"].number.isRequired,
  excludedPropTypes: _propTypes["default"].arrayOf(_propTypes["default"].string),
  propDefinitions: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    property: _propTypes["default"].string.isRequired,
    propType: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].string]),
    required: _propTypes["default"].bool,
    description: _propTypes["default"].string,
    defaultValue: _propTypes["default"].any
  }))
};