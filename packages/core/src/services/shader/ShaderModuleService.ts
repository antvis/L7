import { lodashUtil } from '@antv/l7-utils';
import { extractUniforms } from '../../utils/shader-module';
import type { IModuleParams, IShaderModuleService, ShaderDefine } from './IShaderModuleService';
const { uniq } = lodashUtil;

import common from '../../shaders/common.glsl';
import light from '../../shaders/common_light.glsl';
import decode from '../../shaders/decode.glsl';
import lighting from '../../shaders/lighting.glsl';
import pickingFrag from '../../shaders/picking.frag.glsl';
import pickingVert from '../../shaders/picking.vert.glsl';
import picking_uniforms from '../../shaders/picking_uniforms.glsl';
import project from '../../shaders/project.glsl';
import projection from '../../shaders/projection.glsl';
import rotation_2d from '../../shaders/rotation_2d.glsl';
import scene_uniforms from '../../shaders/scene_uniforms.glsl';
import sdf2d from '../../shaders/sdf_2d.glsl';

const precisionRegExp = /precision\s+(high|low|medium)p\s+float/;
const globalDefaultprecision =
  '#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float;\n#endif\n';
const includeRegExp = /#pragma include (["^+"]?["[a-zA-Z_0-9](.*)"]*?)/g;
const REGEX_START_OF_MAIN = /void\s+main\s*\([^)]*\)\s*\{\n?/; // Beginning of main

export default class ShaderModuleService implements IShaderModuleService {
  private moduleCache: { [key: string]: IModuleParams } = {};
  private rawContentCache: { [key: string]: IModuleParams } = {};

  public registerBuiltinModules() {
    this.destroy();
    this.registerModule('common', { vs: common, fs: common });
    this.registerModule('decode', { vs: decode, fs: '' });
    this.registerModule('scene_uniforms', { vs: scene_uniforms, fs: scene_uniforms });
    this.registerModule('picking_uniforms', { vs: picking_uniforms, fs: picking_uniforms });

    this.registerModule('projection', { vs: projection, fs: projection });
    this.registerModule('project', { vs: project, fs: '' });
    this.registerModule('sdf_2d', { vs: '', fs: sdf2d });
    this.registerModule('lighting', { vs: lighting, fs: '' });
    this.registerModule('light', { vs: light, fs: '' });
    this.registerModule('picking', { vs: pickingVert, fs: pickingFrag });
    this.registerModule('rotation_2d', { vs: rotation_2d, fs: '' });
  }

  public registerModule(moduleName: string, moduleParams: IModuleParams) {
    // prevent registering the same module multiple times
    // if (this.rawContentCache[moduleName]) {
    //   return;
    // }

    moduleParams.vs = moduleParams.vs.replace(/\r\n/g, '\n'); // 将所有的\r\n替换为\n
    moduleParams.fs = moduleParams.fs.replace(/\r\n/g, '\n'); // 将所有的\r\n替换为\n
    const { vs, fs, uniforms: declaredUniforms, defines, inject } = moduleParams;
    const { content: extractedVS, uniforms: vsUniforms } = extractUniforms(vs);
    const { content: extractedFS, uniforms: fsUniforms } = extractUniforms(fs);

    this.rawContentCache[moduleName] = {
      fs: extractedFS,
      defines,
      inject,
      uniforms: {
        ...vsUniforms,
        ...fsUniforms,
        ...declaredUniforms,
      },
      vs: extractedVS,
    };
  }

  public getModule(moduleName: string): IModuleParams {
    // TODO: cache module
    // if (this.moduleCache[moduleName]) {
    //   return this.moduleCache[moduleName];
    // }

    let rawVS = this.rawContentCache[moduleName].vs;
    let rawFS = this.rawContentCache[moduleName].fs;
    const { defines = {}, inject = {} } = this.rawContentCache[moduleName];

    let declaredUniforms = {};

    // vs 头部注入
    if (inject['vs:#decl']) {
      rawVS = inject['vs:#decl'] + rawVS;
      declaredUniforms = extractUniforms(inject['vs:#decl']).uniforms;
    }

    // vs main
    if (inject['vs:#main-start']) {
      rawVS = rawVS.replace(REGEX_START_OF_MAIN, (match: string) => {
        return match + inject['vs:#main-start'];
      });
    }

    // fs 头部注入
    if (inject['fs:#decl']) {
      rawFS = inject['fs:#decl'] + rawFS;
    }

    const injectDefines = getInjectDefines(defines);

    // 注入定义的宏
    rawVS = injectDefines + rawVS;

    const { content: vs, includeList: vsIncludeList } = this.processModule(rawVS, [], 'vs');
    const { content: fs, includeList: fsIncludeList } = this.processModule(rawFS, [], 'fs');

    // TODO: extract uniforms and their default values from GLSL
    const uniforms: {
      [key: string]: any;
    } = uniq(vsIncludeList.concat(fsIncludeList).concat(moduleName)).reduce(
      (prev, cur: string) => {
        return {
          ...prev,
          ...this.rawContentCache[cur].uniforms,
        };
      },
      {
        ...declaredUniforms, // 头部注入 uniforms
      },
    );

    /**
     * set default precision for fragment shader
     * https://stackoverflow.com/questions/28540290/why-it-is-necessary-to-set-precision-for-the-fragment-shader
     */
    const compiledVs = (precisionRegExp.test(fs) ? '' : globalDefaultprecision) + vs;
    const compiledFs = (precisionRegExp.test(fs) ? '' : globalDefaultprecision) + fs;

    this.moduleCache[moduleName] = {
      vs: compiledVs.trim(),
      fs: compiledFs.trim(),
      uniforms,
    };

    return this.moduleCache[moduleName];
  }

  public destroy() {
    this.moduleCache = {};
    this.rawContentCache = {};
  }

  /**
   *
   * 解析定义的内联模块
   * like: #pragma include "projection"
   */
  private processModule(
    rawContent: string,
    includeList: string[],
    type: 'vs' | 'fs',
  ): {
    content: string;
    includeList: string[];
  } {
    const compiled = rawContent.replace(includeRegExp, (_, strMatch) => {
      const includeOpt = strMatch.split(' ');

      const includeName = includeOpt[0].replace(/"/g, '');

      if (includeList.indexOf(includeName) > -1) {
        return '';
      }

      const txt = this.rawContentCache[includeName][type];
      includeList.push(includeName);

      const { content } = this.processModule(txt, includeList, type);
      return content;
    });

    return {
      content: compiled,
      includeList,
    };
  }
}

/** Generates defines from an object of key value pairs */
function getInjectDefines(defines: Record<string, ShaderDefine>) {
  const defineStr = Object.keys(defines).reduce((prev, cur) => {
    return prev + `#define ${cur.toUpperCase()} ${defines[cur]}\n`;
  }, '\n');
  return defineStr;
}
