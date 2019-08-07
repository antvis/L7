"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextMaterial = void 0;

var _r3Base = require("@ali/r3-base");

var _r3Material = require("@ali/r3-material");

var _text_frag = _interopRequireDefault(require("../shader/text_frag.glsl"));

var _text_vert = _interopRequireDefault(require("../shader/text_vert.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var TextMaterial =
/*#__PURE__*/
function (_Material) {
  _inherits(TextMaterial, _Material);

  function TextMaterial(opt) {
    var _this;

    _classCallCheck(this, TextMaterial);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextMaterial).call(this, opt.name)); // this._generateTechnique();

    for (var item in opt) {
      if (item.substr(0, 2) === 'u_') {
        _this.setValue(item, opt[item]);
      }
    }

    return _this;
  }

  _createClass(TextMaterial, [{
    key: "_generateTechnique",
    value: function _generateTechnique() {
      var VERT_SHADER = _text_vert.default; // 片元着色器

      var FRAG_SHADER = _text_frag.default; // Technique 配置信息

      var cfg = {
        attributes: {
          a_position: {
            name: 'a_position',
            semantic: 'POSITION',
            type: _r3Base.DataType.FLOAT_VEC4
          },
          a_color: {
            name: 'a_color',
            semantic: 'COLOR',
            type: _r3Base.DataType.FLOAT_VEC4
          },
          a_uv: {
            name: 'a_uv',
            semantic: 'TEXCOORD_0',
            type: _r3Base.DataType.FLOAT_VEC2
          }
        },
        uniforms: {
          matModelViewProjection: {
            name: 'matModelViewProjection',
            semantic: _r3Base.UniformSemantic.MODELVIEWPROJECTION,
            type: _r3Base.DataType.FLOAT_MAT4
          },
          u_model: {
            name: 'u_model',
            semantic: _r3Base.UniformSemantic.MODEL,
            type: _r3Base.DataType.FLOAT_MAT4
          },
          u_view: {
            name: 'u_view',
            semantic: _r3Base.UniformSemantic.VIEW,
            type: _r3Base.DataType.FLOAT_MAT4
          },
          u_projection: {
            name: 'u_projection',
            semantic: _r3Base.UniformSemantic.PROJECTION,
            type: _r3Base.DataType.FLOAT_MAT4
          },
          u_texture: {
            name: 'u_texture',
            type: _r3Base.DataType.SAMPLER_2D
          },
          u_stroke: {
            name: 'u_stroke',
            type: _r3Base.DataType.FLOAT_VEC4
          },
          u_strokeWidth: {
            name: 'u_strokeWidth',
            type: _r3Base.DataType.FLOAT
          },
          u_textSize: {
            name: 'u_textSize',
            type: _r3Base.DataType.FLOAT_VEC2
          },
          u_color: {
            name: 'u_color',
            type: _r3Base.DataType.FLOAT_VEC4
          },
          u_buffer: {
            name: 'u_buffer',
            type: _r3Base.DataType.FLOAT
          },
          u_scale: {
            name: 'u_scale',
            type: _r3Base.DataType.FLOAT_MAT4
          },
          u_gamma: {
            name: 'u_gamma',
            type: _r3Base.DataType.FLOAT
          }
        }
      }; // 创建 Technique

      var tech = new _r3Material.RenderTechnique('TextMaterial');
      tech.states = {
        disable: [_r3Base.RenderState.CULL_FACE, _r3Base.RenderState.DEPTH_TEST],
        enable: [_r3Base.RenderState.BLEND],
        functions: {
          blendFunc: [_r3Base.BlendFunc.SRC_ALPHA, _r3Base.BlendFunc.ONE_MINUS_SRC_ALPHA]
        }
      };
      tech.isValid = true;
      tech.uniforms = cfg.uniforms;
      tech.attributes = cfg.attributes;
      tech.vertexShader = VERT_SHADER;
      tech.fragmentShader = FRAG_SHADER;
      tech.customMacros = this._macros;
      this._technique = tech;
    }
  }, {
    key: "prepareDrawing",
    value: function prepareDrawing(camera, component, primitive) {
      this.getAttributeDefines(camera, component, primitive);

      if (!this._technique) {
        this._generateTechnique();
      }

      _get(_getPrototypeOf(TextMaterial.prototype), "prepareDrawing", this).call(this, camera, component, primitive);
    }
  }, {
    key: "getAttributeDefines",
    value: function getAttributeDefines(camera, component, primitive) {
      this._macros = [];
      if (!primitive) return this._macros;
      var attribNames = Object.keys(primitive.vertexAttributes);

      if (attribNames.indexOf('SHAPE') !== -1) {
        this._macros.push('SHAPE');
      }

      if (attribNames.indexOf('TEXCOORD_0') !== -1) {
        this._macros.push('TEXCOORD_0');
      }
    }
  }]);

  return TextMaterial;
}(_r3Material.Material);

exports.TextMaterial = TextMaterial;