"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _throttle = _interopRequireDefault(require("../util/throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Hash =
/*#__PURE__*/
function (_Interaction) {
  _inherits(Hash, _Interaction);

  function Hash(cfg) {
    var _this;

    _classCallCheck(this, Hash);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Hash).call(this, _objectSpread({
      endEvent: 'camerachange'
    }, cfg)));
    window.addEventListener('hashchange', _this._onHashChange.bind(_assertThisInitialized(_this)), false);
    _this._updateHash = (0, _throttle["default"])(_this._updateHashUnthrottled.bind(_assertThisInitialized(_this)), 30 * 1000 / 100);
    return _this;
  }

  _createClass(Hash, [{
    key: "end",
    value: function end() {
      this._updateHash();
    }
  }, {
    key: "reset",
    value: function reset() {// this.layer._resetStyle();
    }
  }, {
    key: "_getHashString",
    value: function _getHashString() {
      var center = this.layer.getCenter(),
          zoom = Math.round(this.layer.getZoom() * 100) / 100,
          // derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
      precision = Math.ceil((zoom * Math.LN2 + Math.log(512 / 360 / 0.5)) / Math.LN10),
          m = Math.pow(10, precision),
          lng = Math.round(center.lng * m) / m,
          lat = Math.round(center.lat * m) / m,
          bearing = this.layer.getRotation(),
          pitch = this.layer.getPitch();
      var hash = '';
      hash += "#".concat(zoom, "/").concat(lat, "/").concat(lng);
      if (bearing || pitch) hash += "/".concat(Math.round(bearing * 10) / 10);
      if (pitch) hash += "/".concat(Math.round(pitch));
      return hash;
    }
  }, {
    key: "_onHashChange",
    value: function _onHashChange() {
      var loc = window.location.hash.replace('#', '').split('/');

      if (loc.length >= 3) {
        this.layer.setStatus({
          center: [+loc[2], +loc[1]],
          zoom: +loc[0],
          bearing: +(loc[3] || 0),
          pitch: +(loc[4] || 0)
        });
        return true;
      }

      return false;
    }
  }, {
    key: "_updateHashUnthrottled",
    value: function _updateHashUnthrottled() {
      var hash = this._getHashString();

      window.history.replaceState(window.history.state, '', hash);
    }
  }, {
    key: "destory",
    value: function destory() {
      window.removeEventListener('hashchange', this._onHashChange, false);
      this.layer.off('camerachange', this._updateHash);
      clearTimeout(this._updateHash());
      return this;
    }
  }]);

  return Hash;
}(_base["default"]);

exports["default"] = Hash;