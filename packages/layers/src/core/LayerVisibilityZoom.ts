import type BaseLayer from './BaseLayer';

/**
 * 可见性与缩放管理 delegate（阶段 1.8）。
 *
 * 收口 BaseLayer 中可见性/层级/缩放范围/自适应相关方法：
 * - `show` / `hide`（含 `emit('show'|'hide')` 事件契约）
 * - `setIndex`（写 `zIndex` + 触发 renderList 重排）
 * - `setMinZoom` / `setMaxZoom` / `getMinZoom` / `getMaxZoom`
 * - `isVisible`（zoom 范围判定）
 * - `setAutoFit` / `fitBounds`（未 init 时落 autoFit 标记、init 后走
 *   `mapService.fitBounds`）
 *
 * BaseLayer 保留全部 `ILayer` 公开签名作为薄转发；子类 override 路径不变
 * （`CanvasLayer.show/hide` 完全替换基类、走 DOM 显隐，不调 super，不受影响）。
 *
 * `reRender`（protected）经构造注入的 `rerender` 回调桥接，与
 * `LayerPickingManager`（1.3b）同一先例模式；回调延迟求值，在 BaseLayer 字段
 * 初始化处对 protected 可见、且不实际调用。
 */
export default class LayerVisibilityZoom {
  private layer: BaseLayer;
  private readonly rerender: () => void;

  constructor(layer: BaseLayer, rerender: () => void) {
    this.layer = layer;
    this.rerender = rerender;
  }

  public show() {
    this.layer.updateLayerConfig({
      visible: true,
    });
    this.rerender();
    this.layer.emit('show');
    return this.layer;
  }

  public hide() {
    this.layer.updateLayerConfig({
      visible: false,
    });
    this.rerender();
    this.layer.emit('hide');
    return this.layer;
  }

  public setIndex(index: number) {
    this.layer.zIndex = index;
    this.layer.container.layerService.updateLayerRenderList();
    this.layer.container.layerService.renderLayers();
    return this.layer;
  }

  public isVisible(): boolean {
    const zoom = this.layer.container.mapService.getZoom();
    const { visible, minZoom = -Infinity, maxZoom = Infinity } = this.layer.getLayerConfig();
    return !!visible && zoom >= minZoom && zoom < maxZoom;
  }

  public setMinZoom(minZoom: number) {
    this.layer.updateLayerConfig({
      minZoom,
    });
    return this.layer;
  }

  public getMinZoom(): number {
    const { minZoom } = this.layer.getLayerConfig();
    return minZoom as number;
  }

  public getMaxZoom(): number {
    const { maxZoom } = this.layer.getLayerConfig();
    return maxZoom as number;
  }

  public setMaxZoom(maxZoom: number) {
    this.layer.updateLayerConfig({
      maxZoom,
    });
    return this.layer;
  }

  public setAutoFit(autoFit: boolean) {
    this.layer.updateLayerConfig({
      autoFit,
    });
    return this.layer;
  }

  /**
   * zoom to layer Bounds
   */
  public fitBounds(fitBoundsOptions?: unknown) {
    if (!this.layer.inited) {
      this.layer.updateLayerConfig({
        autoFit: true,
      });
      return this.layer;
    }
    const source = this.layer.getSource();
    const extent = source.extent;
    const isValid = extent.some((v) => Math.abs(v) === Infinity);
    if (isValid) {
      return this.layer;
    }
    this.layer.container.mapService.fitBounds(
      [
        [extent[0], extent[1]],
        [extent[2], extent[3]],
      ],
      fitBoundsOptions,
    );
    return this.layer;
  }
}
