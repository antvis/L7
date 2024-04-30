import type { gl } from './gl';
import type { IAttribute } from './IAttribute';
import type { IBuffer } from './IBuffer';
import type { IElements } from './IElements';
import type { ITexture2D } from './ITexture2D';
import type { IUniform } from './IUniform';

export interface IBlendOptions {
  // gl.enable(gl.BLEND)
  enable: boolean;
  // gl.blendFunc
  func: BlendingFunctionSeparate;
  // gl.blendEquation
  equation: {
    rgb: gl.FUNC_ADD | gl.FUNC_SUBTRACT | gl.FUNC_REVERSE_SUBTRACT | gl.MIN_EXT | gl.MAX_EXT;
    alpha?: gl.FUNC_ADD | gl.FUNC_SUBTRACT | gl.FUNC_REVERSE_SUBTRACT | gl.MIN_EXT | gl.MAX_EXT;
  };
  // gl.blendColor
  color: [number, number, number, number];
}
export interface IStencilOptions {
  // gl.enable(gl.STENCIL_TEST)
  enable: boolean;
  // gl.stencilMask
  mask: number;
  func: {
    cmp:
      | gl.NEVER
      | gl.ALWAYS
      | gl.LESS
      | gl.LEQUAL
      | gl.GREATER
      | gl.GEQUAL
      | gl.EQUAL
      | gl.NOTEQUAL;
    ref: number;
    mask: number;
  };
  opFront: {
    fail: stencilOp;
    zfail: stencilOp;
    zpass: stencilOp;
  };
  opBack: {
    fail: stencilOp;
    zfail: stencilOp;
    zpass: stencilOp;
  };
}
type stencilOp =
  | gl.ZERO
  | gl.KEEP
  | gl.REPLACE
  | gl.INVERT
  | gl.INCR
  | gl.DECR
  | gl.INCR_WRAP
  | gl.DECR_WRAP;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BlendingFunctionCombined = Partial<{
  src:
    | gl.ZERO
    | gl.ONE
    | gl.SRC_COLOR
    | gl.ONE_MINUS_SRC_COLOR
    | gl.SRC_ALPHA
    | gl.ONE_MINUS_SRC_ALPHA
    | gl.DST_COLOR
    | gl.ONE_MINUS_DST_COLOR
    | gl.DST_ALPHA
    | gl.ONE_MINUS_DST_ALPHA
    | gl.CONSTANT_COLOR
    | gl.ONE_MINUS_CONSTANT_COLOR
    | gl.CONSTANT_ALPHA
    | gl.ONE_MINUS_CONSTANT_ALPHA
    | gl.SRC_ALPHA_SATURATE;
  dst:
    | gl.ZERO
    | gl.ONE
    | gl.SRC_COLOR
    | gl.ONE_MINUS_SRC_COLOR
    | gl.SRC_ALPHA
    | gl.ONE_MINUS_SRC_ALPHA
    | gl.DST_COLOR
    | gl.ONE_MINUS_DST_COLOR
    | gl.DST_ALPHA
    | gl.ONE_MINUS_DST_ALPHA
    | gl.CONSTANT_COLOR
    | gl.ONE_MINUS_CONSTANT_COLOR
    | gl.CONSTANT_ALPHA
    | gl.ONE_MINUS_CONSTANT_ALPHA
    | gl.SRC_ALPHA_SATURATE;
}>;

type BlendingFunctionSeparate = Partial<{
  srcRGB:
    | gl.ZERO
    | gl.ONE
    | gl.SRC_COLOR
    | gl.ONE_MINUS_SRC_COLOR
    | gl.SRC_ALPHA
    | gl.ONE_MINUS_SRC_ALPHA
    | gl.DST_COLOR
    | gl.ONE_MINUS_DST_COLOR
    | gl.DST_ALPHA
    | gl.ONE_MINUS_DST_ALPHA
    | gl.CONSTANT_COLOR
    | gl.ONE_MINUS_CONSTANT_COLOR
    | gl.CONSTANT_ALPHA
    | gl.ONE_MINUS_CONSTANT_ALPHA
    | gl.SRC_ALPHA_SATURATE;
  srcAlpha: number;
  dstRGB:
    | gl.ZERO
    | gl.ONE
    | gl.SRC_COLOR
    | gl.ONE_MINUS_SRC_COLOR
    | gl.SRC_ALPHA
    | gl.ONE_MINUS_SRC_ALPHA
    | gl.DST_COLOR
    | gl.ONE_MINUS_DST_COLOR
    | gl.DST_ALPHA
    | gl.ONE_MINUS_DST_ALPHA
    | gl.CONSTANT_COLOR
    | gl.ONE_MINUS_CONSTANT_COLOR
    | gl.CONSTANT_ALPHA
    | gl.ONE_MINUS_CONSTANT_ALPHA
    | gl.SRC_ALPHA_SATURATE;
  dstAlpha: number;
}>;

export interface IModelInitializationOptions {
  /**
   * 该 model 是否支持拾取
   */
  pick?: boolean;
  /**
   * Shader 字符串，假设此时已经经过 ShaderLib 处理
   */
  vs: string;
  fs: string;

  uniforms?: {
    [key: string]: IUniform;
  };
  // UBOs
  uniformBuffers?: IBuffer[];
  textures?: ITexture2D[];

  attributes: {
    [key: string]: IAttribute;
  };

  /**
   * gl.POINTS | gl.TRIANGLES | ...
   * 默认值 gl.TRIANGLES
   */
  primitive?:
    | gl.POINTS
    | gl.LINES
    | gl.LINE_LOOP
    | gl.LINE_STRIP
    | gl.TRIANGLES
    | gl.TRIANGLE_FAN
    | gl.TRIANGLE_STRIP;
  // 绘制的顶点数目
  count?: number;
  // 默认值为 0
  offset?: number;

  /**
   * gl.drawElements
   */
  elements?: IElements;
  /**
   * 绘制实例数目
   */
  instances?: number;

  colorMask?: [boolean, boolean, boolean, boolean];

  /**
   * depth buffer
   */
  depth?: Partial<{
    // gl.enable(gl.DEPTH_TEST)
    enable: boolean;
    // gl.depthMask
    mask: boolean;
    // gl.depthFunc
    func:
      | gl.NEVER
      | gl.ALWAYS
      | gl.LESS
      | gl.LEQUAL
      | gl.GREATER
      | gl.GEQUAL
      | gl.EQUAL
      | gl.NOTEQUAL;
    // gl.depthRange
    range: [0, 1];
  }>;

  /**
   * blending
   */
  blend?: Partial<IBlendOptions>;

  /**
   * stencil
   */
  stencil?: Partial<IStencilOptions>;

  /**
   * cull
   */
  cull?: {
    // gl.enable(gl.CULL_FACE)
    enable: boolean;
    // gl.cullFace
    face: gl.FRONT | gl.BACK;
  };

  /**
   * When disabled, a global diagnostic filter can be used to apply a diagnostic filter to the entire WGSL module. Default to `true`.
   * @see https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Non-uniform_flow_control
   * @see https://www.w3.org/TR/WGSL/#example-70cf6bac
   */
  diagnosticDerivativeUniformityEnabled?: boolean;
}

export interface IModelDrawOptions {
  uniforms?: {
    [key: string]: IUniform;
  };

  attributes?: {
    [key: string]: IAttribute;
  };
  elements?: IElements;

  blend?: Partial<IBlendOptions>;

  stencil?: Partial<IStencilOptions>;

  textures?: ITexture2D[];
}

/**
 * 类似 THREE.Mesh，不同之处在于可以不依赖 THREE.Scene，单独执行封装的渲染命令。
 * 这些命令包括：
 * * 执行 Shader Program
 * * 开启/控制 WebGL 状态(gl.enable)例如 depth/stencil buffer、blending、cull 等
 * * 销毁资源，例如 buffer texture 等
 */
export interface IModel {
  updateAttributes(attributes: { [key: string]: IAttribute }): void;
  updateAttributesAndElements(attributes: { [key: string]: IAttribute }, elements: IElements): void;
  addUniforms(uniforms: { [key: string]: IUniform }): void;
  draw(options: IModelDrawOptions, pick?: boolean): void;
  destroy(): void;
}
