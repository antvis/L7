"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.mapper = void 0;

var _react = _interopRequireDefault(require("react"));

var _api = require("@storybook/api");

var _notifications = _interopRequireDefault(require("../components/notifications/notifications"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var mapper = function mapper(_ref) {
  var state = _ref.state;
  var notifications = state.notifications;
  return {
    notifications: notifications
  };
};

exports.mapper = mapper;

var NotificationConnect = function NotificationConnect(props) {
  return _react["default"].createElement(_api.Consumer, {
    filter: mapper
  }, function (fromState) {
    return _react["default"].createElement(_notifications["default"], _extends({}, props, fromState));
  });
};

NotificationConnect.displayName = "NotificationConnect";
var _default = NotificationConnect;
exports["default"] = _default;