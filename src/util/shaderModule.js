import uniq from '@antv/util/lib/uniq';
import isString from '@antv/util/lib/is-string';
import ColorUtil from '../attr/color-util';

const SHADER_TYPE = {
  VS: 'vs',
  FS: 'fs'
};
const moduleCache = {};
const rawContentCache = {};
const precisionRegExp = /precision\s+(high|low|medium)p\s+float/;
const globalDefaultprecision = '#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float;\n#endif\n';
const globalDefaultAttribute = 'attribute float pickingId;\n varying vec4 worldId;\n';
const globalDefaultInclude = '#pragma include "pick_color"\n';
const includeRegExp = /#pragma include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;
const uniformRegExp = /uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g;

function processModule(rawContent, includeList, type) {
  const compiled = rawContent.replace(includeRegExp, (_, strMatch) => {
    const includeOpt = strMatch.split(' ');
    const includeName = includeOpt[0].replace(/"/g, '');

    if (includeList.indexOf(includeName) > -1) {
      return '';
    }

    const txt = rawContentCache[includeName][type];
    includeList.push(includeName);

    const { content } = processModule(txt, includeList, type);
    return content;
  });

  return {
    content: compiled,
    includeList
  };
}

function getUniformLengthByType(type) {
  let arrayLength = 0;
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
  const uniforms = {};
  content = content.replace(uniformRegExp, (_, type, c) => {
    const defaultValues = c.split(':');
    const uniformName = defaultValues[0].trim();
    let defaultValue = '';
    if (defaultValues.length > 1) {
      defaultValue = defaultValues[1].trim();
    }

    // set default value for uniform according to its type
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
          defaultValue = defaultValue.replace('[', '').replace(']', '')
            .split(',')
            .reduce((prev, cur) => {
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
    return `uniform ${type} ${uniformName};\n`;
  });
  return {
    content,
    uniforms
  };
}

export function registerModule(moduleName, { vs, fs, uniforms: declaredUniforms }) {
  const { content: extractedVS, uniforms: vsUniforms } = extractUniforms(vs);
  const { content: extractedFS, uniforms: fsUniforms } = extractUniforms(fs);

  rawContentCache[moduleName] = {
    [SHADER_TYPE.VS]: extractedVS,
    [SHADER_TYPE.FS]: extractedFS,
    uniforms: {
      ...vsUniforms,
      ...fsUniforms,
      ...declaredUniforms
    }
  };
}

export function getModule(moduleName) {
  if (moduleCache[moduleName]) {
    return moduleCache[moduleName];
  }

  let rawVS = rawContentCache[moduleName][SHADER_TYPE.VS];
  const rawFS = rawContentCache[moduleName][SHADER_TYPE.FS];

  rawVS = globalDefaultAttribute + globalDefaultInclude + rawVS;

  const { content: vs, includeList: vsIncludeList } = processModule(rawVS, [], SHADER_TYPE.VS);
  let { content: fs, includeList: fsIncludeList } = processModule(rawFS, [], SHADER_TYPE.FS);
  // TODO: extract uniforms and their default values from GLSL
  const uniforms = uniq(vsIncludeList.concat(fsIncludeList).concat(moduleName)).reduce((prev, cur) => {
    return {
      ...prev,
      ...rawContentCache[cur].uniforms
    };
  }, {});

  /**
   * set default precision for fragment shader
   * https://stackoverflow.com/questions/28540290/why-it-is-necessary-to-set-precision-for-the-fragment-shader
   */
  if (!precisionRegExp.test(fs)) {
    fs = globalDefaultprecision + fs;
  }

  moduleCache[moduleName] = {
    [SHADER_TYPE.VS]: vs.trim(),
    [SHADER_TYPE.FS]: fs.trim(),
    uniforms
  };
  return moduleCache[moduleName];
}

export function wrapUniforms(uniforms) {
  return Object.keys(uniforms).reduce((prev, cur) => {
    prev[cur] = {
      value: uniforms[cur]
    };
    return prev;
  }, {});
}

const DEFAULT_LIGHT = {
  type: 'directional',
  // direction: [ 1, 10.5, 12 ],
  direction: [ 0, -10.5, 1 ],
  ambient: [ 0.2, 0.2, 0.2 ],
  diffuse: [ 0.6, 0.6, 0.6 ],
  specular: [ 0.1, 0.1, 0.1 ]
};

const DEFAULT_DIRECTIONAL_LIGHT = {
  direction: [ 0, 0, 0 ],
  ambient: [ 0, 0, 0 ],
  diffuse: [ 0, 0, 0 ],
  specular: [ 0, 0, 0 ]
};

const DEFAULT_SPOT_LIGHT = {
  position: [ 0, 0, 0 ],
  direction: [ 0, 0, 0 ],
  ambient: [ 0, 0, 0 ],
  diffuse: [ 0, 0, 0 ],
  specular: [ 0, 0, 0 ],
  constant: 1,
  linear: 0,
  quadratic: 0,
  angle: 14,
  exponent: 40,
  blur: 5
};

const COLOR_ATTRIBUTES = [
  'ambient', 'diffuse', 'specular'
];

export function generateLightingUniforms(lights) {
  const lightsMap = {
    u_directional_lights: new Array(3).fill({ ...DEFAULT_DIRECTIONAL_LIGHT }),
    u_num_of_directional_lights: 0,
    u_spot_lights: new Array(3).fill({ ...DEFAULT_SPOT_LIGHT }),
    u_num_of_spot_lights: 0
  };
  if (!lights || !lights.length) {
    lights = [ DEFAULT_LIGHT ];
  }
  lights.forEach(({ type, ...rest }, i) => {
    const lightsUniformName = `u_${type}_lights`;
    const lightsNumUniformName = `u_num_of_${type}_lights`;

    Object.keys(rest).forEach(key => {
      if (isString(rest[key]) && COLOR_ATTRIBUTES.indexOf(key) > -1) {
        rest[key] = ColorUtil.color2RGBA(rest[key]).slice(0, 3);
      }
    });

    lightsMap[lightsUniformName][i] = { ...lightsMap[lightsUniformName][i], ...rest };
    lightsMap[lightsNumUniformName]++;
  });
  return lightsMap;
}
