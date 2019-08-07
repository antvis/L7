"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("../../core/three"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var blendingEnum = {
  normal: 'NormalBlending',
  additive: 'AdditiveBlending',
  subtractive: 'SubtractiveBlending'
};

var Material =
/*#__PURE__*/
function (_THREE$ShaderMaterial) {
  _inherits(Material, _THREE$ShaderMaterial);

  function Material() {
    _classCallCheck(this, Material);

    return _possibleConstructorReturn(this, _getPrototypeOf(Material).apply(this, arguments));
  }

  _createClass(Material, [{
    key: "setUniformsValue",
    value: function setUniformsValue(name, value) {
      if (!this.uniforms[name]) {
        return;
      }

      this.uniforms[name].value = value;
      this.uniforms.needsUpdate = true;
    }
  }, {
    key: "setDefinesvalue",
    value: function setDefinesvalue(name, value) {
      this.defines[name] = value;
      this.needsUpdate = true;
    }
  }, {
    key: "setUniform",
    value: function setUniform(option) {
      var uniforms = {};

      for (var key in option) {
        if (key.substr(0, 2) === 'u_') {
          uniforms[key] = {
            value: option[key]
          };
        }
      }

      return uniforms;
    }
  }, {
    key: "updateUninform",
    value: function updateUninform(option) {
      for (var key in option) {
        if (key.substr(0, 2) === 'u_') {
          this.setUniformsValue(key, option[key]);
        }
      }
    }
  }, {
    key: "setBending",
    value: function setBending(type) {
      this.blending = THREE[blendingEnum[type]] || THREE.NormalBlending;
    }
  }]);

  return Material;
}(THREE.ShaderMaterial);

exports["default"] = Material;