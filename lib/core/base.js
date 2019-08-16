"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _util = _interopRequireDefault(require("../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Base =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Base, _EventEmitter);

  _createClass(Base, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return {};
    }
  }]);

  function Base(cfg) {
    var _this;

    _classCallCheck(this, Base);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Base).call(this));
    var attrs = {
      visible: true
    };

    var defaultCfg = _this.getDefaultCfg();

    _this._attrs = attrs;

    _util["default"].assign(attrs, defaultCfg, cfg);

    return _this;
  }

  _createClass(Base, [{
    key: "get",
    value: function get(name) {
      return this._attrs[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this._attrs[name] = value;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._attrs = {};
      this.removeAllListeners();
      this.destroyed = true;
    }
  }]);

  return Base;
}(_wolfy87Eventemitter["default"]);

var _default = Base;
exports["default"] = _default;