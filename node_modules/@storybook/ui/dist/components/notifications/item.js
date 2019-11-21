"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.bold");

require("core-js/modules/es.string.link");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NotificationItem;
exports.NotificationItemSpacer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _router = require("@storybook/router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var baseStyle = function baseStyle(_ref) {
  var theme = _ref.theme;
  return {
    display: 'block',
    padding: '16px 20px',
    borderRadius: 10,
    fontSize: theme.typography.size.s1,
    fontWeight: theme.typography.weight.bold,
    lineHeight: "16px",
    boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
    color: theme.color.inverseText,
    backgroundColor: theme.base === 'light' ? (0, _theming.darken)(theme.background.app) : (0, _theming.lighten)(theme.background.app),
    textDecoration: 'none'
  };
};

var NotificationLink = (0, _theming.styled)(_router.Link)(baseStyle);

var Notification = _theming.styled.div(baseStyle);

var NotificationItemSpacer = _theming.styled.div({
  height: 48
});

exports.NotificationItemSpacer = NotificationItemSpacer;

function NotificationItem(_ref2) {
  var _ref2$notification = _ref2.notification,
      content = _ref2$notification.content,
      link = _ref2$notification.link;
  return link ? _react["default"].createElement(NotificationLink, {
    to: link
  }, content) : _react["default"].createElement(Notification, null, content);
}

NotificationItem.propTypes = {
  notification: _propTypes["default"].shape({
    content: _propTypes["default"].string.isRequired,
    link: _propTypes["default"].string
  }).isRequired
};