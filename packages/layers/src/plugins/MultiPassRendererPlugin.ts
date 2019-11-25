import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  IPass,
  IPostProcessingPass,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';

/**
 * 'blurH' -> ['blurH', {}]
 */
export function normalizePasses(
  passes: Array<string | [string, { [key: string]: unknown }]>,
) {
  return passes.map((pass: string | [string, { [key: string]: unknown }]) => {
    if (typeof pass === 'string') {
      pass = [pass, {}];
    }
    return pass;
  });
}

/**
 * 自定义渲染管线：
 * ClearPass -> PixelPickingPass(可选) -> RenderPass/TAAPass -> PostProcessing -> CopyPass
 * 根据 Layer 配置的 passes 创建 PostProcessing
 * @example
 * new PolygonLayer({
 *   enableMultiPassRenderer: true,
 *   passes: [
 *     'blurH',
 *     ['blurV', { radius: 10 }],
 *   ],
 * })
 */
@injectable()
export default class MultiPassRendererPlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  private enabled: boolean;

  public apply(
    layer: ILayer,
    {
      rendererService,
      postProcessingPassFactory,
      normalPassFactory,
    }: {
      rendererService: IRendererService;
      postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>;
      normalPassFactory: (name: string) => IPass<unknown>;
    },
  ) {
    layer.hooks.init.tap('MultiPassRendererPlugin', () => {
      const { enableMultiPassRenderer, passes = [] } = layer.getLayerConfig();

      // SceneConfig 的 enableMultiPassRenderer 配置项可以统一关闭
      this.enabled =
        !!enableMultiPassRenderer &&
        layer.getLayerConfig().enableMultiPassRenderer !== false;

      // 根据 LayerConfig passes 配置项初始化
      if (this.enabled) {
        layer.multiPassRenderer = this.createMultiPassRenderer(
          layer,
          passes,
          postProcessingPassFactory,
          normalPassFactory,
        );
        layer.multiPassRenderer.setRenderFlag(true);
      }
    });

    layer.hooks.beforeRender.tap('MultiPassRendererPlugin', () => {
      if (this.enabled) {
        // 渲染前根据 viewport 调整 FBO size
        const { width, height } = rendererService.getViewportSize();
        layer.multiPassRenderer.resize(width, height);
      }
    });
  }

  /**
   * 默认添加 ClearPass、RenderPass
   * 以及 PostProcessing 中的最后一个 CopyPass
   */
  private createMultiPassRenderer(
    layer: ILayer,
    passes: Array<string | [string, { [key: string]: unknown }]>,
    postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>,
    normalPassFactory: (name: string) => IPass<unknown>,
  ) {
    const multiPassRenderer = layer.multiPassRenderer;
    const { enablePicking, enableTAA } = layer.getLayerConfig();

    // picking pass if enabled
    if (enablePicking) {
      multiPassRenderer.add(normalPassFactory('pixelPicking'));
    }

    // use TAA pass if enabled instead of render pass
    if (enableTAA) {
      multiPassRenderer.add(normalPassFactory('taa'));
    } else {
      // render all layers in this pass
      multiPassRenderer.add(normalPassFactory('render'));
    }

    // post processing
    normalizePasses(passes).forEach(
      (pass: [string, { [key: string]: unknown }]) => {
        const [passName, initializationOptions] = pass;
        multiPassRenderer.add(
          postProcessingPassFactory(passName),
          initializationOptions,
        );
      },
    );

    // 末尾为固定的 CopyPass
    multiPassRenderer.add(postProcessingPassFactory('copy'));

    return multiPassRenderer;
  }
}
