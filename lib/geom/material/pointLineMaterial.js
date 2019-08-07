"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _material = _interopRequireDefault(require("./material"));

var _shaderModule = require("../../util/shaderModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PointLineMaterial =
/*#__PURE__*/
function (_Material) {
  _inherits(PointLineMaterial, _Material);

  _createClass(PointLineMaterial, [{
    key: "getDefaultParameters",
    value: function getDefaultParameters() {
      return {
        uniforms: {
          u_strokeOpacity: {
            value: 1
          },
          u_stroke: {
            value: [1.0, 1.0, 1.0, 1.0]
          },
          u_strokeWidth: {
            value: 1.0
          },
          u_zoom: {
            value: 10
          },
          u_activeId: {
            value: 0
          },
          u_activeColor: {
            value: [1.0, 0, 0, 1.0]
          }
        }
      };
    }
  }]);

  function PointLineMaterial(_uniforms, _defines, parameters) {
    var _this;

    _classCallCheck(this, PointLineMaterial);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PointLineMaterial).call(this, parameters));

    var _this$getDefaultParam = _this.getDefaultParameters(),
        uniforms = _this$getDefaultParam.uniforms;

    var _getModule = (0, _shaderModule.getModule)('pointline'),
        vs = _getModule.vs,
        fs = _getModule.fs;

    _this.uniforms = Object.assign(uniforms, _this.setUniform(_uniforms));
    _this.type = 'PointLineMaterial';
    _this.vertexShader = vs;
    _this.fragmentShader = fs;
    _this.transparent = true;
    return _this;
  }

  return PointLineMaterial;
}(_material["default"]);

exports["default"] = PointLineMaterial;