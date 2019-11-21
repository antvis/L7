"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewProps = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addons = require("@storybook/addons");

var _preview = require("./preview");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var previewProps = {
  id: 'string',
  api: {
    on: function on() {},
    emit: function emit() {},
    off: function off() {}
  },
  storyId: 'string',
  path: 'string',
  viewMode: 'story',
  location: {},
  baseUrl: 'http://example.com',
  queryParams: {},
  getElements: function getElements(type) {
    return type === _addons.types.TAB ? [{
      id: 'notes',
      type: _addons.types.TAB,
      title: 'Notes',
      route: function route(_ref) {
        var storyId = _ref.storyId;
        return "/info/".concat(storyId);
      },
      // todo add type
      match: function match(_ref2) {
        var viewMode = _ref2.viewMode;
        return viewMode === 'info';
      },
      // todo add type
      render: function render() {
        return null;
      }
    }] : [];
  },
  options: {
    isFullscreen: false,
    isToolshown: true
  },
  actions: {}
};
exports.previewProps = previewProps;
(0, _react2.storiesOf)('UI|Preview/Preview', module).addParameters({
  component: _preview.Preview
}).add('no tabs', function () {
  return _react["default"].createElement(_preview.Preview, _extends({}, previewProps, {
    getElements: function getElements() {
      return [];
    }
  }));
}).add('with tabs', function () {
  return _react["default"].createElement(_preview.Preview, previewProps);
});