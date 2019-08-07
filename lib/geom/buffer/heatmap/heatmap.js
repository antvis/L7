"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createColorRamp = createColorRamp;
exports["default"] = void 0;

var _colorscales = require("../../../attr/colorscales");

var THREE = _interopRequireWildcard(require("../../../core/three"));

var _base = _interopRequireDefault(require("../../../core/base"));

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

var HeatmapBuffer =
/*#__PURE__*/
function (_Base) {
  _inherits(HeatmapBuffer, _Base);

  function HeatmapBuffer(cfg) {
    var _this;

    _classCallCheck(this, HeatmapBuffer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeatmapBuffer).call(this, cfg));

    _this.init();

    return _this;
  }

  _createClass(HeatmapBuffer, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var data = this.get('data');
      var positions = [];
      var dirs = [];
      var weights = []; // const indices = [];
      // 组织顶点数据

      data.forEach(function (d) {
        // const totalIndex = index * 4;
        var coord = d.coordinates;
        var weight = d.size;

        var dir = _this2._addDir(-1, 1);

        var dir1 = _this2._addDir(1, 1);

        var dir2 = _this2._addDir(-1, -1);

        var dir3 = _this2._addDir(1, -1);

        positions.push.apply(positions, _toConsumableArray(coord).concat(_toConsumableArray(coord), _toConsumableArray(coord), _toConsumableArray(coord), _toConsumableArray(coord), _toConsumableArray(coord)));
        dirs.push.apply(dirs, _toConsumableArray(dir).concat(_toConsumableArray(dir2), _toConsumableArray(dir3), _toConsumableArray(dir1), _toConsumableArray(dir), _toConsumableArray(dir3)));
        weights.push(weight, weight, weight, weight, weight, weight); // indices.push(totalIndex, totalIndex + 2, totalIndex + 3, totalIndex, totalIndex + 3, totalIndex + 1);
      });
      this.attributes = {
        vertices: positions,
        // indices,
        dirs: dirs,
        weights: weights
      };
    }
  }, {
    key: "_addVertex",
    value: function _addVertex(position, dirX, dirY) {
      var x = position[0] * 2 + (dirX + 1) / 2;
      var y = position[1] * 2 + (dirY + 1) / 2;
      var z = position[2];
      return [x, y, z];
    }
  }, {
    key: "_addDir",
    value: function _addDir(dirX, dirY) {
      var x = (dirX + 1) / 2;
      var y = (dirY + 1) / 2;
      return [x, y];
    }
  }]);

  return HeatmapBuffer;
}(_base["default"]);

exports["default"] = HeatmapBuffer;

function createColorRamp(colors) {
  var colorImageData = getColorRamp(colors);
  var colorTexture = getTexture(colorImageData);
  return colorTexture;
}

function getColorRamp(name) {
  var colorscale = name;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 1;
  canvas.height = 256;
  var gradient = ctx.createLinearGradient(0, 0, 0, 256);
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
    ctx.fillRect(0, 0, 1, 256);
    data = new Uint8ClampedArray(ctx.getImageData(0, 0, 1, 256).data);
  }

  if (Object.prototype.toString.call(colorscale) === '[object Uint8Array]') {
    data = ctx.createImageData(1, 256);
  }

  return new ImageData(data, 1, 256);
}

function getTexture(image) {
  var texture = new THREE.Texture(image);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.needsUpdate = true;
  return texture;
}