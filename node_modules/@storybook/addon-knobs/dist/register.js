"use strict";

var _react = _interopRequireDefault(require("react"));

var _addons = _interopRequireDefault(require("@storybook/addons"));

var _Panel = _interopRequireDefault(require("./components/Panel"));

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_addons["default"].register(_shared.ADDON_ID, function (api) {
  _addons["default"].addPanel(_shared.PANEL_ID, {
    title: 'Knobs',
    render: function render(_ref) {
      var active = _ref.active,
          key = _ref.key;
      return _react["default"].createElement(_Panel["default"], {
        api: api,
        key: key,
        active: active
      });
    },
    paramKey: _shared.PARAM_KEY
  });
});