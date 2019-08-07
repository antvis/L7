"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _buffer = _interopRequireDefault(require("../buffer"));

var _polylineNormals = _interopRequireDefault(require("../../../util/polyline-normals"));

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

var MeshLineBuffer =
/*#__PURE__*/
function (_BufferBase) {
  _inherits(MeshLineBuffer, _BufferBase);

  function MeshLineBuffer() {
    _classCallCheck(this, MeshLineBuffer);

    return _possibleConstructorReturn(this, _getPrototypeOf(MeshLineBuffer).apply(this, arguments));
  }

  _createClass(MeshLineBuffer, [{
    key: "_buildFeatures",
    value: function _buildFeatures() {
      var _this = this;

      var layerData = this.get('layerData');
      layerData.forEach(function (feature) {
        _this._calculateLine(feature);

        delete feature.bufferInfo;
      });
    }
  }, {
    key: "_initAttributes",
    value: function _initAttributes() {
      _get(_getPrototypeOf(MeshLineBuffer.prototype), "_initAttributes", this).call(this);

      this.attributes.dashArray = new Float32Array(this.verticesCount);
      this.attributes.attrDistance = new Float32Array(this.verticesCount);
      this.attributes.totalDistances = new Float32Array(this.verticesCount);
      this.attributes.patterns = new Float32Array(this.verticesCount * 2);
      this.attributes.miters = new Float32Array(this.verticesCount);
      this.attributes.normals = new Float32Array(this.verticesCount * 3);
    }
  }, {
    key: "_calculateFeatures",
    value: function _calculateFeatures() {
      var _this2 = this;

      var layerData = this.get('layerData'); // 计算长

      layerData.forEach(function (feature) {
        var bufferInfo = {};
        var coordinates = feature.coordinates;

        if (Array.isArray(coordinates[0][0])) {
          coordinates = coordinates[0];
        }

        var _getNormals = (0, _polylineNormals["default"])(coordinates, false, _this2.verticesCount),
            normals = _getNormals.normals,
            attrIndex = _getNormals.attrIndex,
            attrPos = _getNormals.attrPos,
            attrDistance = _getNormals.attrDistance,
            miters = _getNormals.miters;

        bufferInfo.normals = normals;
        bufferInfo.arrayIndex = attrIndex;
        bufferInfo.positions = attrPos;
        bufferInfo.attrDistance = attrDistance;
        bufferInfo.miters = miters;
        bufferInfo.verticesOffset = _this2.verticesCount;
        bufferInfo.indexOffset = _this2.indexCount;
        _this2.verticesCount += attrPos.length / 3;
        _this2.indexCount += attrIndex.length;
        feature.bufferInfo = bufferInfo;
      });
    }
  }, {
    key: "_calculateLine",
    value: function _calculateLine(feature) {
      var _feature$bufferInfo = feature.bufferInfo,
          normals = _feature$bufferInfo.normals,
          arrayIndex = _feature$bufferInfo.arrayIndex,
          positions = _feature$bufferInfo.positions,
          attrDistance = _feature$bufferInfo.attrDistance,
          miters = _feature$bufferInfo.miters,
          verticesOffset = _feature$bufferInfo.verticesOffset,
          indexOffset = _feature$bufferInfo.indexOffset;

      var _this$get = this.get('style'),
          _this$get$dashArray = _this$get.dashArray,
          dashArray = _this$get$dashArray === void 0 ? 200 : _this$get$dashArray;

      this._encodeArray(feature, positions.length / 3);

      var totalLength = attrDistance[attrDistance.length - 1]; // 增加长度

      var totalDistances = Array(positions.length / 3).fill(totalLength); // 虚线比例

      var ratio = dashArray / totalLength;
      var dashArrays = Array(positions.length / 3).fill(ratio);
      this.attributes.positions.set(positions, verticesOffset * 3);
      this.indexArray.set(arrayIndex, indexOffset);
      this.attributes.miters.set(miters, verticesOffset);
      this.attributes.normals.set(normals, verticesOffset * 3);
      this.attributes.attrDistance.set(attrDistance, verticesOffset);
      this.attributes.totalDistances.set(totalDistances, verticesOffset);
      this.attributes.dashArray.set(dashArrays, verticesOffset);
    }
  }]);

  return MeshLineBuffer;
}(_buffer["default"]);

exports["default"] = MeshLineBuffer;