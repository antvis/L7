import { injectable } from 'inversify';
import { uniq } from 'lodash';
import 'reflect-metadata';
import { extractUniforms } from '../../utils/shader-module';
import { IModuleParams, IShaderModuleService } from './IShaderModuleService';

import common from '../../shaders/common.glsl';
import commom_attr_vert from '../../shaders/common_attr.vert.glsl';
import decode from '../../shaders/decode.glsl';
import light from '../../shaders/light2.glsl';
import lighting from '../../shaders/lighting.glsl';
import opacity_attr_vert from '../../shaders/opacity_attr.vert.glsl';
import pickingFrag from '../../shaders/picking.frag.glsl';
import pickingVert from '../../shaders/picking.vert.glsl';
import project from '../../shaders/project.glsl';
import projection from '../../shaders/projection.glsl';
import sdf2d from '../../shaders/sdf_2d.glsl';

const precisionRegExp = /precision\s+(high|low|medium)p\s+float/;
const globalDefaultprecision =
  '#ifdef GL_FRAGMENT_PRECISION_HIGH\n precision highp float;\n #else\n precision mediump float;\n#endif\n';
const includeRegExp = /#pragma include (["^+"]?["[a-zA-Z_0-9](.*)"]*?)/g;
const REGEX_START_OF_MAIN = /void\s+main\s*\([^)]*\)\s*\{\n?/; // Beginning of main
const REGEX_END_OF_MAIN = /}\n?[^{}]*$/; // End of main, assumes main is last function
@injectable()
export default class ShaderModuleService implements IShaderModuleService {
  private moduleCache: { [key: string]: IModuleParams } = {};
  private rawContentCache: { [key: string]: IModuleParams } = {};

  public registerBuiltinModules() {
    this.destroy();
    this.registerModule('common', { vs: common, fs: common });
    this.registerModule('decode', { vs: decode, fs: '' });
    this.registerModule('projection', { vs: projection, fs: '' });
    this.registerModule('project', { vs: project, fs: '' });
    this.registerModule('sdf_2d', { vs: '', fs: sdf2d });
    this.registerModule('lighting', { vs: lighting, fs: '' });
    this.registerModule('light', { vs: light, fs: '' });
    this.registerModule('picking', { vs: pickingVert, fs: pickingFrag });
    this.registerModule('commom_attr_vert', { vs: commom_attr_vert, fs: '' });
    this.registerModule('opacity_attr_vert', { vs: opacity_attr_vert, fs: '' });
  }

  public registerModule(moduleName: string, moduleParams: IModuleParams) {
    // prevent registering the same module multiple times
    // if (this.rawContentCache[moduleName]) {
    //   return;
    // }

    const { vs, fs, uniforms: declaredUniforms, inject } = moduleParams;
    const { content: extractedVS, uniforms: vsUniforms } = extractUniforms(vs);
    const { content: extractedFS, uniforms: fsUniforms } = extractUniforms(fs);
    this.rawContentCache[moduleName] = {
      fs: extractedFS,
      inject,
      uniforms: {
        ...vsUniforms,
        ...fsUniforms,
        ...declaredUniforms,
      },
      vs: extractedVS,
    };
  }
  public destroy() {
    this.moduleCache = {};
    this.rawContentCache = {};
  }
  public getModule(moduleName: string): IModuleParams {
    // TODO: cache module
    // if (this.moduleCache[moduleName]) {
    //   return this.moduleCache[moduleName];
    // }

    let rawVS = this.rawContentCache[moduleName].vs;
    const rawFS = this.rawContentCache[moduleName].fs;
    const inject = this.rawContentCache[moduleName].inject;
    let declaredUniforms = {};
    if (inject?.['vs:#decl']) {
      // 头部注入
      rawVS = inject?.['vs:#decl'] + rawVS;
      declaredUniforms = extractUniforms(inject?.['vs:#decl']).uniforms;
    }
    if (inject?.['vs:#main-start']) {
      // main
      rawVS = rawVS.replace(REGEX_START_OF_MAIN, (match: string) => {
        return match + inject?.['vs:#main-start'];
      });
    }

    const { content: vs, includeList: vsIncludeList } = this.processModule(
      rawVS,
      [],
      'vs',
    );
    const { content: fs, includeList: fsIncludeList } = this.processModule(
      rawFS,
      [],
      'fs',
    );
    let compiledFs = '';
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
    if (!precisionRegExp.test(fs)) {
      compiledFs = compiledFs + globalDefaultprecision;
    }

    compiledFs = compiledFs + fs;

    this.moduleCache[moduleName] = {
      fs: compiledFs.trim(),
      uniforms,
      vs: vs.trim(),
    };
    return this.moduleCache[moduleName];
  }

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

  private injectDefines(defines: Record<string, string | number | boolean>) {
    const defineStr = Object.keys(defines).reduce((prev, cur) => {
      return prev + `#define ${cur.toUpperCase()} ${defines[cur]};\n`;
    }, '\n');
    return defineStr;
  }
}
