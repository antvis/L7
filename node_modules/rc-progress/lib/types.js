"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.defaultProps = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultProps = {
  className: '',
  percent: 0,
  prefixCls: 'rc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  style: {},
  trailColor: '#D9D9D9',
  trailWidth: 1
};
exports.defaultProps = defaultProps;

var mixedType = _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]);

var propTypes = {
  className: _propTypes["default"].string,
  percent: _propTypes["default"].oneOfType([mixedType, _propTypes["default"].arrayOf(mixedType)]),
  prefixCls: _propTypes["default"].string,
  strokeColor: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object])), _propTypes["default"].object]),
  strokeLinecap: _propTypes["default"].oneOf(['butt', 'round', 'square']),
  strokeWidth: mixedType,
  style: _propTypes["default"].object,
  trailColor: _propTypes["default"].string,
  trailWidth: mixedType
};
exports.propTypes = propTypes;