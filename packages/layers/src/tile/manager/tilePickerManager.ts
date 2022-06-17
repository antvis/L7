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
    // Tip: 在进行拾取渲染的时候也需要先渲染一遍父组件然后再渲染子组件
    //  如需要在 栅格瓦片存在 Mask 的时候发生的拾取，那么就需要先渲染父组件（渲染父组件的帧缓冲）
    if (this.parent.type === 'RasterLayer') {
      this.renderMask(this.parent);
    }
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
        // RasterLayer 不参与拾取后的 shader 计算
        if (layerPicked && this.parent.type !== 'RasterLayer') {
          this.emit('pick', {
            type: target.type,
            pickedColors: this.pickingService.pickedColors,
            layer,
          });
          this.pickingService.pickedTileLayers = [this.parent];
        }

        return layerPicked;
      });
    if (
      this.parent.type !== 'RasterLayer' &&
      !isPicked &&
      this.isLastPicked &&
      target.type !== 'click'
    ) {
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

  protected renderMask(layer: ILayer) {
    if (layer.inited && layer.isVisible()) {
      layer.hooks.beforeRender.call();
      if (layer.masks.length > 0) {
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
      layer.hooks.afterRender.call();
    }
  }
}
