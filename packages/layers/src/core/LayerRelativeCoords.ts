import type { IParseDataItem } from '@antv/l7-core';
import { processRelativeCoordinates } from '@antv/l7-utils';
import type BaseLayer from './BaseLayer';

/**
 * 相对坐标状态与转换 delegate（阶段 1.4）。
 *
 * 收口 BaseLayer 中相对坐标相关逻辑：
 * - 状态 `relativeOrigin` / `originalExtent` / `absoluteDataArray`（均原 protected
 *   字段，外部经 ILayer getter 访问、无一字段直读，已确认）
 * - 转换 `processRelativeCoordinates()`（原 protected，读 `getLayerConfig`
 *   + 经公开 `getSource()` 读写 `source.data.dataArray`）
 * - getter `getAbsoluteData` / `getRelativeOrigin` / `getOriginalExtent`
 *
 * `processRelativeCoordinates` 在 BaseLayer 内部多处调用（init / setData 钩子），
 * 经 BaseLayer 保留 protected 薄转发桥接；逻辑字节级镜像原实现。
 * `layerSource`（protected）不跨类直访——经公开 `layer.getSource()` 返回同一
 * 引用后读写 `data.dataArray`，mutation 经引用生效。子类 override 路径不变
 * （全仓无子类 override 这一组，已确认）。
 */
export default class LayerRelativeCoords {
  private layer: BaseLayer;
  private relativeOrigin: [number, number] = [0, 0];
  private originalExtent: [number, number, number, number] = [0, 0, 0, 0];
  private absoluteDataArray: IParseDataItem[] = []; // 保存绝对坐标数据用于交互

  constructor(layer: BaseLayer) {
    this.layer = layer;
  }

  /**
   * 处理相对坐标转换
   */
  public processRelativeCoordinates() {
    const layerConfig = this.layer.getLayerConfig();
    const enableRelativeCoordinates = (layerConfig as any)?.enableRelativeCoordinates;

    const layerSource = this.layer.getSource();
    if (!enableRelativeCoordinates || !layerSource || !layerSource.data) {
      return;
    }

    // 保存原始绝对坐标数据用于交互
    this.absoluteDataArray = [...layerSource.data.dataArray];

    // 处理相对坐标转换
    const result = processRelativeCoordinates(layerSource.data.dataArray, {
      enableRelativeCoordinates: true,
    });

    // 更新 source 数据为相对坐标
    layerSource.data.dataArray = result.dataArray;
    this.relativeOrigin = result.relativeOrigin;
    this.originalExtent = result.originalExtent;
  }

  /**
   * 获取绝对坐标数据（用于交互计算）
   */
  public getAbsoluteData() {
    return this.absoluteDataArray;
  }

  /**
   * 获取相对坐标原点
   */
  public getRelativeOrigin() {
    return this.relativeOrigin;
  }

  /**
   * 获取原始数据范围
   */
  public getOriginalExtent() {
    return this.originalExtent;
  }
}
