"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ = _interopRequireWildcard(require("@antv/util"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EVENT_TYPES = ['start', 'process', 'end', 'reset'];

var Interaction =
/*#__PURE__*/
function () {
  function Interaction(cfg) {
    _classCallCheck(this, Interaction);

    var defaultCfg = this._getDefaultCfg();

    Object.assign(this, defaultCfg, cfg);
    this._eventHandlers = [];

    this._bindEvents();
  }

  _createClass(Interaction, [{
    key: "_getDefaultCfg",
    value: function _getDefaultCfg() {
      return {
        startEvent: 'mousedown',
        processEvent: 'mousemove',
        endEvent: 'mouseup',
        resetEvent: 'dblclick'
      };
    }
  }, {
    key: "_start",
    value: function _start(ev) {
      this.preStart(ev);
      this.start(ev);
      this.afterStart(ev);
    }
  }, {
    key: "preStart",
    value: function preStart() {}
  }, {
    key: "start",
    value: function start() {}
  }, {
    key: "afterStart",
    value: function afterStart() {}
  }, {
    key: "_process",
    value: function _process(ev) {
      this.preProcess(ev);
      this.process(ev);
      this.afterProcess(ev);
    }
  }, {
    key: "preProcess",
    value: function preProcess() {}
  }, {
    key: "process",
    value: function process() {}
  }, {
    key: "afterProcess",
    value: function afterProcess() {}
  }, {
    key: "_end",
    value: function _end(ev) {
      this.preEnd(ev);
      this.end(ev);
      this.afterEnd(ev);
    }
  }, {
    key: "preEnd",
    value: function preEnd() {}
  }, {
    key: "end",
    value: function end() {}
  }, {
    key: "afterEnd",
    value: function afterEnd() {}
  }, {
    key: "_reset",
    value: function _reset() {
      this.preReset();
      this.reset();
      this.afterReset();
    }
  }, {
    key: "preReset",
    value: function preReset() {}
  }, {
    key: "reset",
    value: function reset() {}
  }, {
    key: "afterReset",
    value: function afterReset() {}
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;

      _.each(EVENT_TYPES, function (type) {
        var eventName = _this["".concat(type, "Event")];

        var handler = _.wrapBehavior(_this, "_".concat(type));

        _this.layer.on(eventName, handler);

        _this._eventHandlers.push({
          type: eventName,
          handler: handler
        });
      });
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _this2 = this;

      var eventHandlers = this._eventHandlers;

      _.each(eventHandlers, function (eh) {
        _this2.layer.off(eh.type, eh.handler);
      });
    }
  }, {
    key: "destory",
    value: function destory() {
      this._unbindEvents();

      this._reset();
    }
  }]);

  return Interaction;
}();

exports["default"] = Interaction;