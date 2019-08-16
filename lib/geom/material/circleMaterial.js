"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

var _deepMix = _interopRequireDefault(require("@antv/util/lib/deep-mix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CircleMaterial =
/*#__PURE__*/
function (_Material) {
  _inherits(CircleMaterial, _Material);

  function CircleMaterial(_uniforms) {
    var _this;

    var _defines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var parameters = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, CircleMaterial);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CircleMaterial).call(this, parameters));

    var _getModule = (0, _shaderModule.getModule)('circle'),
        vs = _getModule.vs,
        fs = _getModule.fs,
        uniforms = _getModule.uniforms;

    _this.uniforms = (0, _shaderModule.wrapUniforms)((0, _deepMix["default"])(uniforms, _uniforms));
    _this.defines = _defines;
    _this.type = 'CircleMaterial';
    _this.vertexShader = vs;
    _this.fragmentShader = fs;
    _this.transparent = true;
    return _this;
  }

  return CircleMaterial;
}(_material["default"]);

exports["default"] = CircleMaterial;