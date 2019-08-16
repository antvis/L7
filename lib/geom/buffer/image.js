"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var THREE = _interopRequireWildcard(require("../../core/three"));

var _base = _interopRequireDefault(require("../../core/base"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var ImageBuffer =
/*#__PURE__*/
function (_Base) {
  _inherits(ImageBuffer, _Base);

  function ImageBuffer(cfg) {
    var _this;

    _classCallCheck(this, ImageBuffer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageBuffer).call(this, cfg));

    _this.init();

    return _this;
  }

  _createClass(ImageBuffer, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var layerData = this.get('layerData');
      var coordinates = layerData[0].coordinates;
      var images = layerData[0].images;
      var positions = [].concat(_toConsumableArray(coordinates[0]), [coordinates[1][0], coordinates[0][1], 0], _toConsumableArray(coordinates[1]), _toConsumableArray(coordinates[0]), _toConsumableArray(coordinates[1]), [coordinates[0][0], coordinates[1][1], 0]);
      var image = images;

      if (_util["default"].isArray(images)) {
        image = images[0];
        var textures = images.map(function (img) {
          return _this2._getTexture(img);
        });
        this.u_rasters = textures;
      }

      var uv = [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0];
      var texture = new THREE.Texture(image);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.needsUpdate = true;
      var attributes = {
        vertices: new Float32Array(positions),
        uvs: new Float32Array(uv)
      };
      this.attributes = attributes;
      this.texture = texture;
    }
  }, {
    key: "_getTexture",
    value: function _getTexture(image) {
      var texture = new THREE.Texture(image);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
    }
  }]);

  return ImageBuffer;
}(_base["default"]);

exports["default"] = ImageBuffer;