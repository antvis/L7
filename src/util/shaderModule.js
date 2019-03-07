const SHADER_TYPE = {
  VS: 'vs',
  FS: 'fs'
};
const moduleCache = {};
const rawContentCache = {};
const precisionRegExp = /precision\s+(high|low|medium)p\s+float/;
const globalDefaultprecision = '#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float;\n#endif\n';
// const globalDefaultAttribute = 'attribute float pickingId;\n varying vec4 worldId;\n';
const includeRegExp = /#pragma include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;

function processModule(rawContent, includeList, type) {
  return rawContent.replace(includeRegExp, (_, strMatch) => {
    const includeOpt = strMatch.split(' ');
    const includeName = includeOpt[0].replace(/"/g, '');

    if (includeList.indexOf(includeName) > -1) {
      return '';
    }

    let txt = rawContentCache[includeName][type];
    includeList.push(includeName);

    txt = processModule(txt, includeList, type);
    return txt;
  });
}

export function registerModule(moduleName, { vs, fs }) {
  rawContentCache[moduleName] = {
    [SHADER_TYPE.VS]: vs,
    [SHADER_TYPE.FS]: fs
  };
}

export function getModule(moduleName) {
  if (moduleCache[moduleName]) {
    return moduleCache[moduleName];
  }

  let vs = rawContentCache[moduleName][SHADER_TYPE.VS];
  let fs = rawContentCache[moduleName][SHADER_TYPE.FS];

  vs = processModule(vs, [], SHADER_TYPE.VS);
  fs = processModule(fs, [], SHADER_TYPE.FS);

  /**
   * set default precision for fragment shader
   * https://stackoverflow.com/questions/28540290/why-it-is-necessary-to-set-precision-for-the-fragment-shader
   */
  if (!precisionRegExp.test(fs)) {
    fs = globalDefaultprecision + fs;
  }

  moduleCache[moduleName] = {
    [SHADER_TYPE.VS]: vs.trim(),
    [SHADER_TYPE.FS]: fs.trim()
  };
  return moduleCache[moduleName];
}
