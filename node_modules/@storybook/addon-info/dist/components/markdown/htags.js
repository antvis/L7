"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.H1 = H1;
exports.H2 = H2;
exports.H3 = H3;
exports.H4 = H4;
exports.H5 = H5;
exports.H6 = H6;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultProps = {
  children: null,
  id: null
};
var propTypes = {
  children: _propTypes["default"].node,
  id: _propTypes["default"].string
};

function H1(_ref) {
  var id = _ref.id,
      children = _ref.children;
  var styles = {
    borderBottom: '1px solid #eee',
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '40px'
  };
  return _react["default"].createElement("h1", {
    id: id,
    style: styles
  }, children);
}

H1.defaultProps = defaultProps;
H1.propTypes = propTypes;

function H2(_ref2) {
  var id = _ref2.id,
      children = _ref2.children;
  var styles = {
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '30px'
  };
  return _react["default"].createElement("h2", {
    id: id,
    style: styles
  }, children);
}

H2.defaultProps = defaultProps;
H2.propTypes = propTypes;

function H3(_ref3) {
  var id = _ref3.id,
      children = _ref3.children;
  var styles = {
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '22px',
    textTransform: 'uppercase'
  };
  return _react["default"].createElement("h3", {
    id: id,
    style: styles
  }, children);
}

H3.defaultProps = defaultProps;
H3.propTypes = propTypes;

function H4(_ref4) {
  var id = _ref4.id,
      children = _ref4.children;
  var styles = {
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '20px'
  };
  return _react["default"].createElement("h4", {
    id: id,
    style: styles
  }, children);
}

H4.defaultProps = defaultProps;
H4.propTypes = propTypes;

function H5(_ref5) {
  var id = _ref5.id,
      children = _ref5.children;
  var styles = {
    fontWeight: 600,
    margin: 0,
    padding: 0,
    fontSize: '18px'
  };
  return _react["default"].createElement("h5", {
    id: id,
    style: styles
  }, children);
}

H5.defaultProps = defaultProps;
H5.propTypes = propTypes;

function H6(_ref6) {
  var id = _ref6.id,
      children = _ref6.children;
  var styles = {
    fontWeight: 400,
    margin: 0,
    padding: 0,
    fontSize: '18px'
  };
  return _react["default"].createElement("h6", {
    id: id,
    style: styles
  }, children);
}

H6.defaultProps = defaultProps;
H6.propTypes = propTypes;