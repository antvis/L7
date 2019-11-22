"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.First = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Second = function Second() {
  return _react["default"].createElement("div", null, "Sample");
};

var First = function First(_ref) {
  var children = _ref.children;
  return _react["default"].createElement("div", null, children, _react["default"].createElement(Second, null));
};

exports.First = First;
First.propTypes = {
  children: _react.PropTypes.node
};
First.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "First",
  "props": {
    "children": {
      "type": {
        "name": "node"
      },
      "required": false,
      "description": ""
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/case7/actual.js"] = {
    name: "First",
    docgenInfo: First.__docgenInfo,
    path: "test/fixtures/case7/actual.js"
  };
}
