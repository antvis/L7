"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = action;

var _v = _interopRequireDefault(require("uuid/v4"));

var _addons = require("@storybook/addons");

var _constants = require("../constants");

var _configureActions = require("./configureActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function action(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var actionOptions = Object.assign({}, _configureActions.config, {}, options);

  var handler = function actionHandler() {
    var channel = _addons.addons.getChannel();

    var id = (0, _v["default"])();
    var minDepth = 5; // anything less is really just storybook internals

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var actionDisplayToEmit = {
      id: id,
      count: 0,
      data: {
        name: name,
        args: args
      },
      options: Object.assign({}, actionOptions, {
        depth: minDepth + (actionOptions.depth || 3),
        allowFunction: actionOptions.allowFunction || false
      })
    };
    channel.emit(_constants.EVENT_ID, actionDisplayToEmit);
  };

  return handler;
}