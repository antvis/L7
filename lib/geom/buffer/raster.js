"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RasterBuffer = void 0;

var _colorscales = require("../../attr/colorscales");

var THREE = _interopRequireWildcard(require("../../core/three"));

var _base = _interopRequireDefault(require("../../core/base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RasterBuffer =
/*#__PURE__*/
function (_Base) {
  _inherits(RasterBuffer, _Base);

  function RasterBuffer(cfg) {
    var _this;

    _classCallCheck(this, RasterBuffer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RasterBuffer).call(this, cfg));

    _this.init();

    return _this;
  }

  _createClass(RasterBuffer, [{
    key: "init",
    value: function init() {
      var layerData = this.get('layerData');
      var _layerData$dataArray$ = layerData.dataArray[0],
          coordinates = _layerData$dataArray$.coordinates,
          width = _layerData$dataArray$.width,
          data = _layerData$dataArray$.data,
          height = _layerData$dataArray$.height;
      var positions = [].concat(_toConsumableArray(coordinates[0]), [coordinates[1][0], coordinates[0][1], 0], _toConsumableArray(coordinates[1]), _toConsumableArray(coordinates[0]), _toConsumableArray(coordinates[1]), [coordinates[0][0], coordinates[1][1], 0]);
      var imgPosUv = [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0];
      var size = this.get('size');
      var texture = new THREE.DataTexture(new Float32Array(data), width, height, THREE.LuminanceFormat, THREE.FloatType);
      texture.needsUpdate = true;
      var colors = this.get('rampColors');
      var colorImageData = this.getColorRamp(colors);

      var colorTexture = this._getTexture(colorImageData); // 颜色纹理


      this.position = positions;
      this.uv = imgPosUv;
      this.u_raster = texture; //

      this.u_extent = [coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1]];
      this.u_colorTexture = colorTexture; // 颜色表‘=

      var triangles = this._buildTriangles(width, height, size, this.u_extent);

      var attributes = {
        vertices: new Float32Array(triangles.vertices),
        uvs: new Float32Array(triangles.uvs),
        indices: triangles.indices,
        dimension: triangles.dimension
      };
      this.attributes = attributes;
    }
  }, {
    key: "getColorRamp",
    value: function getColorRamp(name) {
      var colorscale = name;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 1;
      var gradient = ctx.createLinearGradient(0, 0, 256, 0);
      var data = null;

      if (typeof colorscale === 'string') {
        colorscale = _colorscales.colorScales[name];
      }

      if (Object.prototype.toString.call(colorscale) === '[object Object]') {
        var min = colorscale.positions[0];
        var max = colorscale.positions[colorscale.positions.length - 1];

        for (var i = 0; i < colorscale.colors.length; ++i) {
          var value = (colorscale.positions[i] - min) / (max - min);
          gradient.addColorStop(value, colorscale.colors[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 1);
        data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
      }

      if (Object.prototype.toString.call(colorscale) === '[object Uint8Array]') {
        data = ctx.createImageData(256, 1);
      }

      return new ImageData(data, 16, 16);
    }
    /**
     * 颜色纹理
     * @param {*} image 颜色图片
     * @return {texture} texture
     */

  }, {
    key: "_getTexture",
    value: function _getTexture(image) {
      var texture1 = new THREE.Texture(image);
      texture1.magFilter = THREE.LinearFilter;
      texture1.minFilter = THREE.LinearFilter;
      texture1.format = THREE.RGBAFormat;
      texture1.type = THREE.UnsignedByteType;
      texture1.generateMipmaps = true;
      texture1.needsUpdate = true;
      return texture1;
    }
  }, {
    key: "_buildTriangles",
    value: function _buildTriangles(width, height) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
      var extent = arguments.length > 3 ? arguments[3] : undefined;
      // const extent = [ 73.482190241, 3.82501784112, 135.106618732, 57.6300459963 ]
      var indices = [];
      var vertices = [];
      var uvs = [];
      var gridX = Math.floor(width / size);
      var gridY = Math.floor(height / size);
      var gridX1 = gridX + 1;
      var gridY1 = gridY + 1;
      var stepX = (extent[2] - extent[0]) / gridX1;
      var stepY = (extent[3] - extent[1]) / gridY1;

      for (var i = 0; i < gridY1; i++) {
        var y = i * size;

        for (var j = 0; j < gridX1; j++) {
          var x = j * size;
          vertices.push(extent[0] + x * stepX, (height - y) * stepY + extent[1], 0);
          uvs.push(j / gridX);
          uvs.push(i / gridY);
        }
      }

      for (var iy = 0; iy < gridY; iy++) {
        for (var ix = 0; ix < gridX; ix++) {
          var a = ix + gridX1 * iy;
          var b = ix + gridX1 * (iy + 1);
          var c = ix + 1 + gridX1 * (iy + 1);
          var d = ix + 1 + gridX1 * iy;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      return {
        uvs: uvs,
        indices: indices,
        vertices: vertices,
        dimension: [gridX, gridY]
      };
    }
  }]);

  return RasterBuffer;
}(_base["default"]);

exports.RasterBuffer = RasterBuffer;