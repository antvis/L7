"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var _index = require("../../interaction/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InteractionController =
/*#__PURE__*/
function () {
  function InteractionController(cfg) {
    _classCallCheck(this, InteractionController);

    // defs 列定义
    _util["default"].assign(this, cfg);
  } // interaction 方法


  _createClass(InteractionController, [{
    key: "clearAllInteractions",
    value: function clearAllInteractions() {
      var interactions = this.layer.get('interactions');

      _util["default"].each(interactions, function (interaction, key) {
        interaction.destory();
        delete interactions[key];
      });

      return this;
    }
  }, {
    key: "clearInteraction",
    value: function clearInteraction(type) {
      var interactions = this.layer.get('interactions');

      if (interactions[type]) {
        interactions[type].destory();
        delete interactions[type];
      }

      return this;
    }
  }, {
    key: "addInteraction",
    value: function addInteraction(type) {
      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      cfg.layer = this.layer;
      var Ctor = (0, _index.getInteraction)(type);
      var interaction = new Ctor(cfg);

      this._setInteraction(type, interaction);

      return this;
    }
  }, {
    key: "_setInteraction",
    value: function _setInteraction(type, interaction) {
      var interactions = this.layer.get('interactions');

      if (interactions[type]) {
        interactions[type].destory();
      }

      interactions[type] = interaction;
    }
  }]);

  return InteractionController;
}();

exports["default"] = InteractionController;