"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBox2 = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

require("./styles.css");

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

var ErrorBox =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ErrorBox, _React$Component);

  function ErrorBox() {
    _classCallCheck(this, ErrorBox);

    return _possibleConstructorReturn(this, _getPrototypeOf(ErrorBox).apply(this, arguments));
  }

  _createClass(ErrorBox, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return _react["default"].createElement("div", {
        className: "error-box"
      }, children);
    }
  }]);

  return ErrorBox;
}(_react["default"].Component);

ErrorBox.propTypes = {
  children: _react["default"].PropTypes.node.isRequired
};
ErrorBox.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "ErrorBox",
  "props": {
    "children": {
      "type": {
        "name": "node"
      },
      "required": true,
      "description": ""
    }
  }
};
var _default = ErrorBox;
exports["default"] = _default;

var ErrorBox2 =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ErrorBox2, _React$Component2);

  function ErrorBox2() {
    _classCallCheck(this, ErrorBox2);

    return _possibleConstructorReturn(this, _getPrototypeOf(ErrorBox2).apply(this, arguments));
  }

  _createClass(ErrorBox2, [{
    key: "render",
    value: function render() {
      var children2 = this.props.children2;
      return _react["default"].createElement("div", {
        className: "error-box"
      }, children2);
    }
  }]);

  return ErrorBox2;
}(_react["default"].Component);

exports.ErrorBox2 = ErrorBox2;
ErrorBox2.propTypes = {
  children2: _react["default"].PropTypes.node.isRequired
};
ErrorBox2.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "ErrorBox2",
  "props": {
    "children2": {
      "type": {
        "name": "node"
      },
      "required": true,
      "description": ""
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/multiple-exports/actual.js"] = {
    name: "ErrorBox",
    docgenInfo: ErrorBox.__docgenInfo,
    path: "test/fixtures/multiple-exports/actual.js"
  };
}

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/multiple-exports/actual.js"] = {
    name: "ErrorBox2",
    docgenInfo: ErrorBox2.__docgenInfo,
    path: "test/fixtures/multiple-exports/actual.js"
  };
}
