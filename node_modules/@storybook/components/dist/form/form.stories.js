"use strict";

require("core-js/modules/es.array.map");

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _input = require("./input/input");

var _field = require("./field/field");

var _Spaced = require("../spaced/Spaced");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Flexed = _theming.styled.div({
  display: 'flex'
});

var _ref =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val1"
}, "Value 1");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val2"
}, "Value 2");

var _ref3 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val3"
}, "Value 3");

(0, _react2.storiesOf)('Basics|Form/Field', module).add('field', function () {
  return _react["default"].createElement(_field.Field, {
    key: "key",
    label: "label"
  }, _react["default"].createElement(_input.Select, {
    value: "val2",
    onChange: (0, _addonActions.action)('onChange'),
    size: 1
  }, _ref, _ref2, _ref3));
});

var _ref4 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val1"
}, "Value 1");

var _ref5 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val2"
}, "Value 2");

var _ref6 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val3"
}, "Value 3");

var _ref7 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val1"
}, "Value 1");

var _ref8 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val2"
}, "Value 2");

var _ref9 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val3"
}, "Value 3");

var _ref10 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val1"
}, "Value 1");

var _ref11 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val2"
}, "Value 2");

var _ref12 =
/*#__PURE__*/
_react["default"].createElement("option", {
  value: "val3"
}, "Value 3");

(0, _react2.storiesOf)('Basics|Form/Select', module).add('sizes', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['auto', 'flex', '100%'].map(function (size) {
    return _react["default"].createElement(Flexed, {
      key: size
    }, _react["default"].createElement(_input.Select, {
      value: "val2",
      onChange: (0, _addonActions.action)('onChange'),
      size: size
    }, _ref4, _ref5, _ref6));
  }));
}).add('validations', function () {
  return _react["default"].createElement("div", null, _react["default"].createElement(_Spaced.Spaced, null, ['error', 'warn', 'valid', null].map(function (valid) {
    return _react["default"].createElement(_input.Select, {
      key: valid,
      value: "val2",
      onChange: (0, _addonActions.action)('onChange'),
      size: "100%",
      valid: valid
    }, _ref7, _ref8, _ref9);
  })), _react["default"].createElement(_input.Select, {
    value: "val2",
    onChange: (0, _addonActions.action)('onChange'),
    size: "100%",
    disabled: true
  }, _ref10, _ref11, _ref12));
});
(0, _react2.storiesOf)('Basics|Form/Button', module).add('sizes', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['auto', 'flex', '100%'].map(function (size) {
    return _react["default"].createElement(Flexed, {
      key: size
    }, _react["default"].createElement(_input.Button, {
      size: size
    }, "click this button"));
  }));
}).add('validations', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['error', 'warn', 'valid', null].map(function (valid) {
    return _react["default"].createElement(Flexed, {
      key: valid
    }, _react["default"].createElement(_input.Button, {
      size: "100%",
      valid: valid
    }, "click this button"));
  }));
});
(0, _react2.storiesOf)('Basics|Form/Textarea', module).add('sizes', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['auto', 'flex', '100%'].map(function (size) {
    return _react["default"].createElement(Flexed, {
      key: size
    }, _react["default"].createElement(_input.Textarea, {
      defaultValue: "textarea",
      size: size
    }));
  }));
}).add('validations', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['error', 'warn', 'valid', null].map(function (valid) {
    return _react["default"].createElement(Flexed, {
      key: valid
    }, _react["default"].createElement(_input.Textarea, {
      defaultValue: "textarea",
      size: "100%",
      valid: valid
    }));
  }));
}).add('alignment', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['end', 'center', 'start'].map(function (align) {
    return _react["default"].createElement(Flexed, {
      key: align
    }, _react["default"].createElement(_input.Textarea, {
      defaultValue: "textarea",
      size: "100%",
      align: align
    }));
  }));
});
(0, _react2.storiesOf)('Basics|Form/Input', module).add('sizes', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['auto', 'flex', '100%'].map(function (size) {
    return _react["default"].createElement(Flexed, {
      key: size
    }, _react["default"].createElement(_input.Input, {
      defaultValue: "text",
      size: size
    }));
  }));
}).add('validations', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['error', 'warn', 'valid', null].map(function (valid) {
    return _react["default"].createElement(Flexed, {
      key: valid
    }, _react["default"].createElement(_input.Input, {
      defaultValue: "text",
      size: "100%",
      valid: valid
    }));
  }));
}).add('alignment', function () {
  return _react["default"].createElement(_Spaced.Spaced, null, ['end', 'center', 'start'].map(function (align) {
    return _react["default"].createElement(Flexed, {
      key: align
    }, _react["default"].createElement(_input.Input, {
      defaultValue: "text",
      size: "100%",
      align: align
    }));
  }));
});