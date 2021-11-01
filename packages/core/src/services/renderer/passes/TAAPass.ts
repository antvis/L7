import { $window } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import blendFS from '../../../shaders/post-processing/blend.glsl';
import copyFS from '../../../shaders/post-processing/copy.glsl';
import quadVS from '../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../types';
import { ILayer } from '../../layer/ILayerService';
import { IShaderModuleService } from '../../shader/IShaderModuleService';
import { gl } from '../gl';
import { IFramebuffer } from '../IFramebuffer';
import { IModel, IModelInitializationOptions } from '../IModel';
import { PassType } from '../IMultiPassRenderer';
import BaseNormalPass from './BaseNormalPass';

// Generate halton sequence
// https://en.wikipedia.org/wiki/Halton_sequence
function halton(index: number, base: number) {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result = result + f * (i % base);
    i = Math.floor(i / base);
    f = f / base;
  }
  return result;
}

// 累加计数器
let accumulatingId = 1;

/**
 * TAA（Temporal Anti-Aliasing）
 * 在需要后处理的场景中（例如 L7 的热力图需要 blur pass、PBR 中的 SSAO 环境光遮蔽），无法使用浏览器内置的 MSAA，
 * 只能使用 TAA
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/ri52hv
 */
@injectable()
export default class TAAPass<InitializationOptions = {}> extends BaseNormalPass<
  InitializationOptions
> {
  @inject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  /**
   * 低差异序列
   */
  private haltonSequence: Array<[number, number]> = [];

  /**
   * 当前累加任务 ID，例如用户连续拖拽时上一次累加很有可能没有结束，此时在开启新一轮累加之前需要结束掉之前未完成的
   */
  private accumulatingId: number = 0;

  /**
   * 每一轮累加中的 frameID
   */
  private frame: number = 0;

  /**
   * 每一轮累加中的 frame 定时器
   */
  private timer: number | undefined = undefined;

  private sampleRenderTarget: IFramebuffer;
  private prevRenderTarget: IFramebuffer;
  private outputRenderTarget: IFramebuffer;
  private copyRenderTarget: IFramebuffer;

  private blendModel: IModel;
  private outputModel: IModel;
  private copyModel: IModel;

  public getType() {
    return PassType.Normal;
  }

  public getName() {
    return 'taa';
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {
    super.init(layer, config);

    const { createFramebuffer, createTexture2D } = this.rendererService;
    this.sampleRenderTarget = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });
    this.prevRenderTarget = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });
    this.outputRenderTarget = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });
    this.copyRenderTarget = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });

    for (let i = 0; i < 30; i++) {
      this.haltonSequence.push([halton(i, 2), halton(i, 3)]);
    }

    this.blendModel = this.createTriangleModel('blend-pass', blendFS);
    this.outputModel = this.createTriangleModel('copy-pass', copyFS, {
      blend: {
        enable: true,
        func: {
          srcRGB: gl.ONE,
          dstRGB: gl.ONE_MINUS_SRC_ALPHA,
          srcAlpha: gl.ONE,
          dstAlpha: gl.ONE_MINUS_SRC_ALPHA,
        },
        equation: {
          rgb: gl.FUNC_ADD,
          alpha: gl.FUNC_ADD,
        },
      },
    });
    this.copyModel = this.createTriangleModel('copy-pass', copyFS);
  }

  public render(layer: ILayer) {
    const { clear, getViewportSize, useFramebuffer } = this.rendererService;
    const { width, height } = getViewportSize();
    this.sampleRenderTarget.resize({ width, height });
    this.prevRenderTarget.resize({ width, height });
    this.outputRenderTarget.resize({ width, height });
    this.copyRenderTarget.resize({ width, height });

    this.resetFrame();
    // 首先停止上一次的累加
    this.stopAccumulating();

    // 先输出到 PostProcessor
    const readFBO = layer.multiPassRenderer.getPostProcessor().getReadFBO();
    useFramebuffer(readFBO, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: readFBO,
      });

      // render to post processor
      layer.multiPassRenderer.setRenderFlag(false);
      layer.render();
      layer.multiPassRenderer.setRenderFlag(true);
    });

    const accumulate = (id: number) => {
      // 在开启新一轮累加之前，需要先结束掉之前的累加
      if (!this.accumulatingId || id !== this.accumulatingId) {
        return;
      }

      if (!this.isFinished()) {
        this.doRender(layer);

        $window.requestAnimationFrame(() => {
          accumulate(id);
        });
      }
    };

    this.accumulatingId = accumulatingId++;
    // @ts-ignore
    this.timer = $window.setTimeout(() => {
      accumulate(this.accumulatingId);
    }, 50);
  }

  private doRender(layer: ILayer) {
    const { clear, getViewportSize, useFramebuffer } = this.rendererService;
    const { width, height } = getViewportSize();
    const { jitterScale = 1 } = layer.getLayerConfig();

    // 使用 Halton 序列抖动投影矩阵
    const offset = this.haltonSequence[this.frame % this.haltonSequence.length];
    this.cameraService.jitterProjectionMatrix(
      ((offset[0] * 2.0 - 1.0) / width) * jitterScale,
      ((offset[1] * 2.0 - 1.0) / height) * jitterScale,
    );

    // 按抖动后的投影矩阵渲染
    layer.multiPassRenderer.setRenderFlag(false);
    layer.hooks.beforeRender.call();
    useFramebuffer(this.sampleRenderTarget, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: this.sampleRenderTarget,
      });

      layer.render();
    });
    layer.hooks.afterRender.call();
    layer.multiPassRenderer.setRenderFlag(true);

    // 混合
    const layerStyleOptions = layer.getLayerConfig();
    useFramebuffer(this.outputRenderTarget, () => {
      this.blendModel.draw({
        uniforms: {
          // @ts-ignore
          u_opacity: layerStyleOptions.opacity || 1,
          u_MixRatio: this.frame === 0 ? 1 : 0.9,
          u_Diffuse1: this.sampleRenderTarget,
          u_Diffuse2:
            this.frame === 0
              ? layer.multiPassRenderer.getPostProcessor().getReadFBO()
              : this.prevRenderTarget,
        },
      });
    });

    // 输出累加结果
    if (this.frame === 0) {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: this.copyRenderTarget,
      });
    }

    if (this.frame >= 1) {
      useFramebuffer(this.copyRenderTarget, () => {
        this.outputModel.draw({
          uniforms: {
            u_Texture: this.outputRenderTarget,
          },
        });
      });

      useFramebuffer(
        layer.multiPassRenderer.getPostProcessor().getReadFBO(),
        () => {
          this.copyModel.draw({
            uniforms: {
              u_Texture: this.copyRenderTarget,
            },
          });
        },
      );
      layer.multiPassRenderer.getPostProcessor().render(layer);
    }

    // 保存前序帧结果
    const tmp = this.prevRenderTarget;
    this.prevRenderTarget = this.outputRenderTarget;
    this.outputRenderTarget = tmp;

    this.frame++;

    // 恢复 jitter 后的相机
    this.cameraService.clearJitterProjectionMatrix();
  }

  /**
   * 是否已经完成累加
   * @return {boolean} isFinished
   */
  private isFinished() {
    return this.frame >= this.haltonSequence.length;
  }

  private resetFrame() {
    this.frame = 0;
  }

  private stopAccumulating() {
    this.accumulatingId = 0;
    $window.clearTimeout(this.timer);
  }

  private createTriangleModel(
    shaderModuleName: string,
    fragmentShader: string,
    options?: Partial<IModelInitializationOptions>,
  ) {
    this.shaderModuleService.registerModule(shaderModuleName, {
      vs: quadVS,
      fs: fragmentShader,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule(
      shaderModuleName,
    );
    const { createAttribute, createBuffer, createModel } = this.rendererService;
    return createModel({
      vs,
      fs,
      attributes: {
        // 使用一个全屏三角形，相比 Quad 顶点数目更少
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      uniforms: {
        ...uniforms,
      },
      depth: {
        enable: false,
      },
      count: 3,
      ...options,
    });
  }
}
