'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Nav = function (_Component) {
  (0, _inherits3['default'])(Nav, _Component);

  function Nav() {
    (0, _classCallCheck3['default'])(this, Nav);
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));
  }

  Nav.prototype.render = function render() {
    var props = this.props;

    return _react2['default'].createElement('div', props);
  };

  return Nav;
}(_react.Component);

exports['default'] = Nav;
module.exports = exports['default'];