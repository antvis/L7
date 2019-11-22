"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

var _coreEvents = require("@storybook/core-events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(_ref) {
  var provider = _ref.provider;
  var api = {
    getChannel: function getChannel() {
      return provider.channel;
    },
    on: function on(type, cb) {
      var peer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (peer) {
        provider.channel.addPeerListener(type, cb);
      } else {
        provider.channel.addListener(type, cb);
      }

      return function () {
        return provider.channel.removeListener(type, cb);
      };
    },
    off: function off(type, cb) {
      return provider.channel.removeListener(type, cb);
    },
    emit: function emit(type, event) {
      return provider.channel.emit(type, event);
    },
    once: function once(type, event) {
      return provider.channel.once(type, event);
    },
    onStory: (0, _utilDeprecate["default"])(function (cb) {
      return api.on(_coreEvents.STORY_CHANGED, cb);
    }, 'onStory(...) has been replaced with on(STORY_CHANGED, ...)')
  };
  return {
    api: api
  };
};

exports["default"] = _default;