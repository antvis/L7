import type { BBox } from '@turf/helpers';

/**
 * 数据范围 value object（阶段 1.4）。
 *
 * 从 `base-source.ts` 抽出的范围计算职责 —— 封装 `extent` / `center` /
 * `invalidExtent` 三态 + `setCenter` 中心点推导。`Source.extent` /
 * `Source.center` 改 getter 转发 `bounds.extent` / `.center`，
 * `executeParser` 末尾的范围计算收敛为 `bounds.update(bbox)` 一次调用。
 *
 * 「value object」语义：状态由 `update` 原子写入，对外只读不写（Source
 * 不再 `this.extent = ...` / `this.center = ...` / `this.invalidExtent = ...`
 * 三处分散赋值）。
 *
 * 默认中心点（NaN 兜底）：原代码注释「Infinity - Infinity = NaN」，用
 * 大地原点 `[108.92361111111111, 34.54083333333333]` 兜底，保留原行为。
 */
export class Bounds {
  /** 数据范围 [minLng, minLat, maxLng, maxLat] */
  public extent: BBox;

  /** 范围中心点 [lng, lat] */
  public center: [number, number];

  /** 范围是否退化（单点 / 经纬度任一维度为零宽）*/
  public invalidExtent: boolean = false;

  /**
   * 用计算好的 bbox 更新范围、中心点、有效性。
   * 对应原 `executeParser` 末尾三行 + `setCenter` 的合并。
   */
  public update(bbox: BBox): void {
    this.extent = bbox;
    this.setCenter(bbox);
    this.invalidExtent = bbox[0] === bbox[2] || bbox[1] === bbox[3];
  }

  /**
   * 由 bbox 推导中心点。NaN（Infinity - Infinity）时回退大地原点。
   * 对应原 `Source.setCenter`。
   */
  private setCenter(bbox: BBox): void {
    this.center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
    if (isNaN(this.center[0]) || isNaN(this.center[1])) {
      // this.center = [NaN, NaN] // Infinity - Infinity = NaN
      // 默认设置为大地原点
      this.center = [108.92361111111111, 34.54083333333333];
    }
  }
}
