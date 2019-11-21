"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _react = _interopRequireDefault(require("react"));

var _addons = _interopRequireDefault(require("@storybook/addons"));

var _StoryPanel = _interopRequireDefault(require("./StoryPanel"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable react/prop-types */
function register() {
  _addons["default"].register(_.ADDON_ID, function (api) {
    _addons["default"].addPanel(_.PANEL_ID, {
      title: 'Story',
      render: function render(_ref) {
        var active = _ref.active,
            key = _ref.key;
        return _react["default"].createElement(_StoryPanel["default"], {
          key: key,
          api: api,
          active: active
        });
      }
    });
  });
}