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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Content = function (_React$Component) {
  (0, _inherits3['default'])(Content, _React$Component);

  function Content() {
    (0, _classCallCheck3['default'])(this, Content);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }

  Content.prototype.componentDidUpdate = function componentDidUpdate() {
    var trigger = this.props.trigger;

    if (trigger) {
      trigger.forcePopupAlign();
    }
  };

  Content.prototype.render = function render() {
    var _props = this.props,
        overlay = _props.overlay,
        prefixCls = _props.prefixCls,
        id = _props.id;

    return _react2['default'].createElement(
      'div',
      { className: prefixCls + '-inner', id: id, role: 'tooltip' },
      typeof overlay === 'function' ? overlay() : overlay
    );
  };

  return Content;
}(_react2['default'].Component);

Content.propTypes = {
  prefixCls: _propTypes2['default'].string,
  overlay: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func]).isRequired,
  id: _propTypes2['default'].string,
  trigger: _propTypes2['default'].any
};
exports['default'] = Content;
module.exports = exports['default'];