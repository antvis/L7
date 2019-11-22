"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultLink = exports.DefaultRootTitle = exports.DefaultHead = exports.DefaultLeaf = exports.LeafStyle = exports.DefaultMessage = exports.DefaultFilter = exports.A = exports.DefaultList = exports.DefaultSection = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DefaultSection = _theming.styled.div({});

exports.DefaultSection = DefaultSection;
DefaultSection.displayName = 'DefaultSection';

var DefaultList = _theming.styled.div();

exports.DefaultList = DefaultList;
DefaultList.displayName = 'DefaultList';

var A = _theming.styled.a({});

exports.A = A;
A.displayName = 'A';
var DefaultFilter = (0, _theming.styled)(function (props) {
  return _react["default"].createElement("input", _extends({
    placeholder: "search..."
  }, props));
})({
  width: '100%',
  background: 'transparent',
  border: '1px solid black'
});
exports.DefaultFilter = DefaultFilter;

var DefaultMessage = _theming.styled.div({});

exports.DefaultMessage = DefaultMessage;

var LeafStyle = _theming.styled.div({
  minHeight: 24,
  display: 'flex',
  alignItems: 'center',
  flex: 1
}, function (_ref) {
  var depth = _ref.depth;
  return {
    paddingLeft: depth * 10
  };
}, function (_ref2) {
  var isSelected = _ref2.isSelected;
  return {
    background: isSelected ? '#CFD8DC' : 'transparent'
  };
});

exports.LeafStyle = LeafStyle;

var DefaultLeaf = function DefaultLeaf(_ref3) {
  var name = _ref3.name,
      rest = _objectWithoutProperties(_ref3, ["name"]);

  return _react["default"].createElement(LeafStyle, rest, name);
};

exports.DefaultLeaf = DefaultLeaf;
DefaultLeaf.displayName = "DefaultLeaf";
DefaultLeaf.displayName = 'DefaultLeaf';
DefaultLeaf.propTypes = {
  name: _propTypes["default"].node.isRequired,
  depth: _propTypes["default"].number.isRequired
};

var DefaultHead = function DefaultHead(_ref4) {
  var name = _ref4.name,
      depth = _ref4.depth,
      _ref4$isExpanded = _ref4.isExpanded,
      isExpanded = _ref4$isExpanded === void 0 ? true : _ref4$isExpanded,
      isSelected = _ref4.isSelected,
      isComponent = _ref4.isComponent;
  return _react["default"].createElement(LeafStyle, {
    isSelected: isSelected,
    depth: depth
  }, _react["default"].createElement("span", null, isExpanded ? '-' : '+', isComponent ? '!' : ''), _react["default"].createElement("span", null, name));
};

exports.DefaultHead = DefaultHead;
DefaultHead.displayName = "DefaultHead";
DefaultHead.displayName = 'DefaultHead';
DefaultHead.propTypes = {
  name: _propTypes["default"].node.isRequired,
  depth: _propTypes["default"].number.isRequired,
  isExpanded: _propTypes["default"].bool,
  isSelected: _propTypes["default"].bool,
  isComponent: _propTypes["default"].bool
};
DefaultHead.defaultProps = {
  isExpanded: false,
  isComponent: false,
  isSelected: false
};

var DefaultRootTitle = _theming.styled.h4({});

exports.DefaultRootTitle = DefaultRootTitle;

var DefaultLink = function DefaultLink(_ref5) {
  var id = _ref5.id,
      prefix = _ref5.prefix,
      children = _ref5.children,
      rest = _objectWithoutProperties(_ref5, ["id", "prefix", "children"]);

  return _react["default"].createElement(A, _extends({
    href: "#!".concat(prefix).concat(id)
  }, rest, {
    onClick: function onClick(e) {
      return e.preventDefault() || rest.onClick(e);
    }
  }), children);
};

exports.DefaultLink = DefaultLink;
DefaultLink.displayName = "DefaultLink";
DefaultLink.displayName = 'DefaultLink';
DefaultLink.propTypes = {
  id: _propTypes["default"].string.isRequired,
  prefix: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].node.isRequired
};