"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../core/base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var tileURLRegex = /\{([zxy])\}/g;

var VectorTileSource =
/*#__PURE__*/
function (_Base) {
  _inherits(VectorTileSource, _Base);

  function VectorTileSource(cfg, workerController) {
    var _this;

    _classCallCheck(this, VectorTileSource);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VectorTileSource).call(this, _objectSpread({
      type: 'vector'
    }, cfg)));
    _this.cfg = cfg;
    _this.workerController = workerController;
    _this.urlTemplate = _this.get('url');
    return _this;
  }

  _createClass(VectorTileSource, [{
    key: "loadTile",
    value: function loadTile(tileinfo, callback) {
      var tileId = tileinfo.id.split('_');

      var url = this._getTileURL({
        x: tileId[0],
        y: tileId[1],
        z: tileId[2]
      });

      var params = _objectSpread({
        id: tileinfo.id,
        type: 'vector'
      }, this.cfg, {
        url: url
      });

      tileinfo.workerID = this.workerController.send('loadTile', params, done.bind(this));

      function done(err, data) {
        // 收到数据，处理数据
        callback(err, data);
      }
    }
  }, {
    key: "abortTile",
    value: function abortTile(tileinfo) {
      this.workerController.send('abortTile', {
        id: tileinfo.id,
        type: this.get('type'),
        sourceID: this.get('sourceID')
      }, undefined, tileinfo.workerID);
    }
  }, {
    key: "unloadTile",
    value: function unloadTile(tileinfo) {
      this.workerController.send('removeTile', {
        id: tileinfo.id,
        type: this.get('type'),
        sourceID: this.get('sourceID')
      }, undefined, tileinfo.workerID);
    }
  }, {
    key: "_getTileURL",
    value: function _getTileURL(urlParams) {
      if (!urlParams.s) {
        // Default to a random choice of a, b or c
        urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
      }

      tileURLRegex.lastIndex = 0;
      return this.urlTemplate.replace(tileURLRegex, function (value, key) {
        return urlParams[key];
      });
    }
  }]);

  return VectorTileSource;
}(_base["default"]);

exports["default"] = VectorTileSource;