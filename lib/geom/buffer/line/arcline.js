"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ArcLineBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(ArcLineBuffer, _BufferBase);

  function ArcLineBuffer() {
    _classCallCheck(this, ArcLineBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(ArcLineBuffer).apply(this, arguments));
  }

  _createClass(ArcLineBuffer, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      layerData.forEach(function (feature, index) {
        _this._calculateArc(feature, index);
      });
    }
  }, {
    key: "_initAttributes",
    value: function _initAttributes() {
      _get(_getPrototypeOf(ArcLineBuffer.prototype), "_initAttributes", this).call(this);

      this.attributes.instanceArray = new Float32Array(this.verticesCount * 4);
    }
  }, {
    key: "_calculateArc",
    value: function _calculateArc(feature, offset) {
      var _this2 = this;

      var _this$get = this.get('style'),
          _this$get$segNum = _this$get.segNum,
          segNum = _this$get$segNum === void 0 ? 30 : _this$get$segNum;

      var coordinates = feature.coordinates;

      var _loop = function _loop(i) {
        _this2.attributes.positions.set([i, 1, i, i, -1, i], offset * segNum * 6 + i * 6);

        _this2.attributes.instanceArray.set([coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1], coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1]], offset * segNum * 8 + i * 8);

        if (i !== segNum - 1) {
          var indexArray = [0, 1, 2, 1, 3, 2].map(function (v) {
            return offset * segNum * 2 + i * 2 + v;
          });

          _this2.indexArray.set(indexArray, offset * segNum * 6 + i * 6 - offset * 6);
        }
      };

      for (var i = 0; i < segNum; i++) {
        _loop(i);
      }

      feature.bufferInfo = {
        verticesOffset: offset * segNum * 2
      };

      this._encodeArray(feature, segNum * 2);
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var layerData = this.get('layerData');
      var segNum = this.get('segNum') || 30;
      this.verticesCount = layerData.length * segNum * 2;
      this.indexCount = this.verticesCount * 3 - layerData.length * 6;
    }
  }]);

  return ArcLineBuffer;
}(_buffer["default"]);

exports["default"] = ArcLineBuffer;