import {
  BlurHPass,
  BlurVPass,
  ClearPass,
  CopyPass,
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  IPostProcessingPass,
  IRendererService,
  lazyInject,
  MultiPassRenderer,
  PixelPickingPass,
  RenderPass,
  TYPES,
} from '@l7/core';

const builtinPostProcessingPassMap: {
  [key: string]: new (config?: { [key: string]: any }) => IPostProcessingPass;
} = {
  blurH: BlurHPass,
  blurV: BlurVPass,
};

/**
 * 'blurH' -> ['blurH', {}]
 */
function normalizePasses(
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
 * 根据 Layer 配置的 passes 创建 MultiPassRenderer 并渲染
 * @example
 * new PolygonLayer({
 *   enableMultiPassRenderer: true,
 *   passes: [
 *     'blurH',
 *     ['blurV', { radius: 10 }],
 *   ],
 * })
 */
export default class MultiPassRendererPlugin implements ILayerPlugin {
  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  private enabled: boolean;

  public apply(layer: ILayer) {
    layer.hooks.init.tap('MultiPassRendererPlugin', () => {
      const {
        enableMultiPassRenderer,
        passes = [],
      } = layer.getInitializationOptions();

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

    multiPassRenderer.add(new ClearPass());

    if (layer.getInitializationOptions().enablePicking) {
      multiPassRenderer.add(new PixelPickingPass());
    }
    multiPassRenderer.add(new RenderPass());

    // post processing
    // TODO: pass initialization params
    normalizePasses(passes).forEach(
      (pass: [string, { [key: string]: unknown }]) => {
        const PostProcessingPassClazz = builtinPostProcessingPassMap[pass[0]];
        multiPassRenderer.add(new PostProcessingPassClazz(pass[1]));
      },
    );
    // 末尾为固定的 CopyPass
    multiPassRenderer.add(new CopyPass());

    return multiPassRenderer;
  }
}
