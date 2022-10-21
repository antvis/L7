import { IInteractionTarget, ILayer, ILayerPickService } from '@antv/l7-core';

export default class BaseLayerPickService implements ILayerPickService {
  private layer: ILayer;
  constructor(layer: ILayer) {
    this.layer = layer;
  }
  pickRender(target: IInteractionTarget): void {
    const layer = this.layer;
    // 拾取绘制
    if (layer.tileLayer) {
      return layer.tileLayer.pickRender(target);
    }

    layer.hooks.beforePickingEncode.call();

    if (layer.masks.length > 0) {
      // 若存在 mask，则在 pick 阶段的绘制也启用
      layer.masks.map(async (m: ILayer) => {
        m.hooks.beforeRenderData.promise();
        m.hooks.beforeRender.call();
        m.render();
        m.hooks.afterRender.call();
      });
    }
    layer.renderModels(true);
    layer.hooks.afterPickingEncode.call();
  }

  selectFeature(pickedColors: Uint8Array | undefined): void {
    const layer = this.layer;
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
  }
  highlightPickedFeature(pickedColors: Uint8Array | undefined): void {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    this.layer.hooks.beforeHighlight.call([r, g, b]);
  }
  getFeatureById(pickedFeatureIdx: number): any {
    return this.layer.getSource().getFeatureById(pickedFeatureIdx);
  }
}
