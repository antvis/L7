import type { ILayer } from '@antv/l7-core';
import type BaseLayer from './BaseLayer';

/**
 * 图层遮罩管理 delegate（阶段 1.7）。
 *
 * 收口 BaseLayer 中 mask 相关方法：`addMask` / `removeMask` /
 * `disableMask` / `enableMask` / `addMaskLayer` / `removeMaskLayer`。
 *
 * **`masks[]` 数组保持为 BaseLayer 公开字段**——`core` 的 `LayerService`
 * 与 `BaseModel` 直接读取该字段（`layer.masks.filter/.length`），故数组引用
 * 不能移入 delegate。Manager 持有对该数组的引用并就地 mutate（push/splice），
 * reassign 仅发生在 BaseLayer 构造初始化与 `destroy()` 清空两处。
 *
 * BaseLayer 保留全部 `ILayer` 公开签名作为薄转发；`addMaskLayer` /
 * `removeMaskLayer` 的 `@deprecated` JSDoc 随方法搬入。子类 override 路径与
 * 外部调用方均不受影响（全仓无子类 override 这一组方法，已确认）。
 */
export default class LayerMaskManager {
  private layer: BaseLayer;
  private readonly masks: ILayer[];

  constructor(layer: BaseLayer, masks: ILayer[]) {
    this.layer = layer;
    this.masks = masks;
  }

  public addMask(layer: ILayer): void {
    this.masks.push(layer);
    this.layer.updateLayerConfig({
      maskLayers: this.masks,
    });
    this.enableMask();
  }

  public removeMask(layer: ILayer): void {
    const layerIndex = this.masks.indexOf(layer);
    if (layerIndex > -1) {
      this.masks.splice(layerIndex, 1);
    }
    this.layer.updateLayerConfig({
      maskLayers: this.masks,
    });
  }

  public disableMask(): void {
    this.layer.updateLayerConfig({
      enableMask: false,
    });
  }

  public enableMask(): void {
    this.layer.updateLayerConfig({
      enableMask: true,
    });
  }

  /**
   * 将废弃
   * @deprecated
   */
  public addMaskLayer(maskLayer: ILayer): void {
    this.masks.push(maskLayer);
  }

  /**
   * 将废弃
   * @deprecated
   */
  public removeMaskLayer(maskLayer: ILayer): void {
    const layerIndex = this.masks.indexOf(maskLayer);
    if (layerIndex > -1) {
      this.masks.splice(layerIndex, 1);
    }
    maskLayer.destroy();
  }
}
