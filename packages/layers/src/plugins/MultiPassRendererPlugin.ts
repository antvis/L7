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
import 'reflect-metadata';
import { createMultiPassRenderer } from '../utils/multiPassRender';

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
        layer.multiPassRenderer = createMultiPassRenderer(
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
}
