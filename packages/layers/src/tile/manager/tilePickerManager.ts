import {
  IInteractionTarget,
  ILayer,
  IPickingService,
  IRendererService,
  ITilePickManager,
} from '@antv/l7-core';

export default class TilePickManager implements ITilePickManager {
  public isLastPicked: boolean = false;
  private rendererService: IRendererService;
  private pickingService: IPickingService;
  private children: ILayer[];
  private parent: ILayer;

  constructor(
    parent: ILayer,
    rendererService: IRendererService,
    pickingService: IPickingService,
    children: ILayer[],
  ) {
    this.parent = parent;
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

  public pickTileRenderLayer(layers: ILayer[], target: IInteractionTarget) {
    const isPicked = layers
      .filter(
        (layer) =>
          this.parent.needPick(target.type) &&
          layer.inited &&
          layer.isVisible(),
      )
      .some((layer) => {
        layer.hooks.beforePickingEncode.call();
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
        layer.renderModels(true);
        layer.hooks.afterPickingEncode.call();

        return this.pickingService.pickFromPickingFBO(layer, target);
      });
    if (isPicked) {
      this.pickingService.pickedTileLayers = [this.parent];
      // @ts-ignore
      const [r, g, b] = this.pickingService.pickedColors;

      this.beforeHighlight([r, g, b]);
    } else if (this.isLastPicked) {
      this.pickingService.pickedTileLayers = [];
      // 只有上一次有被高亮选中，本次未选中的时候才需要清除选中状态
      this.beforeHighlight([0, 0, 0]);
    }
    this.isLastPicked = isPicked;
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
