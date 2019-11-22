"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panels = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _panel = _interopRequireDefault(require("./panel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var panels = {
  test1: {
    title: 'Test 1',
    // eslint-disable-next-line react/prop-types
    render: function render(_ref) {
      var active = _ref.active,
          key = _ref.key;
      return active ? _react["default"].createElement("div", {
        id: "test1",
        key: key
      }, "TEST 1") : null;
    }
  },
  test2: {
    title: 'Test 2',
    // eslint-disable-next-line react/prop-types
    render: function render(_ref2) {
      var active = _ref2.active,
          key = _ref2.key;
      return active ? _react["default"].createElement("div", {
        id: "test2",
        key: key
      }, "TEST 2") : null;
    }
  }
};
exports.panels = panels;
var onSelect = (0, _addonActions.action)('onSelect');
var toggleVisibility = (0, _addonActions.action)('toggleVisibility');
var togglePosition = (0, _addonActions.action)('togglePosition');
(0, _react2.storiesOf)('UI|Panel', module).addParameters({
  component: _panel["default"]
}).add('default', function () {
  return _react["default"].createElement(_panel["default"], {
    absolute: false,
    panels: panels,
    actions: {
      onSelect: onSelect,
      toggleVisibility: toggleVisibility,
      togglePosition: togglePosition
    },
    selectedPanel: "test2"
  });
}).add('no panels', function () {
  return _react["default"].createElement(_panel["default"], {
    panels: {},
    actions: {
      onSelect: onSelect,
      toggleVisibility: toggleVisibility,
      togglePosition: togglePosition
    }
  });
});