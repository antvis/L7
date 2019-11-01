import {
  ClearPass,
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  IPostProcessingPass,
  IRendererService,
  MultiPassRenderer,
  PixelPickingPass,
  RenderPass,
  TAAPass,
  TYPES,
} from '@l7/core';
import { inject, injectable, interfaces, multiInject } from 'inversify';

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

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @inject(TYPES.IFactoryPostProcessingPass)
  private readonly postProcessingPassFactory: (
    name: string,
  ) => IPostProcessingPass<unknown>;

  private enabled: boolean;

  public apply(layer: ILayer) {
    layer.hooks.init.tap('MultiPassRendererPlugin', () => {
      const { enableMultiPassRenderer, passes = [] } = layer.getStyleOptions();

      // SceneConfig 的 enableMultiPassRenderer 配置项可以统一关闭
      this.enabled =
        !!enableMultiPassRenderer &&
        this.configService.getConfig().enableMultiPassRenderer !== false;

      // 根据 LayerConfig passes 配置项初始化
      if (this.enabled) {
        layer.multiPassRenderer = this.createMultiPassRenderer(layer, passes);
        layer.multiPassRenderer.setRenderFlag(true);
      }
    });

    layer.hooks.beforeRender.tap('MultiPassRendererPlugin', () => {
      if (this.enabled) {
        // 渲染前根据 viewport 调整 FBO size
        const { width, height } = this.rendererService.getViewportSize();
        layer.multiPassRenderer.resize(width, height);
      } else {
        // 未开启 MultiPassRenderer，由于没有 ClearPass，渲染前需要手动 clear
        this.rendererService.clear({
          color: [0, 0, 0, 0],
          depth: 1,
          framebuffer: null,
        });
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
  ) {
    const multiPassRenderer = new MultiPassRenderer(layer);
    const { enablePicking, enableTAA } = layer.getStyleOptions();

    // clear first
    multiPassRenderer.add(new ClearPass());

    // picking pass if enabled
    if (enablePicking) {
      multiPassRenderer.add(new PixelPickingPass());
    }

    // use TAA pass if enabled instead of render pass
    if (enableTAA) {
      multiPassRenderer.add(new TAAPass());
    } else {
      // render all layers in this pass
      multiPassRenderer.add(new RenderPass());
    }

    // post processing
    normalizePasses(passes).forEach(
      (pass: [string, { [key: string]: unknown }]) => {
        const [passName, initializationOptions] = pass;
        multiPassRenderer.add(
          this.postProcessingPassFactory(passName),
          initializationOptions,
        );
      },
    );

    // 末尾为固定的 CopyPass
    multiPassRenderer.add(this.postProcessingPassFactory('copy'));

    return multiPassRenderer;
  }
}
