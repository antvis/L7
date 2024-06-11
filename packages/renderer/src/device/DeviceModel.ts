import type {
  Bindings,
  Buffer,
  Device,
  InputLayout,
  InputLayoutBufferDescriptor,
  Program,
  RenderPipeline,
} from '@antv/g-device-api';
import {
  BlendFactor,
  BlendMode,
  ChannelWriteMask,
  CompareFunction,
  CullMode,
  Format,
  StencilOp,
  TransparentBlack,
  VertexStepMode,
  ViewportOrigin,
} from '@antv/g-device-api';
import type {
  IModel,
  IModelDrawOptions,
  IModelInitializationOptions,
  IUniform,
} from '@antv/l7-core';
import { gl } from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import type DeviceRendererService from '.';
import type DeviceAttribute from './DeviceAttribute';
import type DeviceBuffer from './DeviceBuffer';
import type DeviceElements from './DeviceElements';
import DeviceFramebuffer from './DeviceFramebuffer';
import DeviceTexture2D from './DeviceTexture2D';
import {
  blendEquationMap,
  blendFuncMap,
  cullFaceMap,
  depthFuncMap,
  primitiveMap,
  sizeFormatMap,
  stencilFuncMap,
  stencilOpMap,
} from './constants';
const { isPlainObject, isTypedArray, isNil } = lodashUtil;

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
    private service: DeviceRendererService,
  ) {
    const { vs, fs, attributes, uniforms, count, elements, diagnosticDerivativeUniformityEnabled } =
      options;
    this.options = options;

    const diagnosticDerivativeUniformityHeader = diagnosticDerivativeUniformityEnabled
      ? ''
      : this.service['viewportOrigin'] === ViewportOrigin.UPPER_LEFT
        ? 'diagnostic(off,derivative_uniformity);'
        : '';

    this.program = service.renderCache.createProgram({
      vertex: {
        glsl: vs,
      },
      fragment: {
        glsl: fs,
        postprocess: (fs) => diagnosticDerivativeUniformityHeader + fs,
      },
    });

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

    const inputLayout = service.renderCache.createInputLayout({
      vertexBufferDescriptors,
      indexBufferFormat: elements ? Format.U32_R : null,
      program: this.program,
    });
    this.inputLayout = inputLayout;

    this.pipeline = this.createPipeline(options);
  }

  private createPipeline(options: IModelInitializationOptions, pick?: boolean) {
    const { primitive = gl.TRIANGLES, depth, cull, blend, stencil } = options;

    const depthParams = this.initDepthDrawParams({ depth });
    const depthEnabled = !!(depthParams && depthParams.enable);
    const cullParams = this.initCullDrawParams({ cull });
    const cullEnabled = !!(cullParams && cullParams.enable);
    // Disable blend when picking.
    const blendParams = this.getBlendDrawParams({ blend });
    const blendEnabled = !!(blendParams && blendParams.enable);

    const stencilParams = this.getStencilDrawParams({ stencil });
    const stencilEnabled = !!(stencilParams && stencilParams.enable);

    const pipeline = this.device.createRenderPipeline({
      inputLayout: this.inputLayout,
      program: this.program,
      topology: primitiveMap[primitive],
      colorAttachmentFormats: [Format.U8_RGBA_RT],
      depthStencilAttachmentFormat: Format.D24_S8,
      megaStateDescriptor: {
        attachmentsState: [
          pick
            ? {
                channelWriteMask: ChannelWriteMask.ALL,
                rgbBlendState: {
                  blendMode: BlendMode.ADD,
                  blendSrcFactor: BlendFactor.ONE,
                  blendDstFactor: BlendFactor.ZERO,
                },
                alphaBlendState: {
                  blendMode: BlendMode.ADD,
                  blendSrcFactor: BlendFactor.ONE,
                  blendDstFactor: BlendFactor.ZERO,
                },
              }
            : {
                channelWriteMask:
                  stencilEnabled && stencilParams.opFront.zpass === StencilOp.REPLACE
                    ? ChannelWriteMask.NONE
                    : ChannelWriteMask.ALL,
                rgbBlendState: {
                  blendMode: (blendEnabled && blendParams.equation.rgb) || BlendMode.ADD,
                  blendSrcFactor:
                    (blendEnabled && blendParams.func.srcRGB) || BlendFactor.SRC_ALPHA,
                  blendDstFactor:
                    (blendEnabled && blendParams.func.dstRGB) || BlendFactor.ONE_MINUS_SRC_ALPHA,
                },
                alphaBlendState: {
                  blendMode: (blendEnabled && blendParams.equation.alpha) || BlendMode.ADD,
                  blendSrcFactor: (blendEnabled && blendParams.func.srcAlpha) || BlendFactor.ONE,
                  blendDstFactor: (blendEnabled && blendParams.func.dstAlpha) || BlendFactor.ONE,
                },
              },
        ],
        blendConstant: blendEnabled ? TransparentBlack : undefined,
        depthWrite: depthEnabled,
        depthCompare: (depthEnabled && depthParams.func) || CompareFunction.LESS,
        cullMode: (cullEnabled && cullParams.face) || CullMode.NONE,
        stencilWrite: stencilEnabled,
        stencilFront: {
          compare: stencilEnabled ? stencilParams.func.cmp : CompareFunction.ALWAYS,
          passOp: stencilParams.opFront.zpass,
          failOp: stencilParams.opFront.fail,
          depthFailOp: stencilParams.opFront.zfail,
          mask: stencilParams.opFront.mask,
        },
        stencilBack: {
          compare: stencilEnabled ? stencilParams.func.cmp : CompareFunction.ALWAYS,
          passOp: stencilParams.opBack.zpass,
          failOp: stencilParams.opBack.fail,
          depthFailOp: stencilParams.opBack.zfail,
          mask: stencilParams.opBack.mask,
        },
      },
    });

    // Save stencil reference on pipeline for later use.
    if (stencilEnabled && !isNil(stencil?.func?.ref)) {
      // @ts-ignore
      pipeline.stencilFuncReference = stencil.func.ref;
    }

    return pipeline;
  }

  updateAttributesAndElements() {}

  /**
   * No need to implement this method, you should update data on `Attribute` like this:
   *
   * @example
   * ```ts
   * attribute.updateBuffer({
   *   data: [],
   *   offset: 0,
   * });
   * ```
   */
  updateAttributes() {}

  addUniforms(uniforms: { [key: string]: IUniform }) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  draw(options: IModelDrawOptions, pick?: boolean) {
    const mergedOptions: IModelInitializationOptions & IModelDrawOptions = {
      ...this.options,
      ...options,
    };
    const {
      count = 0,
      instances,
      elements,
      uniforms = {},
      uniformBuffers,
      textures,
    } = mergedOptions;

    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };

    const { renderPass, currentFramebuffer, width, height } = this.service;

    // TODO: Recreate pipeline only when blend / cull changed.
    this.pipeline = this.createPipeline(mergedOptions, pick);

    // const height = this.device['swapChainHeight'];
    const device = this.service['device'];
    // @ts-ignore
    const tmpHeight = device['swapChainHeight'];
    // @ts-ignore
    device['swapChainHeight'] = currentFramebuffer?.['height'] || height;

    renderPass.setViewport(
      0,
      0,
      currentFramebuffer?.['width'] || width,
      currentFramebuffer?.['height'] || height,
    );

    // @ts-ignore
    device['swapChainHeight'] = tmpHeight;

    renderPass.setPipeline(this.pipeline);
    // @ts-ignore
    if (!isNil(this.pipeline.stencilFuncReference)) {
      // @ts-ignore
      renderPass.setStencilReference(this.pipeline.stencilFuncReference);
    }
    renderPass.setVertexInput(
      this.inputLayout,
      this.vertexBuffers.map((buffer) => ({
        buffer,
      })),
      elements
        ? {
            buffer: this.indexBuffer,
            offset: 0,
          }
        : null,
    );
    if (uniformBuffers) {
      this.bindings = device.createBindings({
        pipeline: this.pipeline,
        uniformBufferBindings: uniformBuffers.map((uniformBuffer, i) => {
          const buffer = uniformBuffer as DeviceBuffer;
          return {
            binding: i,
            buffer: buffer.get(),
            size: buffer['size'],
          };
        }),
        samplerBindings: textures?.map((t: any) => ({
          texture: t['texture'],
          sampler: t['sampler'],
        })),
      });
    }

    if (this.bindings) {
      renderPass.setBindings(this.bindings);
      // Compatible to WebGL1.
      Object.keys(this.uniforms).forEach((uniformName) => {
        const uniform = this.uniforms[uniformName];
        if (uniform instanceof DeviceTexture2D) {
          // @ts-ignore
          this.uniforms[uniformName] = uniform.get();
        } else if (uniform instanceof DeviceFramebuffer) {
          // @ts-ignore
          this.uniforms[uniformName] = uniform.get()['texture'];
        }
      });
      this.program.setUniformsLegacy(this.uniforms);
    }

    if (elements) {
      const indexCount = (elements as DeviceElements)['count'];
      if (indexCount === 0) {
        renderPass.draw(count, instances);
      } else {
        renderPass.drawIndexed(indexCount, instances);
      }
    } else {
      renderPass.draw(count, instances);
    }
  }

  destroy() {
    // 不销毁，方便后续重复使用
    // this.program.destroy();
    this.vertexBuffers?.forEach((buffer) => buffer.destroy());
    this.indexBuffer?.destroy();
    this.bindings?.destroy();
    // 不能进行销毁，删除 deleteVertexArray
    // this.inputLayout.destroy();
    this.pipeline.destroy();
    this.destroyed = true;
  }

  private initDepthDrawParams({ depth }: Pick<IModelInitializationOptions, 'depth'>) {
    if (depth) {
      return {
        enable: depth.enable === undefined ? true : !!depth.enable,
        mask: depth.mask === undefined ? true : !!depth.mask,
        func: depthFuncMap[depth.func || gl.LESS],
        range: depth.range || [0, 1],
      };
    }
  }

  private getBlendDrawParams({ blend }: Pick<IModelInitializationOptions, 'blend'>) {
    const { enable, func, equation, color = [0, 0, 0, 0] } = blend || {};
    return {
      enable: !!enable,
      func: {
        srcRGB: blendFuncMap[(func && func.srcRGB) || gl.SRC_ALPHA],
        srcAlpha: blendFuncMap[(func && func.srcAlpha) || gl.SRC_ALPHA],
        dstRGB: blendFuncMap[(func && func.dstRGB) || gl.ONE_MINUS_SRC_ALPHA],
        dstAlpha: blendFuncMap[(func && func.dstAlpha) || gl.ONE_MINUS_SRC_ALPHA],
      },
      equation: {
        rgb: blendEquationMap[(equation && equation.rgb) || gl.FUNC_ADD],
        alpha: blendEquationMap[(equation && equation.alpha) || gl.FUNC_ADD],
      },
      color,
    };
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#stencil
   */
  private getStencilDrawParams({ stencil }: Pick<IModelInitializationOptions, 'stencil'>) {
    const {
      enable,
      mask = 0xffffffff,
      func = {
        cmp: gl.ALWAYS,
        ref: 0,
        mask: 0xffffffff,
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
    } = stencil || {};
    return {
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
        mask: func.mask,
      },
      opBack: {
        fail: stencilOpMap[opBack.fail],
        zfail: stencilOpMap[opBack.zfail],
        zpass: stencilOpMap[opBack.zpass],
        mask: func.mask,
      },
    };
  }

  /**
   * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#culling
   */
  private initCullDrawParams({ cull }: Pick<IModelInitializationOptions, 'cull'>) {
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
      this.extractUniformsRecursively(uniformName, uniforms[uniformName], extractedUniforms, '');
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
