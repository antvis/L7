"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerModule = registerModule;
exports.getModule = getModule;
exports.wrapUniforms = wrapUniforms;
exports.generateLightingUniforms = generateLightingUniforms;

var _uniq = _interopRequireDefault(require("@antv/util/lib/uniq"));

var _isString = _interopRequireDefault(require("@antv/util/lib/is-string"));

var _colorUtil = _interopRequireDefault(require("../attr/color-util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SHADER_TYPE = {
  VS: 'vs',
  FS: 'fs'
};
var moduleCache = {};
var rawContentCache = {};
var precisionRegExp = /precision\s+(high|low|medium)p\s+float/;
var globalDefaultprecision = '#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float;\n#endif\n';
var globalDefaultAttribute = 'attribute float pickingId;\n  #ifdef PICK \n varying vec4 worldId; \n #endif \n';
var globalFSDefaultAttribute = '#ifdef PICK \n varying vec4 worldId; \n #endif \n';
var globalDefaultInclude = '#pragma include "pick_color"\n';
var includeRegExp = /#pragma include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;
var uniformRegExp = /uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g;

function processModule(rawContent, includeList, type) {
  var compiled = rawContent.replace(includeRegExp, function (_, strMatch) {
    var includeOpt = strMatch.split(' ');
    var includeName = includeOpt[0].replace(/"/g, '');

    if (includeList.indexOf(includeName) > -1) {
      return '';
    }

    var txt = rawContentCache[includeName][type];
    includeList.push(includeName);

    var _processModule = processModule(txt, includeList, type),
        content = _processModule.content;

    return content;
  });
  return {
    content: compiled,
    includeList: includeList
  };
}

function getUniformLengthByType(type) {
  var arrayLength = 0;

  switch (type) {
    case 'vec2':
    case 'ivec2':
      arrayLength = 2;
      break;

    case 'vec3':
    case 'ivec3':
      arrayLength = 3;
      break;

    case 'vec4':
    case 'ivec4':
    case 'mat2':
      arrayLength = 4;
      break;

    case 'mat3':
      arrayLength = 9;
      break;

    case 'mat4':
      arrayLength = 16;
      break;

    default:
  }

  return arrayLength;
}

function extractUniforms(content) {
  var uniforms = {};
  content = content.replace(uniformRegExp, function (_, type, c) {
    var defaultValues = c.split(':');
    var uniformName = defaultValues[0].trim();
    var defaultValue = '';

    if (defaultValues.length > 1) {
      defaultValue = defaultValues[1].trim();
    } // set default value for uniform according to its type
    // eg. vec2 u -> [0.0, 0.0]


    switch (type) {
      case 'bool':
        defaultValue = defaultValue === 'true';
        break;

      case 'float':
      case 'int':
        defaultValue = Number(defaultValue);
        break;

      case 'vec2':
      case 'vec3':
      case 'vec4':
      case 'ivec2':
      case 'ivec3':
      case 'ivec4':
      case 'mat2':
      case 'mat3':
      case 'mat4':
        if (defaultValue) {
          defaultValue = defaultValue.replace('[', '').replace(']', '').split(',').reduce(function (prev, cur) {
            prev.push(Number(cur.trim()));
            return prev;
          }, []);
        } else {
          defaultValue = new Array(getUniformLengthByType(type)).fill(0);
        }

        break;

      default:
    }

    uniforms[uniformName] = defaultValue;
    return "uniform ".concat(type, " ").concat(uniformName, ";\n");
  });
  return {
    content: content,
    uniforms: uniforms
  };
}

function registerModule(moduleName, _ref) {
  var _rawContentCache$modu;

  var vs = _ref.vs,
      fs = _ref.fs,
      declaredUniforms = _ref.uniforms;

  var _extractUniforms = extractUniforms(vs),
      extractedVS = _extractUniforms.content,
      vsUniforms = _extractUniforms.uniforms;

  var _extractUniforms2 = extractUniforms(fs),
      extractedFS = _extractUniforms2.content,
      fsUniforms = _extractUniforms2.uniforms;

  rawContentCache[moduleName] = (_rawContentCache$modu = {}, _defineProperty(_rawContentCache$modu, SHADER_TYPE.VS, extractedVS), _defineProperty(_rawContentCache$modu, SHADER_TYPE.FS, extractedFS), _defineProperty(_rawContentCache$modu, "uniforms", _objectSpread({}, vsUniforms, {}, fsUniforms, {}, declaredUniforms)), _rawContentCache$modu);
}

function getModule(moduleName) {
  var _moduleCache$moduleNa;

  if (moduleCache[moduleName]) {
    return moduleCache[moduleName];
  }

  var rawVS = rawContentCache[moduleName][SHADER_TYPE.VS];
  var rawFS = rawContentCache[moduleName][SHADER_TYPE.FS];
  rawVS = globalDefaultAttribute + globalDefaultInclude + rawVS;
  rawFS = globalFSDefaultAttribute + rawFS;

  var _processModule2 = processModule(rawVS, [], SHADER_TYPE.VS),
      vs = _processModule2.content,
      vsIncludeList = _processModule2.includeList;

  var _processModule3 = processModule(rawFS, [], SHADER_TYPE.FS),
      fs = _processModule3.content,
      fsIncludeList = _processModule3.includeList; // TODO: extract uniforms and their default values from GLSL


  var uniforms = (0, _uniq["default"])(vsIncludeList.concat(fsIncludeList).concat(moduleName)).reduce(function (prev, cur) {
    return _objectSpread({}, prev, {}, rawContentCache[cur].uniforms);
  }, {});
  /**
   * set default precision for fragment shader
   * https://stackoverflow.com/questions/28540290/why-it-is-necessary-to-set-precision-for-the-fragment-shader
   */

  if (!precisionRegExp.test(fs)) {
    fs = globalDefaultprecision + fs;
  }

  moduleCache[moduleName] = (_moduleCache$moduleNa = {}, _defineProperty(_moduleCache$moduleNa, SHADER_TYPE.VS, vs.trim()), _defineProperty(_moduleCache$moduleNa, SHADER_TYPE.FS, fs.trim()), _defineProperty(_moduleCache$moduleNa, "uniforms", uniforms), _moduleCache$moduleNa);
  return moduleCache[moduleName];
}

function wrapUniforms(uniforms) {
  return Object.keys(uniforms).reduce(function (prev, cur) {
    prev[cur] = {
      value: uniforms[cur]
    };
    return prev;
  }, {});
}

var DEFAULT_LIGHT = {
  type: 'directional',
  // direction: [ 1, 10.5, 12 ],
  direction: [0, -10.5, 1],
  ambient: [0.2, 0.2, 0.2],
  diffuse: [0.6, 0.6, 0.6],
  specular: [0.1, 0.1, 0.1]
};
var DEFAULT_DIRECTIONAL_LIGHT = {
  direction: [0, 0, 0],
  ambient: [0, 0, 0],
  diffuse: [0, 0, 0],
  specular: [0, 0, 0]
};
var DEFAULT_SPOT_LIGHT = {
  position: [0, 0, 0],
  direction: [0, 0, 0],
  ambient: [0, 0, 0],
  diffuse: [0, 0, 0],
  specular: [0, 0, 0],
  constant: 1,
  linear: 0,
  quadratic: 0,
  angle: 14,
  exponent: 40,
  blur: 5
};
var COLOR_ATTRIBUTES = ['ambient', 'diffuse', 'specular'];

function generateLightingUniforms(lights) {
  var lightsMap = {
    u_directional_lights: new Array(3).fill(_objectSpread({}, DEFAULT_DIRECTIONAL_LIGHT)),
    u_num_of_directional_lights: 0,
    u_spot_lights: new Array(3).fill(_objectSpread({}, DEFAULT_SPOT_LIGHT)),
    u_num_of_spot_lights: 0
  };

  if (!lights || !lights.length) {
    lights = [DEFAULT_LIGHT];
  }

  lights.forEach(function (_ref2, i) {
    var type = _ref2.type,
        rest = _objectWithoutProperties(_ref2, ["type"]);

    var lightsUniformName = "u_".concat(type, "_lights");
    var lightsNumUniformName = "u_num_of_".concat(type, "_lights");
    Object.keys(rest).forEach(function (key) {
      if ((0, _isString["default"])(rest[key]) && COLOR_ATTRIBUTES.indexOf(key) > -1) {
        rest[key] = _colorUtil["default"].color2RGBA(rest[key]).slice(0, 3);
      }
    });
    lightsMap[lightsUniformName][i] = _objectSpread({}, lightsMap[lightsUniformName][i], {}, rest);
    lightsMap[lightsNumUniformName]++;
  });
  return lightsMap;
}