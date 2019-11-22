"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
exports.operationReducer = exports.playerReducer = void 0;

var _player = _interopRequireDefault(require("./player"));

var _operation = _interopRequireDefault(require("./operation"));

function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  return {
    player: (0, _player["default"])(state.player, action),
    operation: (0, _operation["default"])(state.operation, action)
  };
}

var playerReducer = _player["default"];
exports.playerReducer = playerReducer;
var operationReducer = _operation["default"];
exports.operationReducer = operationReducer;