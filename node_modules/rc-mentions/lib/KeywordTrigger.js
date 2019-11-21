"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rcTrigger = _interopRequireDefault(require("rc-trigger"));

var React = _interopRequireWildcard(require("react"));

var _DropdownMenu = _interopRequireDefault(require("./DropdownMenu"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

var KeywordTrigger =
/*#__PURE__*/
function (_React$Component) {
  _inherits(KeywordTrigger, _React$Component);

  function KeywordTrigger() {
    var _this;

    _classCallCheck(this, KeywordTrigger);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KeywordTrigger).apply(this, arguments));

    _this.getDropdownPrefix = function () {
      return "".concat(_this.props.prefixCls, "-dropdown");
    };

    _this.getDropdownElement = function () {
      var options = _this.props.options;
      return React.createElement(_DropdownMenu.default, {
        prefixCls: _this.getDropdownPrefix(),
        options: options
      });
    };

    return _this;
  }

  _createClass(KeywordTrigger, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          visible = _this$props.visible,
          placement = _this$props.placement,
          transitionName = _this$props.transitionName,
          getPopupContainer = _this$props.getPopupContainer;
      var popupElement = this.getDropdownElement();
      return React.createElement(_rcTrigger.default, {
        prefixCls: this.getDropdownPrefix(),
        popupVisible: visible,
        popup: popupElement,
        popupPlacement: placement === 'top' ? 'topRight' : 'bottomRight',
        popupTransitionName: transitionName,
        builtinPlacements: BUILT_IN_PLACEMENTS,
        getPopupContainer: getPopupContainer
      }, children);
    }
  }]);

  return KeywordTrigger;
}(React.Component);

var _default = KeywordTrigger;
exports.default = _default;