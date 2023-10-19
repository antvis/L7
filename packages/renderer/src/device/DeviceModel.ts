import {
  Bindings,
  BlendFactor,
  BlendMode,
  Buffer,
  ChannelWriteMask,
  CompareFunction,
  CullMode,
  Device,
  Format,
  InputLayout,
  InputLayoutBufferDescriptor,
  Program,
  RenderPipeline,
  TransparentBlack,
  TransparentWhite,
  VertexStepMode,
} from '@antv/g-device-api';
import {
  IAttribute,
  IElements,
  IModel,
  IModelDrawOptions,
  IModelInitializationOptions,
  IUniform,
  gl,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import DeviceAttribute from './DeviceAttribute';
import DeviceBuffer from './DeviceBuffer';
import DeviceElements from './DeviceElements';
import {
  blendEquationMap,
  blendFuncMap,
  cullFaceMap,
  depthFuncMap,
  primitiveMap,
  sizeFormatMap,
} from './constants';
const { isPlainObject, isTypedArray } = lodashUtil;

export default class DeviceModel implements IModel {
  private destroyed: boolean = false;
  private uniforms: {
    [key: string]: IUniform;
  } = {};

  private program: Program;
  private inputLayout: InputLayout;
  private pipeline: RenderPipeline;
  private indexBuffer: Buffer;
  private vertexBuffers: Buffer[] = [];
  private bindings: Bindings;

  constructor(
    private device: Device,
    private options: IModelInitializationOptions,
  ) {
    const {
      vs,
      fs,
      attributes,
      uniforms,
      uniformBuffers,
      textures,
      primitive = gl.TRIANGLES,
      count,
      elements,
      depth,
      cull,
      blend,
      stencil,
    } = options;
    this.options = options;

    const program = device.createProgram({
      vertex: {
        glsl: vs,
      },
      fragment: {
        glsl: fs,
      },
    });
    this.program = program;

    if (uniforms) {
      this.uniforms = this.extractUniforms(uniforms);
    }

    const vertexBufferDescriptors: InputLayoutBufferDescriptor[] = [];

    // Infer count from data if not provided.
    let inferredCount = 0;
    Object.keys(attributes).forEach((name: string) => {
      const attribute = attributes[name] as DeviceAttribute;

      const buffer = attribute.get() as DeviceBuffer;
      // Bind at each frame.
      this.vertexBuffers.push(buffer.get());

      const {
        offset = 0,
        stride = 0,
        // TODO: normalized
        normalized,
        size = 1,
        divisor = 0,
        shaderLocation = 0,
      } = attribute['attribute'];

      vertexBufferDescriptors.push({
        arrayStride: stride || size * 4,
        // TODO: L7 hasn't use instanced array for now.
        stepMode: VertexStepMode.VERTEX,
        attributes: [
          {
            format: sizeFormatMap[size],
            shaderLocation,
            offset,
            divisor,
          },
        ],
      });

      inferredCount = buffer['size'] / size;
    });

    if (!count) {
      this.options.count = inferredCount;
    }

    if (elements) {
      this.indexBuffer = (elements as DeviceElements).get();
    }

    const inputLayout = device.createInputLayout({
      vertexBufferDescriptors,
      indexBufferFormat: elements ? Format.U32_R : null,
      program,
    });
    this.inputLayout = inputLayout;

    const depthParams = this.initDepthDrawParams({ depth });
    const depthEnabled = !!(depthParams && depthParams.enable);
    const cullParams = this.initCullDrawParams({ cull });
    const cullEnabled = !!(cullParams && cullParams.enable);
    const blendParams = this.getBlendDrawParams({ blend });
    const blendEnabled = !!(blendParams && blendParams.enable);

    this.pipeline = device.createRenderPipeline({
      inputLayout,
      program,
      topology: primitiveMap[primitive],
      colorAttachmentFormats: [Format.U8_RGBA_RT],
      depthStencilAttachmentFormat:
        (depthEnabled && Format.D24_S8) || undefined,
      megaStateDescriptor: {
        attachmentsState: [
          {
            channelWriteMask: ChannelWriteMask.ALL,
            rgbBlendState: {
              blendMode:
                (blendEnabled && blendParams.equation.rgb) || BlendMode.ADD,
              blendSrcFactor:
                (blendEnabled && blendParams.func.srcRGB) ||
                BlendFactor.SRC_ALPHA,
              blendDstFactor:
                (blendEnabled && blendParams.func.dstRGB) ||
                BlendFactor.ONE_MINUS_SRC_ALPHA,
            },
            alphaBlendState: {
              blendMode:
                (blendEnabled && blendParams.equation.alpha) || BlendMode.ADD,
              blendSrcFactor:
                (blendEnabled && blendParams.func.srcAlpha) || BlendFactor.ONE,
              blendDstFactor:
                (blendEnabled && blendParams.func.dstAlpha) ||
                BlendFactor.ONE_MINUS_SRC_ALPHA,
            },
          },
        ],
        blendConstant: TransparentBlack,
        depthWrite: depthEnabled,
        depthCompare:
          (depthEnabled && depthParams.func) || CompareFunction.LESS,
        cullMode: (cullEnabled && cullParams.face) || CullMode.NONE,
        stencilWrite: false,
      },
    });

    if (uniformBuffers) {
      this.bindings = device.createBindings({
        pipeline: this.pipeline,
        uniformBufferBindings: uniformBuffers.map((uniformBuffer, i) => {
          const buffer = uniformBuffer as DeviceBuffer;
          return {
            binding: i,
            buffer: buffer.get(),
            size: buffer['size'] * 4,
          };
        }),
        samplerBindings: textures?.map((t: any) => ({
          texture: t['texture'],
          sampler: t['sampler'],
        })),
      });
    }
  }

  updateAttributesAndElements(
    attributes: { [key: string]: IAttribute },
    elements: IElements,
  ) {
    // TODO: implement
  }

  updateAttributes(attributes: { [key: string]: IAttribute }) {
    // TODO: implement
    // Object.keys(attributes).forEach((name: string) => {
    //   const attribute = attributes[name] as DeviceAttribute;
    //   attribute.updateBuffer();
    // });
  }

  addUniforms(uniforms: { [key: string]: IUniform }) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  draw(options: IModelDrawOptions, pick?: boolean) {
    const {
      count = 0,
      instances,
      elements,
      uniforms = {},
    } = {
      ...this.options,
      ...options,
    };

    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };

    // @ts-ignore
    const { width, height } = this.device;
    // @ts-ignore
    const onscreenTexture = this.device.swapChain.getOnscreenTexture();

    Object.keys(this.uniforms).forEach((name) => {
      // TODO: Handle texture2d and other non-number uniform.
      const uniform = this.uniforms[name];
    });
    // Compatible to WebGL1.
    this.program.setUniformsLegacy(this.uniforms);

    // @ts-ignore
    const renderTarget = this.device.currentFramebuffer;
    const { onscreen } = renderTarget;

    const renderPass = this.device.createRenderPass({
      colorAttachment: [renderTarget.get()],
      colorResolveTo: [onscreen ? onscreenTexture : onscreenTexture],
      colorClearColor: [TransparentWhite],
    });
    renderPass.setPipeline(this.pipeline);
    renderPass.setVertexInput(
      this.inputLayout,
      this.vertexBuffers.map((buffer) => ({
        buffer,
      })),
      elements
        ? {
            buffer: this.indexBuffer,
            offset: 0, // TODO: use defaule value
          }
        : null,
    );
    renderPass.setViewport(0, 0, width, height);
    if (this.bindings) {
      renderPass.setBindings(this.bindings);
    }

    if (elements) {
      renderPass.drawIndexed((elements as DeviceElements)['count'], instances);
    } else {
      renderPass.draw(count, instances);
    }

    this.device.submitPass(renderPass);
  }

  destroy() {
    this.program.destroy();
    this.vertexBuffers?.forEach((buffer) => buffer.destroy());
    this.indexBuffer?.destroy();
    this.bindings?.destroy();
    this.inputLayout.destroy();
    this.pipeline.destroy();
    this.destroyed = true;
  }

  private initDepthDrawParams({
    depth,
  }: Pick<IModelInitializationOptions, 'depth'>) {
    if (depth) {
      return {
        enable: depth.enable === undefined ? true : !!depth.enable,
        mask: depth.mask === undefined ? true : !!depth.mask,
        func: depthFuncMap[depth.func || gl.LESS],
        range: depth.range || [0, 1],
      };
    }
  }

  private getBlendDrawParams({
    blend,
  }: Pick<IModelInitializationOptions, 'blend'>) {
    const { enable, func, equation, color = [0, 0, 0, 0] } = blend || {};
    return {
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

  // /**
  //  * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#stencil
  //  */
  // private getStencilDrawParams({
  //   stencil,
  // }: Pick<IModelInitializationOptions, 'stencil'>) {
  //   const {
  //     enable,
  //     mask = -1,
  //     func = {
  //       cmp: gl.ALWAYS,
  //       ref: 0,
  //       mask: -1,
  //     },
  //     opFront = {
  //       fail: gl.KEEP,
  //       zfail: gl.KEEP,
  //       zpass: gl.KEEP,
  //     },
  //     opBack = {
  //       fail: gl.KEEP,
  //       zfail: gl.KEEP,
  //       zpass: gl.KEEP,
  //     },
  //   } = stencil || {};
  //   return {
  //     enable: !!enable,
  //     mask,
  //     func: {
  //       ...func,
  //       cmp: stencilFuncMap[func.cmp],
  //     },
  //     opFront: {
  //       fail: stencilOpMap[opFront.fail],
  //       zfail: stencilOpMap[opFront.zfail],
  //       zpass: stencilOpMap[opFront.zpass],
  //     },
  //     opBack: {
  //       fail: stencilOpMap[opBack.fail],
  //       zfail: stencilOpMap[opBack.zfail],
  //       zpass: stencilOpMap[opBack.zpass],
  //     },
  //   };
  // }

  // private getColorMaskDrawParams(
  //   { stencil }: Pick<IModelInitializationOptions, 'stencil'>,
  //   pick: boolean,
  // ) {
  //   // TODO: 重构相关参数
  //   // 掩膜模式下，颜色通道全部关闭
  //   const colorMask =
  //     stencil?.enable && stencil.opFront && !pick
  //       ? [false, false, false, false]
  //       : [true, true, true, true]; // 非掩码模式下，颜色通道全部开启
  //   return colorMask;
  // }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#culling
   */
  private initCullDrawParams({
    cull,
  }: Pick<IModelInitializationOptions, 'cull'>) {
    if (cull) {
      const { enable, face = gl.BACK } = cull;
      return {
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
  private extractUniforms(uniforms: { [key: string]: IUniform }): {
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
