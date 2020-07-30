import {
  gl,
  IAttribute,
  IModel,
  IModelDrawOptions,
  IModelInitializationOptions,
  IUniform,
} from '@antv/l7-core';
import { isPlainObject, isTypedArray } from 'lodash';
import regl from 'regl';
import {
  blendEquationMap,
  blendFuncMap,
  cullFaceMap,
  depthFuncMap,
  primitiveMap,
  stencilFuncMap,
  stencilOpMap,
} from './constants';
import ReglAttribute from './ReglAttribute';
import ReglElements from './ReglElements';
import ReglFramebuffer from './ReglFramebuffer';
import ReglTexture2D from './ReglTexture2D';

/**
 * adaptor for regl.DrawCommand
 */
export default class ReglModel implements IModel {
  private reGl: regl.Regl;
  private destroyed: boolean = false;
  private drawCommand: regl.DrawCommand;
  private drawParams: regl.DrawConfig;
  private options: IModelInitializationOptions;
  private uniforms: {
    [key: string]: IUniform;
  } = {};

  constructor(reGl: regl.Regl, options: IModelInitializationOptions) {
    this.reGl = reGl;
    const {
      vs,
      fs,
      attributes,
      uniforms,
      primitive,
      count,
      elements,
      depth,
      blend,
      stencil,
      cull,
      instances,
    } = options;
    const reglUniforms: { [key: string]: IUniform } = {};
    this.options = options;
    if (uniforms) {
      this.uniforms = this.extractUniforms(uniforms);
      Object.keys(uniforms).forEach((uniformName) => {
        // use regl prop API
        // @ts-ignore
        reglUniforms[uniformName] = reGl.prop(uniformName);
      });
    }

    const reglAttributes: { [key: string]: regl.Attribute } = {};
    Object.keys(attributes).forEach((name: string) => {
      reglAttributes[name] = (attributes[name] as ReglAttribute).get();
    });
    const drawParams: regl.DrawConfig = {
      attributes: reglAttributes,
      frag: fs,
      uniforms: reglUniforms,
      vert: vs,
      primitive:
        primitiveMap[primitive === undefined ? gl.TRIANGLES : primitive],
    };
    if (instances) {
      drawParams.instances = instances;
    }

    // elements 中可能包含 count，此时不应传入
    if (count) {
      drawParams.count = count;
    }

    if (elements) {
      drawParams.elements = (elements as ReglElements).get();
    }

    this.initDepthDrawParams({ depth }, drawParams);
    this.initBlendDrawParams({ blend }, drawParams);
    this.initStencilDrawParams({ stencil }, drawParams);
    this.initCullDrawParams({ cull }, drawParams);

    this.drawCommand = reGl(drawParams);
    this.drawParams = drawParams;
  }

  public addUniforms(uniforms: { [key: string]: IUniform }) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  public draw(options: IModelDrawOptions) {
    if (
      this.drawParams.attributes &&
      Object.keys(this.drawParams.attributes).length === 0
    ) {
      return;
    }
    const uniforms: {
      [key: string]: IUniform;
    } = {
      ...this.uniforms,
      ...this.extractUniforms(options.uniforms || {}),
    };
    const reglDrawProps: {
      [key: string]:
        | regl.Framebuffer
        | regl.Texture2D
        | number
        | number[]
        | boolean;
    } = {};

    Object.keys(uniforms).forEach((uniformName: string) => {
      const type = typeof uniforms[uniformName];
      if (
        type === 'boolean' ||
        type === 'number' ||
        Array.isArray(uniforms[uniformName]) ||
        // @ts-ignore
        uniforms[uniformName].BYTES_PER_ELEMENT
      ) {
        reglDrawProps[uniformName] = uniforms[uniformName] as
          | number
          | number[]
          | boolean;
      } else {
        reglDrawProps[uniformName] = (uniforms[uniformName] as
          | ReglFramebuffer
          | ReglTexture2D).get();
      }
    });
    this.drawCommand(reglDrawProps);
  }

  public destroy() {
    // @ts-ignore
    this.drawParams.elements.destroy();
    if (this.options.attributes) {
      Object.values(this.options.attributes).forEach((attr: any) => {
        // @ts-ignore
        (attr as ReglAttribute).destroy();
      });
    }
    this.destroyed = true;
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#depth-buffer
   */
  private initDepthDrawParams(
    { depth }: Pick<IModelInitializationOptions, 'depth'>,
    drawParams: regl.DrawConfig,
  ) {
    if (depth) {
      drawParams.depth = {
        enable: depth.enable === undefined ? true : !!depth.enable,
        mask: depth.mask === undefined ? true : !!depth.mask,
        func: depthFuncMap[depth.func || gl.LESS],
        range: depth.range || [0, 1],
      };
    }
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#blending
   */
  private initBlendDrawParams(
    { blend }: Pick<IModelInitializationOptions, 'blend'>,
    drawParams: regl.DrawConfig,
  ) {
    if (blend) {
      const { enable, func, equation, color = [0, 0, 0, 0] } = blend;
      // @ts-ignore
      drawParams.blend = {
        enable: !!enable,
        func: {
          srcRGB: blendFuncMap[(func && func.srcRGB) || gl.SRC_ALPHA],
          srcAlpha: blendFuncMap[(func && func.srcAlpha) || gl.SRC_ALPHA],
          dstRGB: blendFuncMap[(func && func.dstRGB) || gl.ONE_MINUS_SRC_ALPHA],
          dstAlpha:
            blendFuncMap[(func && func.dstAlpha) || gl.ONE_MINUS_SRC_ALPHA],
        },
        equation: {
          rgb: blendEquationMap[(equation && equation.rgb) || gl.FUNC_ADD],
          alpha: blendEquationMap[(equation && equation.alpha) || gl.FUNC_ADD],
        },
        color,
      };
    }
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#stencil
   */
  private initStencilDrawParams(
    { stencil }: Pick<IModelInitializationOptions, 'stencil'>,
    drawParams: regl.DrawConfig,
  ) {
    if (stencil) {
      const {
        enable,
        mask = -1,
        func = {
          cmp: gl.ALWAYS,
          ref: 0,
          mask: -1,
        },
        opFront = {
          fail: gl.KEEP,
          zfail: gl.KEEP,
          zpass: gl.KEEP,
        },
        opBack = {
          fail: gl.KEEP,
          zfail: gl.KEEP,
          zpass: gl.KEEP,
        },
      } = stencil;
      drawParams.stencil = {
        enable: !!enable,
        mask,
        func: {
          ...func,
          cmp: stencilFuncMap[func.cmp],
        },
        opFront: {
          fail: stencilOpMap[opFront.fail],
          zfail: stencilOpMap[opFront.zfail],
          zpass: stencilOpMap[opFront.zpass],
        },
        opBack: {
          fail: stencilOpMap[opBack.fail],
          zfail: stencilOpMap[opBack.zfail],
          zpass: stencilOpMap[opBack.zpass],
        },
      };
    }
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#culling
   */
  private initCullDrawParams(
    { cull }: Pick<IModelInitializationOptions, 'cull'>,
    drawParams: regl.DrawConfig,
  ) {
    if (cull) {
      const { enable, face = gl.BACK } = cull;
      drawParams.cull = {
        enable: !!enable,
        face: cullFaceMap[face],
      };
    }
  }

  /**
   * 考虑结构体命名, eg:
   * a: { b: 1 }  ->  'a.b'
   * a: [ { b: 1 } ] -> 'a[0].b'
   */
  private extractUniforms(uniforms: {
    [key: string]: IUniform;
  }): {
    [key: string]: IUniform;
  } {
    const extractedUniforms = {};
    Object.keys(uniforms).forEach((uniformName) => {
      this.extractUniformsRecursively(
        uniformName,
        uniforms[uniformName],
        extractedUniforms,
        '',
      );
    });

    return extractedUniforms;
  }

  private extractUniformsRecursively(
    uniformName: string,
    uniformValue: IUniform,
    uniforms: {
      [key: string]: IUniform;
    },
    prefix: string,
  ) {
    if (
      uniformValue === null ||
      typeof uniformValue === 'number' || // u_A: 1
      typeof uniformValue === 'boolean' || // u_A: false
      (Array.isArray(uniformValue) && typeof uniformValue[0] === 'number') || // u_A: [1, 2, 3]
      isTypedArray(uniformValue) || // u_A: Float32Array
      // @ts-ignore
      uniformValue === '' ||
      'resize' in uniformValue
    ) {
      uniforms[`${prefix && prefix + '.'}${uniformName}`] = uniformValue;
      return;
    }

    // u_Struct.a.b.c
    if (isPlainObject(uniformValue)) {
      Object.keys(uniformValue).forEach((childName) => {
        this.extractUniformsRecursively(
          childName,
          // @ts-ignore
          uniformValue[childName],
          uniforms,
          `${prefix && prefix + '.'}${uniformName}`,
        );
      });
    }

    // u_Struct[0].a
    if (Array.isArray(uniformValue)) {
      uniformValue.forEach((child, idx) => {
        Object.keys(child).forEach((childName) => {
          this.extractUniformsRecursively(
            childName,
            // @ts-ignore
            child[childName],
            uniforms,
            `${prefix && prefix + '.'}${uniformName}[${idx}]`,
          );
        });
      });
    }
  }
}
