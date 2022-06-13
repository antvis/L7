import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IPickingService,
  IRendererService,
  ITilePickManager,
} from '@antv/l7-core';
import { EventEmitter } from 'eventemitter3';
export default class TilePickManager extends EventEmitter
  implements ITilePickManager {
  public isLastPicked: boolean = false;
  private rendererService: IRendererService;
  private pickingService: IPickingService;
  private layerService: ILayerService;
  private children: ILayer[];
  private parent: ILayer;

  constructor(
    parent: ILayer,
    rendererService: IRendererService,
    pickingService: IPickingService,
    children: ILayer[],
    layerService: ILayerService,
  ) {
    super();
    this.parent = parent;
    this.rendererService = rendererService;
    this.pickingService = pickingService;
    this.layerService = layerService;
    this.children = children;
  }

  /**
   *
   * @param layers
   */
  public normalRender(layers: ILayer[]) {
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
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.render();
        layer.hooks.afterRender.call();
      });
  }

  public pickRender(layers: ILayer[], target: IInteractionTarget) {
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
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.renderModels(true);
        layer.hooks.afterPickingEncode.call();
        const layerPicked = this.pickingService.pickFromPickingFBO(
          layer,
          target,
        );
        if (layerPicked) {
          this.emit('pick', {
            type: target.type,
            pickedColors: this.pickingService.pickedColors,
            layer,
          });
          this.pickingService.pickedTileLayers = [this.parent];
        }

        return layerPicked;
      });
    if (!isPicked && this.isLastPicked && target.type !== 'click') {
      // 只有上一次有被高亮选中，本次未选中的时候才需要清除选中状态
      this.pickingService.pickedTileLayers = [];
      this.emit('unpick', {});
      this.beforeHighlight([0, 0, 0]);
    }
    this.isLastPicked = isPicked;
    return isPicked;
  }

  public clearPick() {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .map((layer) => {
        layer.hooks.beforeSelect.call([0, 0, 0]);
      });
    this.pickingService.pickedTileLayers = [];
  }

  public beforeHighlight(pickedColors: any) {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .map((child) => {
        child.hooks.beforeHighlight.call(pickedColors);
      });
  }

  public beforeSelect(pickedColors: any) {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .map((layer) => {
        layer.hooks.beforeSelect.call(pickedColors);
      });
  }
}
