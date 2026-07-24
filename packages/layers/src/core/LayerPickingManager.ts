import type { IActiveOption, ILayerConfig } from '@antv/l7-core';
import { encodePickingColor, lodashUtil } from '@antv/l7-utils';
import type BaseLayer from './BaseLayer';

const { isObject } = lodashUtil;
/**
 * 拾取 delegate（阶段 1.3a + 1.3b）。
 *
 * 收口 BaseLayer 中拾取相关状态、查询与编排：
 * - 状态 `currentPickId`、`selectedFeatureID`
 * - 查询/转发 `pick` / `boxSelect` / `needPick`
 * - pick-id 访问器 `setCurrentPickId` / `getCurrentPickId` /
 *   `setCurrentSelectedId` / `getCurrentSelectedId`
 * - 流式开关 `active` / `select` + 编排 `setActive` / `setSelect`
 *   （含 `hooks.beforeHighlight/beforeSelect` + `setTimeout` 异步重渲染）
 *
 * BaseLayer 保留 `ILayer` 公开签名作为薄转发；子类 override 路径与外部调用方
 * （`PickingService` / `PixelPickingPass` / tile interaction utils）均不受影响。
 *
 * `reRender`（protected）经构造注入的 `rerender` 回调桥接，避免 protected 跨类
 * 访问；回调延迟求值，在 BaseLayer 字段初始化处安全定义。
 */
export default class LayerPickingManager {
  private layer: BaseLayer;
  private currentPickId: number | null = null;
  private selectedFeatureID: number | null = null;
  private readonly rerender: () => void;

  constructor(layer: BaseLayer, rerender: () => void) {
    this.layer = layer;
    this.rerender = rerender;
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

  public active(options: IActiveOption | boolean) {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableHighlight = isObject(options) ? true : options;
    if (isObject(options)) {
      activeOption.enableHighlight = true;
      if (options.color) {
        activeOption.highlightColor = options.color;
      }
      if (options.mix) {
        activeOption.activeMix = options.mix;
      }
    } else {
      activeOption.enableHighlight = !!options;
    }
    this.layer.updateLayerConfig(activeOption);
    return this.layer;
  }

  public setActive(id: number | { x: number; y: number }, options?: IActiveOption): void {
    if (isObject(id)) {
      const { x = 0, y = 0 } = id;
      this.layer.updateLayerConfig({
        highlightColor: isObject(options)
          ? options.color
          : this.layer.getLayerConfig().highlightColor,
        activeMix: isObject(options) ? options.mix : this.layer.getLayerConfig().activeMix,
      });
      this.pick({ x, y });
    } else {
      this.layer.updateLayerConfig({
        pickedFeatureID: id,
        highlightColor: isObject(options)
          ? options.color
          : this.layer.getLayerConfig().highlightColor,
        activeMix: isObject(options) ? options.mix : this.layer.getLayerConfig().activeMix,
      });
      this.layer.hooks.beforeHighlight
        .call(encodePickingColor(id as number) as number[])
        // @ts-ignore
        .then(() => {
          setTimeout(() => {
            this.rerender();
          }, 1);
        });
    }
  }

  public select(option: IActiveOption | boolean) {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableSelect = isObject(option) ? true : option;
    if (isObject(option)) {
      activeOption.enableSelect = true;
      if (option.color) {
        activeOption.selectColor = option.color;
      }
      if (option.mix) {
        activeOption.selectMix = option.mix;
      }
    } else {
      activeOption.enableSelect = !!option;
    }
    this.layer.updateLayerConfig(activeOption);
    return this.layer;
  }

  public setSelect(id: number | { x: number; y: number }, options?: IActiveOption): void {
    if (isObject(id)) {
      const { x = 0, y = 0 } = id;
      this.layer.updateLayerConfig({
        selectColor: isObject(options) ? options.color : this.layer.getLayerConfig().selectColor,
        selectMix: isObject(options) ? options.mix : this.layer.getLayerConfig().selectMix,
      });
      this.pick({ x, y });
    } else {
      this.layer.updateLayerConfig({
        pickedFeatureID: id,
        selectColor: isObject(options) ? options.color : this.layer.getLayerConfig().selectColor,
        selectMix: isObject(options) ? options.mix : this.layer.getLayerConfig().selectMix,
      });
      this.layer.hooks.beforeSelect
        .call(encodePickingColor(id as number) as number[])
        // @ts-ignore
        .then(() => {
          setTimeout(() => {
            this.rerender();
          }, 1);
        });
    }
  }
}
