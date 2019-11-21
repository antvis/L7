"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withLink = exports.longText = exports.simple = exports.linkData = exports.longData = exports.simpleData = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _item = _interopRequireDefault(require("./item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  component: _item["default"],
  title: 'UI|Notifications/Item',
  decorators: [function (storyFn) {
    return _react["default"].createElement("div", {
      style: {
        width: '240px',
        margin: '1rem'
      }
    }, storyFn());
  }],
  excludeStories: /.*Data$/
};
exports["default"] = _default;
var simpleData = {
  id: '1',
  content: '🎉 Storybook is cool!'
};
exports.simpleData = simpleData;
var longData = {
  id: '2',
  content: '🎉 This is a long message that extends over two lines!'
};
exports.longData = longData;
var linkData = {
  id: '3',
  content: '🎉 Storybook X.X is available! Download now »',
  link: '/some/path'
};
exports.linkData = linkData;

var _ref =
/*#__PURE__*/
_react["default"].createElement(_item["default"], {
  notification: simpleData
});

var simple = function simple() {
  return _ref;
};

exports.simple = simple;
simple.displayName = "simple";

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_item["default"], {
  notification: longData
});

var longText = function longText() {
  return _ref2;
};

exports.longText = longText;
longText.displayName = "longText";

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_item["default"], {
  notification: linkData
});

var withLink = function withLink() {
  return _ref3;
};

exports.withLink = withLink;
withLink.displayName = "withLink";