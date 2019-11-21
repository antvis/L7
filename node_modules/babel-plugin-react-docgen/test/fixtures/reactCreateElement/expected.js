"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Kitten = function Kitten(_ref) {
  var isWide = _ref.isWide,
      isLong = _ref.isLong;
  return _react["default"].createElement('img', {
    width: isWide ? '500' : '200',
    height: isLong ? '500' : '200',
    src: 'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg'
  });
};

Kitten.propTypes = {
  /** Whether the cat is wide */
  isWide: _propTypes["default"].bool,

  /** Whether the cat is long */
  isLong: _propTypes["default"].bool
};
Kitten.defaultProps = {
  isWide: false,
  isLong: false
};
Kitten.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "Kitten",
  "props": {
    "isWide": {
      "defaultValue": {
        "value": "false",
        "computed": false
      },
      "type": {
        "name": "bool"
      },
      "required": false,
      "description": "Whether the cat is wide"
    },
    "isLong": {
      "defaultValue": {
        "value": "false",
        "computed": false
      },
      "type": {
        "name": "bool"
      },
      "required": false,
      "description": "Whether the cat is long"
    }
  }
};
var _default = Kitten;
exports["default"] = _default;

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/reactCreateElement/actual.js"] = {
    name: "Kitten",
    docgenInfo: Kitten.__docgenInfo,
    path: "test/fixtures/reactCreateElement/actual.js"
  };
}
