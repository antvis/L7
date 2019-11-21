"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _coreEvents = require("@storybook/core-events");

var _ActionLogger = require("../../components/ActionLogger");

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var safeDeepEqual = function safeDeepEqual(a, b) {
  try {
    return (0, _fastDeepEqual["default"])(a, b);
  } catch (e) {
    return false;
  }
};

var ActionLogger =
/*#__PURE__*/
function (_Component) {
  _inherits(ActionLogger, _Component);

  function ActionLogger(props) {
    var _this;

    _classCallCheck(this, ActionLogger);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActionLogger).call(this, props));
    _this.mounted = void 0;

    _this.handleStoryChange = function () {
      var actions = _this.state.actions;

      if (actions.length > 0 && actions[0].options.clearOnStoryChange) {
        _this.clearActions();
      }
    };

    _this.addAction = function (action) {
      _this.setState(function (prevState) {
        var actions = _toConsumableArray(prevState.actions);

        var previous = actions.length && actions[0];

        if (previous && safeDeepEqual(previous.data, action.data)) {
          previous.count++; // eslint-disable-line
        } else {
          action.count = 1; // eslint-disable-line

          actions.unshift(action);
        }

        return {
          actions: actions.slice(0, action.options.limit)
        };
      });
    };

    _this.clearActions = function () {
      _this.setState({
        actions: []
      });
    };

    _this.state = {
      actions: []
    };
    return _this;
  }

  _createClass(ActionLogger, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      var api = this.props.api;
      api.on(_.EVENT_ID, this.addAction);
      api.on(_coreEvents.STORY_RENDERED, this.handleStoryChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      var api = this.props.api;
      api.off(_coreEvents.STORY_RENDERED, this.handleStoryChange);
      api.off(_.EVENT_ID, this.addAction);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state$actions = this.state.actions,
          actions = _this$state$actions === void 0 ? [] : _this$state$actions;
      var active = this.props.active;
      var props = {
        actions: actions,
        onClear: this.clearActions
      };
      return active ? _react["default"].createElement(_ActionLogger.ActionLogger, props) : null;
    }
  }]);

  return ActionLogger;
}(_react.Component);

exports["default"] = ActionLogger;