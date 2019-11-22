"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Button = function Button(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style;
  return _react["default"].createElement("button", {
    style: {},
    onClick: onClick
  }, children);
};

Button.propTypes = {
  children: _react["default"].PropTypes.string.isRequired,
  onClick: _react["default"].PropTypes.func,
  style: _react["default"].PropTypes.object
};
Button.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "Button",
  "props": {
    "style": {
      "defaultValue": {
        "value": "{}",
        "computed": false
      },
      "type": {
        "name": "object"
      },
      "required": false,
      "description": ""
    },
    "children": {
      "type": {
        "name": "string"
      },
      "required": true,
      "description": ""
    },
    "onClick": {
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    }
  }
};
var _default = Button;
exports["default"] = _default;
var A;
A = [1, 2, 2, 2];

function abc() {
  var c = function cef() {
    A = 'str';
  };
}

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/case4/actual.js"] = {
    name: "Button",
    docgenInfo: Button.__docgenInfo,
    path: "test/fixtures/case4/actual.js"
  };
}
