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

var _PropVal = _interopRequireDefault(require("./PropVal"));

var _PrettyPropType = _interopRequireDefault(require("./types/PrettyPropType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Table = function Table(props) {
  return _react["default"].createElement("table", props);
};

var Td = function Td(props) {
  return _react["default"].createElement("td", _extends({
    style: {
      paddingRight: 10,
      verticalAlign: 'top'
    }
  }, props));
};

var Tr = function Tr(props) {
  return _react["default"].createElement("tr", props);
};

var Th = function Th(props) {
  return _react["default"].createElement("th", _extends({
    style: {
      textAlign: 'left',
      verticalAlign: 'top'
    }
  }, props));
};

var Tbody = function Tbody(props) {
  return _react["default"].createElement("tbody", props);
};

var Thead = function Thead(props) {
  return _react["default"].createElement("thead", props);
};

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
  return _react["default"].createElement(Table, null, _react["default"].createElement(Thead, null, _react["default"].createElement(Tr, null, _react["default"].createElement(Th, null, "property"), _react["default"].createElement(Th, null, "propType"), _react["default"].createElement(Th, null, "required"), _react["default"].createElement(Th, null, "default"), _react["default"].createElement(Th, null, "description"))), _react["default"].createElement(Tbody, null, includedPropDefinitions.map(function (row) {
    return _react["default"].createElement(Tr, {
      key: row.property
    }, _react["default"].createElement(Td, null, row.property), _react["default"].createElement(Td, null, _react["default"].createElement(_PrettyPropType["default"], {
      propType: row.propType
    })), _react["default"].createElement(Td, null, row.required ? 'yes' : '-'), _react["default"].createElement(Td, null, row.defaultValue === undefined ? '-' : _react["default"].createElement(_PropVal["default"], _extends({
      val: row.defaultValue
    }, propValProps, {
      valueStyles: {}
    }))), _react["default"].createElement(Td, null, multiLineText(row.description)));
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