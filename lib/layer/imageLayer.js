"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layer = _interopRequireDefault(require("../core/layer"));

var THREE = _interopRequireWildcard(require("../core/three"));

var _image = _interopRequireDefault(require("../geom/buffer/image"));

var _imageMaterial = _interopRequireDefault(require("../geom/material/imageMaterial"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var imageLayer =
/*#__PURE__*/
function (_Layer) {
  _inherits(imageLayer, _Layer);

  function imageLayer() {
    _classCallCheck(this, imageLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(imageLayer).apply(this, arguments));
  }

  _createClass(imageLayer, [{
    key: "draw",
    value: function draw() {
      var _this = this;

      this.type = 'image';
      var source = this.layerSource;

      var _this$get = this.get('styleOptions'),
          opacity = _this$get.opacity; // 加载 完成事件


      source.originData.images.then(function (images) {
        _this.layerData[0].images = images;
        var buffer = new _image["default"]({
          layerData: _this.layerData
        });

        _this.initGeometry(buffer.attributes);

        var material = new _imageMaterial["default"]({
          u_texture: buffer.texture,
          u_opacity: opacity
        });
        var imageMesh = new THREE.Mesh(_this.geometry, material);

        _this.add(imageMesh);
      });
      return this;
    }
  }, {
    key: "initGeometry",
    value: function initGeometry(attributes) {
      this.geometry = new THREE.BufferGeometry();
      this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
      this.geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
    }
  }]);

  return imageLayer;
}(_layer["default"]);

exports["default"] = imageLayer;