import type BaseLayer from './BaseLayer';

/**
 * 拾取状态与查询 delegate（阶段 1.3a）。
 *
 * 收口 BaseLayer 中拾取相关的：
 * - 私有状态 `currentPickId`、`selectedFeatureID`
 * - 查询/转发方法 `pick` / `boxSelect` / `needPick`
 * - pick-id 状态访问器 `setCurrentPickId` / `getCurrentPickId` /
 *   `setCurrentSelectedId` / `getCurrentSelectedId`
 *
 * BaseLayer 保留 `ILayer` 公开签名作为薄转发；子类 override 路径与外部调用方
 * （`PickingService` / `PixelPickingPass` / tile interaction utils）均不受影响——
 * 它们全部经由 ILayer 方法访问，无一处直读直写上述字段。
 *
 * 编排方法 `active` / `setActive` / `select` / `setSelect`（含 hooks
 * beforeHighlight/beforeSelect + `setTimeout(reRender, 1)` 异步重渲染）留待
 * 1.3b 随 `reRender`（protected）桥接一并搬入。
 */
export default class LayerPickingManager {
  private layer: BaseLayer;
  private currentPickId: number | null = null;
  private selectedFeatureID: number | null = null;

  constructor(layer: BaseLayer) {
    this.layer = layer;
  }

  public pick({ x, y }: { x: number; y: number }) {
    this.layer.container.interactionService.triggerHover({ x, y });
  }

  public boxSelect(box: [number, number, number, number], cb: (...args: any[]) => void) {
    this.layer.container.pickingService.boxPickLayer(this.layer, box, cb);
  }

  public needPick(type: string): boolean {
    const { enableHighlight = true, enableSelect = true } = this.layer.getLayerConfig();
    // 判断layer是否监听事件;
    let isPick =
      this.layer.eventNames().indexOf(type) !== -1 ||
      this.layer.eventNames().indexOf('un' + type) !== -1;
    if ((type === 'click' || type === 'dblclick') && enableSelect) {
      isPick = true;
    }
    if (
      type === 'mousemove' &&
      (enableHighlight ||
        this.layer.eventNames().indexOf('mouseenter') !== -1 ||
        this.layer.eventNames().indexOf('unmousemove') !== -1 ||
        this.layer.eventNames().indexOf('mouseout') !== -1)
    ) {
      isPick = true;
    }

    return this.layer.isVisible() && isPick;
  }

  public setCurrentPickId(id: number) {
    this.currentPickId = id;
  }
  public getCurrentPickId(): number | null {
    return this.currentPickId;
  }
  public setCurrentSelectedId(id: number) {
    this.selectedFeatureID = id;
  }
  public getCurrentSelectedId(): number | null {
    return this.selectedFeatureID;
  }
}
