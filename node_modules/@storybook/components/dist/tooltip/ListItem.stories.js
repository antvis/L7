"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ListItem = _interopRequireDefault(require("./ListItem"));

var _icon = require("../icon/icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(_ListItem["default"], {
  loading: true
}), _react["default"].createElement(_ListItem["default"], {
  title: "Default"
}), _react["default"].createElement(_ListItem["default"], {
  title: "Default icon",
  right: _react["default"].createElement(_icon.Icons, {
    icon: "eye"
  })
}), _react["default"].createElement(_ListItem["default"], {
  left: "left",
  title: "title",
  center: "center",
  right: "right"
}), _react["default"].createElement(_ListItem["default"], {
  active: true,
  left: "left",
  title: "active",
  center: "center",
  right: "right"
}), _react["default"].createElement(_ListItem["default"], {
  active: true,
  left: "left",
  title: "active icon",
  center: "center",
  right: _react["default"].createElement(_icon.Icons, {
    icon: "eye"
  })
}), _react["default"].createElement(_ListItem["default"], {
  disabled: true,
  left: "left",
  title: "disabled",
  center: "center",
  right: "right"
}));

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  loading: true
});

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  title: "Default"
});

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  title: "Default icon",
  right: _react["default"].createElement(_icon.Icons, {
    icon: "eye"
  })
});

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  active: true,
  title: "active icon",
  right: _react["default"].createElement(_icon.Icons, {
    icon: "eye"
  })
});

var _ref6 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  left: "left",
  title: "title",
  center: "center",
  right: "right"
});

var _ref7 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  active: true,
  left: "left",
  title: "active",
  center: "center",
  right: "right"
});

var _ref8 =
/*#__PURE__*/
_react["default"].createElement(_ListItem["default"], {
  disabled: true,
  left: "left",
  title: "disabled",
  center: "center",
  right: "right"
});

(0, _react2.storiesOf)('basics|Tooltip/ListItem', module).add('all', function () {
  return _ref;
}).add('loading', function () {
  return _ref2;
}).add('default', function () {
  return _ref3;
}).add('default icon', function () {
  return _ref4;
}).add('active icon', function () {
  return _ref5;
}).add('w/positions', function () {
  return _ref6;
}).add('w/positions active', function () {
  return _ref7;
}).add('disabled', function () {
  return _ref8;
});