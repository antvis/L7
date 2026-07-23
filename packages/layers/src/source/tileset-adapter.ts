import type { IParserData } from '@antv/l7-core';
import type { SourceTile } from '@antv/l7-utils';
import { TilesetManager } from '@antv/l7-utils';

/**
 * 瓦片数据管理器 delegate（阶段 1.2）。
 *
 * 从 `base-source.ts` 抽出的瓦片管理职责 —— 封装 `TilesetManager` 实例的
 * 创建/更新/销毁，以及 7 个 reload/getTile 转发方法。`Source` 通过
 * getter 与方法转发对外保持 `ISource.tileset` / `ISource.isTile` /
 * `reloadAllTile` / `reloadTilebyId` / `reloadTileByLnglat` /
 * `reloadTileByExtent` / `getTileExtent` / `getTileByZXY` 完全等价。
 *
 * 与 `ClusterManager` 不同，本 delegate **公开** `manager` 字段：layers 包
 * 的 `tile/core/BaseLayer.ts` 直接读 `source.tileset as TilesetManager`
 * 后借用实例（update / on / destroy / tiles.filter / currentTiles 等），
 * 因此不能把 manager 藏成 private —— `Source.tileset` getter 直接返回
 * `adapter.manager`，让 layers 拿到的就是同一个 `TilesetManager` 实例。
 *
 * 行为兼容：
 * - `init()` 复用原 `initTileset` 的「已存在则 updateOptions、否则新建」语义
 * - `isTile` 在 `tilesetOptions` 存在时置 true，不主动重置（与原行为一致；
 *   setData 切回非瓦片数据时 isTile 保留旧值，原代码亦如此）
 */
export class TilesetAdapter {
  /** 当前 TilesetManager 实例（layers 直接借用，不要藏 private） */
  public manager: TilesetManager | undefined;

  /** 是否为瓦片数据源（data.tilesetOptions 存在时为 true） */
  public isTile: boolean = false;

  /**
   * 解析后调用：根据 `data.tilesetOptions` 创建或更新 TilesetManager。
   * 对应原 `Source.initTileset`。
   */
  public init(data: IParserData): void {
    const { tilesetOptions } = data;
    if (!tilesetOptions) {
      return;
    }
    this.isTile = true;
    if (this.manager) {
      this.manager.updateOptions(tilesetOptions);
      return;
    }

    this.manager = new TilesetManager({
      ...tilesetOptions,
    });
  }

  /** 重新加载所有瓦片（对应原 `Source.reloadAllTile`） */
  public reloadAllTile(): void {
    this.manager?.reloadAll();
  }

  /** 按 z/x/y 重载瓦片（对应原 `Source.reloadTilebyId`，沿用原拼写） */
  public reloadTilebyId(z: number, x: number, y: number): void {
    this.manager?.reloadTileById(z, x, y);
  }

  /** 按经纬度重载瓦片（对应原 `Source.reloadTileByLnglat`） */
  public reloadTileByLnglat(lng: number, lat: number, z: number): void {
    this.manager?.reloadTileByLnglat(lng, lat, z);
  }

  /** 按范围重载瓦片（对应原 `Source.reloadTileByExtent`） */
  public reloadTileByExtent(bounds: [number, number, number, number], z: number): void {
    this.manager?.reloadTileByExtent(bounds, z);
  }

  /** 查询覆盖指定范围的瓦片（对应原 `Source.getTileExtent`） */
  public getTileExtent(
    e: [number, number, number, number],
    zoom: number,
  ): Array<{ x: number; y: number; z: number }> | undefined {
    return this.manager?.getTileExtent(e, zoom);
  }

  /** 按 z/x/y 取瓦片（对应原 `Source.getTileByZXY`） */
  public getTileByZXY(z: number, x: number, y: number): SourceTile | undefined {
    return this.manager?.getTileByZXY(z, x, y);
  }

  /** 销毁 TilesetManager（对应原 `Source.destroy` 中的 `this.tileset?.destroy()`） */
  public destroy(): void {
    this.manager?.destroy();
  }
}
