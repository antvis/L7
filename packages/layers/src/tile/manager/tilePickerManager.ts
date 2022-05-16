import {
  IInteractionTarget,
  ILayer,
  IPickingService,
  IRendererService,
  ITilePickManager,
} from '@antv/l7-core';

export default class TilePickManager implements ITilePickManager {
  private rendererService: IRendererService;
  private pickingService: IPickingService;
  private children: ILayer[];

  constructor(
    rendererService: IRendererService,
    pickingService: IPickingService,
    children: ILayer[],
  ) {
    this.rendererService = rendererService;
    this.pickingService = pickingService;
    this.children = children;
  }

  public normalRenderLayer(layers: ILayer[]) {
    layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .map((layer) => {
        layer.hooks.beforeRenderData.call();
        layer.hooks.beforeRender.call();
        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRenderData.call();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.render();
        layer.hooks.afterRender.call();
      });
  }

  public pickRenderLayer(layers: ILayer[]) {
    layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .map((layer) => {
        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.hooks.beforePickingEncode.call();
          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRenderData.call();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.render(true);
        layer.hooks.afterPickingEncode.call();
      });
  }

  public pickTileRenderLayer(layers: ILayer[], target: IInteractionTarget) {
    const isPicked = layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .some((layer) => {
        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.hooks.beforePickingEncode.call();
          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRenderData.call();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.render(true);
        layer.hooks.afterPickingEncode.call();

        return this.pickingService.pickFromPickingFBO(layer, target);
      });
    if (isPicked) {
      // @ts-ignore
      const [r, g, b] = this.pickingService.pickedColors;

      this.beforeHighlight([r, g, b]);
    } else {
      this.beforeHighlight([0, 0, 0]);
    }
    return isPicked;
  }

  public beforeHighlight(pickedColors: any) {
    this.children.map((layer) => {
      layer.hooks.beforeHighlight.call(pickedColors);
    });
  }

  public beforeSelect(pickedColors: any) {
    this.children.map((layer) => {
      layer.hooks.beforeSelect.call(pickedColors);
    });
  }
}
