"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

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
exports.ZoomProvider = exports.ZoomConsumer = exports.Zoom = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _components = require("@storybook/components");

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

var Context = _react["default"].createContext();

var Provider =
/*#__PURE__*/
function (_Component) {
  _inherits(Provider, _Component);

  function Provider() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Provider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Provider)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      value: 1
    };

    _this.set = function (value) {
      return _this.setState({
        value: value
      });
    };

    return _this;
  }

  _createClass(Provider, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      var set = this.set;
      var value = this.state.value;
      return _react["default"].createElement(Context.Provider, {
        value: {
          value: value,
          set: set
        }
      }, children);
    }
  }]);

  return Provider;
}(_react.Component);

exports.ZoomProvider = Provider;
Provider.displayName = "Provider";
Provider.propTypes = {
  children: _propTypes["default"].node.isRequired
};
var Consumer = Context.Consumer;
exports.ZoomConsumer = Consumer;

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_components.Icons, {
  icon: "zoom"
});

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_components.Icons, {
  icon: "zoomout"
});

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_components.Icons, {
  icon: "zoomreset"
});

var Zoom = function Zoom(_ref) {
  var set = _ref.set,
      reset = _ref.reset;
  return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(_components.IconButton, {
    key: "zoomin",
    onClick: function onClick(e) {
      return e.preventDefault() || set(0.8);
    },
    title: "Zoom in"
  }, _ref2), _react["default"].createElement(_components.IconButton, {
    key: "zoomout",
    onClick: function onClick(e) {
      return e.preventDefault() || set(1.25);
    },
    title: "Zoom out"
  }, _ref3), _react["default"].createElement(_components.IconButton, {
    key: "zoomreset",
    onClick: function onClick(e) {
      return e.preventDefault() || reset();
    },
    title: "Reset zoom"
  }, _ref4));
};

exports.Zoom = Zoom;
Zoom.displayName = "Zoom";
Zoom.propTypes = {
  set: _propTypes["default"].func.isRequired,
  reset: _propTypes["default"].func.isRequired
};