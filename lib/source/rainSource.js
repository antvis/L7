"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RainSource = void 0;

var _imageSource2 = _interopRequireDefault(require("./imageSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RainSource =
/*#__PURE__*/
function (_imageSource) {
  _inherits(RainSource, _imageSource);

  function RainSource() {
    _classCallCheck(this, RainSource);

    return _possibleConstructorReturn(this, _getPrototypeOf(RainSource).apply(this, arguments));
  }

  _createClass(RainSource, [{
    key: "prepareData",
    value: function prepareData() {
      var extent = this.get('extent');

      var lb = this._coorConvert(extent.slice(0, 2));

      var tr = this._coorConvert(extent.slice(2, 4));

      this.extent = [lb, tr];
      this.propertiesData = [];

      this._genaratePoints();

      this._loadData();
    }
  }, {
    key: "_genaratePoints",
    value: function _genaratePoints() {
      var numParticles = 512 * 512;
      var particleRes = this.particleRes = Math.ceil(Math.sqrt(numParticles));
      var numPoints = particleRes * particleRes;
      var particleState = [];
      var particleState0 = new Uint8ClampedArray(numPoints * 4);
      var particleState1 = new Uint8ClampedArray(numPoints * 4);
      var emptyPixels = new Uint8ClampedArray(numPoints * 4);

      for (var i = 0; i < particleState0.length; i++) {
        particleState0[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
      }

      this.particleIndices = new Float32Array(numPoints);

      for (var _i = 0; _i < numPoints; _i++) {
        this.particleIndices[_i] = _i;
      }

      this.particleImage0 = new ImageData(particleState0, particleRes, particleRes);
      this.particleImage1 = new ImageData(particleState1, particleRes, particleRes);
      this.backgroundImage = new ImageData(emptyPixels, particleRes, particleRes);
      this.geoData = particleState;
    }
  }]);

  return RainSource;
}(_imageSource2.default);

exports.RainSource = RainSource;