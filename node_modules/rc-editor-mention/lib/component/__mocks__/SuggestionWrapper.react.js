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

var SuggestionWrapper = function (_React$Component) {
  (0, _inherits3['default'])(SuggestionWrapper, _React$Component);

  function SuggestionWrapper() {
    (0, _classCallCheck3['default'])(this, SuggestionWrapper);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }

  SuggestionWrapper.prototype.componentDidMount = function componentDidMount() {
    this.props.renderReady();
  };

  SuggestionWrapper.prototype.componentDidUpdate = function componentDidUpdate() {
    this.props.renderReady();
  };

  SuggestionWrapper.prototype.render = function render() {
    return this.props.children;
  };

  return SuggestionWrapper;
}(_react2['default'].Component);

exports['default'] = SuggestionWrapper;
module.exports = exports['default'];