"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _api = require("@storybook/api");

var _panel = _interopRequireDefault(require("../components/panel/panel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var createPanelActions = (0, _memoizerific["default"])(1)(function (api) {
  return {
    onSelect: function onSelect(panel) {
      return api.setSelectedPanel(panel);
    },
    toggleVisibility: function toggleVisibility() {
      return api.togglePanel();
    },
    togglePosition: function togglePosition() {
      return api.togglePanelPosition();
    }
  };
});

var mapper = function mapper(_ref) {
  var state = _ref.state,
      api = _ref.api;
  return {
    panels: api.getStoryPanels(),
    selectedPanel: api.getSelectedPanel(),
    panelPosition: state.layout.panelPosition,
    actions: createPanelActions(api)
  };
};

var _default = function _default(props) {
  return _react["default"].createElement(_api.Consumer, {
    filter: mapper
  }, function (customProps) {
    return _react["default"].createElement(_panel["default"], _extends({}, props, customProps));
  });
};

exports["default"] = _default;