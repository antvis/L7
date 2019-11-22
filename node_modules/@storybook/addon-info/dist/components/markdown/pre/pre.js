"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _copyButton = _interopRequireDefault(require("./copyButton"));

var _copy = _interopRequireDefault(require("./copy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TOGGLE_TIMEOUT = 1800;

var Pre =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Pre, _React$Component);

  function Pre() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Pre);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Pre)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      copied: false
    };

    _this.setRef = function (elem) {
      _this.pre = elem;
    };

    _this.handleClick = function () {
      var text = _this.pre && _this.pre.innerText;

      if (!text) {
        return;
      }

      (0, _copy["default"])(text);

      _this.setState({
        copied: true
      });

      clearTimeout(_this.timeout);
      _this.timeout = setTimeout(function () {
        _this.setState({
          copied: false
        });
      }, TOGGLE_TIMEOUT);
    };

    return _this;
  }

  _createClass(Pre, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          theme = _this$props.theme,
          children = _this$props.children;
      var pre = theme.pre;
      var copied = this.state.copied;
      return _react["default"].createElement("pre", {
        style: Object.assign({}, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '.88em',
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          backgroundColor: '#fafafa',
          padding: '.5rem',
          lineHeight: 1.5,
          overflowX: 'scroll'
        }, {}, pre)
      }, _react["default"].createElement("div", {
        ref: this.setRef
      }, children), _react["default"].createElement(_copyButton["default"], {
        onClick: this.handleClick,
        toggled: copied
      }));
    }
  }]);

  return Pre;
}(_react["default"].Component);

Pre.propTypes = {
  children: _propTypes["default"].node,
  theme: _propTypes["default"].shape({
    pre: _propTypes["default"].object
  })
};
Pre.defaultProps = {
  children: null,
  theme: {}
};
var _default = Pre;
exports["default"] = _default;