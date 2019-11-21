"use strict";

require("core-js/modules/es.object.assign");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _about = _interopRequireDefault(require("./about"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var info = {
  plain: "- upgrade webpack & babel to latest\n- new addParameters and third argument to .add to pass data to addons\n- added the ability to theme storybook\n- improved ui for mobile devices\n- improved performance of addon-knobs"
};
var actions = (0, _addonActions.actions)('onClose');
(0, _react2.storiesOf)('UI|Settings/AboutScreen', module).addParameters({
  component: _about["default"]
}).addDecorator(function (s) {
  return _react["default"].createElement("div", {
    style: {
      position: 'relative',
      height: 'calc(100vh)',
      width: 'calc(100vw)'
    }
  }, s());
}).add('up to date', function () {
  return _react["default"].createElement(_about["default"], _extends({
    latest: {
      version: '5.0.0',
      info: info
    },
    current: {
      version: '5.0.0'
    }
  }, actions));
}).add('old version race condition', function () {
  return _react["default"].createElement(_about["default"], _extends({
    latest: {
      version: '5.0.0',
      info: info
    },
    current: {
      version: '5.0.3'
    }
  }, actions));
}).add('new version required', function () {
  return _react["default"].createElement(_about["default"], _extends({
    latest: {
      version: '5.0.3',
      info: info
    },
    current: {
      version: '5.0.0'
    }
  }, actions));
}).add('failed to fetch new version', function () {
  return _react["default"].createElement(_about["default"], _extends({
    current: {
      version: '5.0.0'
    }
  }, actions));
});