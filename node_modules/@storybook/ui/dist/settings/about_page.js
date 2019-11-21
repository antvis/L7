"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _global = require("global");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _router = require("@storybook/router");

var _api = require("@storybook/api");

var _about = _interopRequireDefault(require("./about"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Clear a notification on mount. This could be exported by core/notifications.js perhaps?
var NotificationClearer =
/*#__PURE__*/
function (_Component) {
  _inherits(NotificationClearer, _Component);

  function NotificationClearer() {
    _classCallCheck(this, NotificationClearer);

    return _possibleConstructorReturn(this, _getPrototypeOf(NotificationClearer).apply(this, arguments));
  }

  _createClass(NotificationClearer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          api = _this$props.api,
          notificationId = _this$props.notificationId;
      api.clearNotification(notificationId);
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return NotificationClearer;
}(_react.Component);

NotificationClearer.displayName = "NotificationClearer";
NotificationClearer.propTypes = {
  api: _propTypes["default"].shape({
    clearNotification: _propTypes["default"].func.isRequired
  }).isRequired,
  notificationId: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].node.isRequired
};

var _default = function _default() {
  return _react["default"].createElement(_router.Route, {
    path: "about"
  }, _react["default"].createElement(_api.Consumer, null, function (_ref) {
    var api = _ref.api;
    return _react["default"].createElement(NotificationClearer, {
      api: api,
      notificationId: "update"
    }, _react["default"].createElement(_about["default"], {
      current: api.getCurrentVersion(),
      latest: api.getLatestVersion(),
      onClose: function onClose() {
        return _global.history.back();
      }
    }));
  }));
};

exports["default"] = _default;