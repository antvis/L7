"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

var _earcut = _interopRequireDefault(require("earcut"));

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

var ExtrudeButffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(ExtrudeButffer, _BufferBase);

  function ExtrudeButffer() {
    _classCallCheck(this, ExtrudeButffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExtrudeButffer).apply(this, arguments));
  }

  _createClass(ExtrudeButffer, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      layerData.forEach(function (feature) {
        _this._calculateTop(feature);

        _this._calculateWall(feature);

        delete feature.bufferInfo;
      });
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var _this2 = this;

      var layerData = this.get('layerData'); // 计算长

      layerData.forEach(function (feature) {
        var coordinates = feature.coordinates;
        var bufferInfo = {};

        var flattengeo = _earcut["default"].flatten(coordinates);

        var n = _this2.checkIsClosed(coordinates[0]) ? coordinates[0].length - 1 : coordinates[0].length;
        var vertices = flattengeo.vertices,
            dimensions = flattengeo.dimensions,
            holes = flattengeo.holes;
        var indexArray = (0, _earcut["default"])(vertices, holes, dimensions).map(function (v) {
          return _this2.verticesCount + v;
        });
        bufferInfo.vertices = vertices;
        bufferInfo.indexArray = indexArray;
        bufferInfo.verticesOffset = _this2.verticesCount + 0;
        bufferInfo.indexOffset = _this2.indexCount + 0;
        bufferInfo.faceNum = n;
        _this2.indexCount += indexArray.length + n * 6;
        _this2.verticesCount += vertices.length / 3 + n * 4;
        feature.bufferInfo = bufferInfo;
      });
    }
  }, {
    key: "_calculateTop",
    value: function _calculateTop(feature) {
      var size = feature.size;
      var _feature$bufferInfo = feature.bufferInfo,
          indexArray = _feature$bufferInfo.indexArray,
          vertices = _feature$bufferInfo.vertices,
          indexOffset = _feature$bufferInfo.indexOffset,
          verticesOffset = _feature$bufferInfo.verticesOffset;
      var pointCount = vertices.length / 3;

      this._encodeArray(feature, vertices.length / 3); // 添加顶点


      for (var i = 0; i < pointCount; i++) {
        this.attributes.positions.set([vertices[i * 3], vertices[i * 3 + 1], size], (verticesOffset + i) * 3); // 顶部文理坐标计算

        if (this.get('uv')) {
          // TODO 用过BBox计算纹理坐标
          this.attributes.uv.set([-1, -1], (verticesOffset + i) * 2);
        }
      }

      feature.bufferInfo.verticesOffset += pointCount; // 添加顶点索引

      this.indexArray.set(indexArray, indexOffset); // 顶部坐标

      feature.bufferInfo.indexOffset += indexArray.length;
    }
  }]);

  return ExtrudeButffer;
}(_buffer["default"]);

exports["default"] = ExtrudeButffer;