"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.bind");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.number.is-integer");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createChannel;
exports.PostmsgTransport = exports.KEY = void 0;

var _global = require("global");

var _channels = _interopRequireDefault(require("@storybook/channels"));

var _clientLogger = require("@storybook/client-logger");

var _telejson = require("telejson");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KEY = 'storybook-channel'; // TODO: we should export a method for opening child windows here and keep track of em.
// that way we can send postMessage to child windows as well, not just iframe
// https://stackoverflow.com/questions/6340160/how-to-get-the-references-of-all-already-opened-child-windows

exports.KEY = KEY;

var PostmsgTransport =
/*#__PURE__*/
function () {
  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  function PostmsgTransport(config) {
    _classCallCheck(this, PostmsgTransport);

    this.config = config;
    this.buffer = void 0;
    this.handler = void 0;
    this.connected = void 0;
    this.buffer = [];
    this.handler = null;

    _global.window.addEventListener('message', this.handleEvent.bind(this), false); // Check whether the config.page parameter has a valid value


    if (config.page !== 'manager' && config.page !== 'preview') {
      throw new Error("postmsg-channel: \"config.page\" cannot be \"".concat(config.page, "\""));
    }
  }

  _createClass(PostmsgTransport, [{
    key: "setHandler",
    value: function setHandler(handler) {
      var _this = this;

      this.handler = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(_this, args);

        if (!_this.connected && _this.getWindow()) {
          _this.flush();

          _this.connected = true;
        }
      };
    }
    /**
     * Sends `event` to the associated window. If the window does not yet exist
     * the event will be stored in a buffer and sent when the window exists.
     * @param event
     */

  }, {
    key: "send",
    value: function send(event, options) {
      var _this2 = this;

      var iframeWindow = this.getWindow();

      if (!iframeWindow) {
        return new Promise(function (resolve, reject) {
          _this2.buffer.push({
            event: event,
            resolve: resolve,
            reject: reject
          });
        });
      }

      var depth = 15;
      var allowFunction = true;

      if (options && typeof options.allowFunction === 'boolean') {
        // eslint-disable-next-line prefer-destructuring
        allowFunction = options.allowFunction;
      }

      if (options && Number.isInteger(options.depth)) {
        // eslint-disable-next-line prefer-destructuring
        depth = options.depth;
      }

      var data = (0, _telejson.stringify)({
        key: KEY,
        event: event
      }, {
        maxDepth: depth,
        allowFunction: allowFunction
      }); // TODO: investigate http://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage
      // might replace '*' with document.location ?

      iframeWindow.postMessage(data, '*');
      return Promise.resolve(null);
    }
  }, {
    key: "flush",
    value: function flush() {
      var _this3 = this;

      var buffer = this.buffer;
      this.buffer = [];
      buffer.forEach(function (item) {
        _this3.send(item.event).then(item.resolve)["catch"](item.reject);
      });
    }
  }, {
    key: "getWindow",
    value: function getWindow() {
      if (this.config.page === 'manager') {
        // FIXME this is a really bad idea! use a better way to do this.
        // This finds the storybook preview iframe to send messages to.
        var iframe = _global.document.getElementById('storybook-preview-iframe');

        if (!iframe) {
          return null;
        }

        return iframe.contentWindow;
      }

      return _global.window.parent;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(rawEvent) {
      try {
        var data = rawEvent.data;

        var _ref = typeof data === 'string' && (0, _telejson.isJSON)(data) ? (0, _telejson.parse)(data) : data,
            key = _ref.key,
            event = _ref.event;

        if (key === KEY) {
          _clientLogger.logger.debug.apply(_clientLogger.logger, ["message arrived at ".concat(this.config.page), event.type].concat(_toConsumableArray(event.args)));

          this.handler(event);
        }
      } catch (error) {
        _clientLogger.logger.error(error); // debugger;

      }
    }
  }]);

  return PostmsgTransport;
}();
/**
 * Creates a channel which communicates with an iframe or child window.
 */


exports.PostmsgTransport = PostmsgTransport;

function createChannel(_ref2) {
  var page = _ref2.page;
  var transport = new PostmsgTransport({
    page: page
  });
  return new _channels["default"]({
    transport: transport
  });
}