import {
  gl,
  IModel,
  IModelDrawOptions,
  IModelInitializationOptions,
  IUniform,
} from '@l7/core';
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
  private drawCommand: regl.DrawCommand;
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
    if (uniforms) {
      this.uniforms = uniforms;
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
  }

  public addUniforms(uniforms: { [key: string]: IUniform }) {
    this.uniforms = {
      ...this.uniforms,
      ...uniforms,
    };
  }

  public draw(options: IModelDrawOptions) {
    const uniforms: {
      [key: string]: IUniform;
    } = {
      ...this.uniforms,
      ...options.uniforms,
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
    // don't need do anything since we will call `rendererService.cleanup()`
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
        enable: enable === undefined ? false : !!enable,
        func: {
          srcRGB: blendFuncMap[(func && func.srcRGB) || gl.SRC_ALPHA],
          srcAlpha: func && func.srcAlpha,
          dstRGB: blendFuncMap[(func && func.dstRGB) || gl.ONE_MINUS_SRC_ALPHA],
          dstAlpha: func && func.dstAlpha,
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
        enable: enable === undefined ? false : !!enable,
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
        enable: enable === undefined ? false : !!enable,
        face: cullFaceMap[face],
      };
    }
  }
}
