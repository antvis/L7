"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _shape = require("../shape");

var _bufferBase = _interopRequireDefault(require("./bufferBase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PolygonBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(PolygonBuffer, _BufferBase);

  function PolygonBuffer() {
    _classCallCheck(this, PolygonBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(PolygonBuffer).apply(this, arguments));
  }

  _createClass(PolygonBuffer, [{
    key: "geometryBuffer",
    value: function geometryBuffer() {
      var layerData = this.get('layerData');
      var shape = this.get('shape');
      var positions = [];
      var faceUv = [];
      var sizes = [];
      var positionsIndex = [];
      var indexCount = 0;
      this.bufferStruct.style = layerData;
      var isExtrude = layerData[0].hasOwnProperty('size'); // indices, normals, colors, UVs

      layerData.forEach(function (item) {
        var heightValue = item.size;

        var extrudeData = _shape.polygonShape[shape](item.coordinates);

        if (isExtrude && shape === 'extrude') {
          extrudeData = _shape.polygonShape.extrude(item.coordinates);
          extrudeData.positions = extrudeData.positions.map(function (pos) {
            pos[2] *= heightValue;
            return pos;
          });
        }

        positions.push(extrudeData.positions);

        if (shape !== 'line') {
          // faceUv.push(...extrudeData.faceUv);
          var count = extrudeData.faceUv.length / 2;

          for (var i = 0; i < count; i++) {
            // uv 系数生成等大小的窗户
            var x = extrudeData.faceUv[i * 2];
            var y = extrudeData.faceUv[i * 2 + 1];

            if (x !== -1) {
              x = x * 0.1;
              y = y * heightValue / 2000;
            }

            faceUv.push(x, y);
            sizes.push((1.0 - extrudeData.faceUv[i * 2 + 1]) * heightValue);
          }
        }

        indexCount += extrudeData.positionsIndex.length;
        positionsIndex.push(extrudeData.positionsIndex);
      });
      this.bufferStruct.indices = positionsIndex;
      this.bufferStruct.position = positions;
      this.bufferStruct.indexCount = indexCount;
      this.bufferStruct.style = layerData;
      this.bufferStruct.faceUv = faceUv;
      this.bufferStruct.sizes = sizes;

      if (shape !== 'line') {
        this.attributes = this._toPolygonAttributes(this.bufferStruct);
        this.faceTexture = this._generateTexture();
      } else {
        this.attributes = this._toPolygonLineAttributes(this.bufferStruct);
      }
    }
  }]);

  return PolygonBuffer;
}(_bufferBase["default"]);

exports["default"] = PolygonBuffer;