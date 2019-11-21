'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MentionContent = function MentionContent(_ref) {
  var children = _ref.children;
  return _react2['default'].createElement(
    'span',
    { style: { backgroundColor: '#e6f3ff' } },
    children
  );
};

exports['default'] = MentionContent;
module.exports = exports['default'];