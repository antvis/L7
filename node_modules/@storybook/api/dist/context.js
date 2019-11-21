"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createContext = function createContext(_ref) {
  var api = _ref.api,
      state = _ref.state;
  return _react["default"].createContext({
    api: api,
    state: state
  });
};

exports.createContext = createContext;