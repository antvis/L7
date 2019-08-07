"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeatmapIntensityMaterial = exports.HeatmapColorizeMaterial = void 0;

var THREE = _interopRequireWildcard(require("../../core/three"));

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HeatmapColorizeMaterial =
/*#__PURE__*/
function (_Material) {
  _inherits(HeatmapColorizeMaterial, _Material);

  _createClass(HeatmapColorizeMaterial, [{
    key: "getDefaultParameters",
    value: function getDefaultParameters() {
      return {
        uniforms: {
          u_intensity: {
            value: 1.0
          },
          u_texture: {
            value: null
          },
          u_rampColors: {
            value: 0
          },
          u_opacity: {
            value: 1
          }
        },
        defines: {}
      };
    }
  }]);

  function HeatmapColorizeMaterial(_uniforms) {
    var _this;

    var _defines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var parameters = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, HeatmapColorizeMaterial);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeatmapColorizeMaterial).call(this, parameters));

    var _this$getDefaultParam = _this.getDefaultParameters(),
        uniforms = _this$getDefaultParam.uniforms,
        defines = _this$getDefaultParam.defines;

    var _getModule = (0, _shaderModule.getModule)('heatmap_color'),
        vs = _getModule.vs,
        fs = _getModule.fs;

    _this.uniforms = Object.assign(uniforms, _this.setUniform(_uniforms));
    _this.type = 'HeatmapColorizeMaterial';
    _this.defines = Object.assign(defines, _defines);
    _this.vertexShader = vs;
    _this.fragmentShader = fs;
    _this.transparent = true;
    return _this;
  }

  return HeatmapColorizeMaterial;
}(_material["default"]);

exports.HeatmapColorizeMaterial = HeatmapColorizeMaterial;

var HeatmapIntensityMaterial =
/*#__PURE__*/
function (_Material2) {
  _inherits(HeatmapIntensityMaterial, _Material2);

  _createClass(HeatmapIntensityMaterial, [{
    key: "getDefaultParameters",
    value: function getDefaultParameters() {
      return {
        uniforms: {
          u_intensity: {
            value: 10.0
          },
          u_zoom: {
            value: 4
          },
          u_radius: {
            value: 10
          }
        },
        defines: {}
      };
    }
  }]);

  function HeatmapIntensityMaterial(_uniforms) {
    var _this2;

    var _defines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var parameters = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, HeatmapIntensityMaterial);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(HeatmapIntensityMaterial).call(this, parameters));

    var _this2$getDefaultPara = _this2.getDefaultParameters(),
        uniforms = _this2$getDefaultPara.uniforms,
        defines = _this2$getDefaultPara.defines;

    var _getModule2 = (0, _shaderModule.getModule)('heatmap_intensity'),
        vs = _getModule2.vs,
        fs = _getModule2.fs;

    _this2.uniforms = Object.assign(uniforms, _this2.setUniform(_uniforms));
    _this2.type = 'heatmap_intensity';
    _this2.defines = Object.assign(defines, _defines);
    _this2.vertexShader = vs;
    _this2.blending = THREE.AdditiveBlending;
    _this2.fragmentShader = fs;
    _this2.depthTest = false;
    _this2.transparent = true;
    return _this2;
  }

  return HeatmapIntensityMaterial;
}(_material["default"]);

exports.HeatmapIntensityMaterial = HeatmapIntensityMaterial;