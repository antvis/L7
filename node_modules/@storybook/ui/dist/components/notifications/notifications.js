"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = NotificationList;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _item = _interopRequireDefault(require("./item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var List = _theming.styled.div({
  zIndex: 10,
  '> * + *': {
    marginTop: 10
  },
  '&:empty': {
    display: 'none'
  }
}, function (_ref) {
  var placement = _ref.placement;
  return placement || {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed'
  };
});

function NotificationList(_ref2) {
  var notifications = _ref2.notifications,
      placement = _ref2.placement;
  return _react["default"].createElement(List, {
    placement: placement
  }, notifications.map(function (notification) {
    return _react["default"].createElement(_item["default"], {
      key: notification.id,
      notification: notification
    });
  }));
}

NotificationList.displayName = "NotificationList";
NotificationList.propTypes = {
  placement: _propTypes["default"].shape({
    position: _propTypes["default"].string,
    left: _propTypes["default"].number,
    right: _propTypes["default"].number,
    top: _propTypes["default"].number,
    bottom: _propTypes["default"].number
  }),
  notifications: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    id: _propTypes["default"].string,
    content: _propTypes["default"].string.isRequired,
    link: _propTypes["default"].string
  }).isRequired).isRequired
};
NotificationList.defaultProps = {
  placement: undefined
};