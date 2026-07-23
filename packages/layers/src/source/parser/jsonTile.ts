import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import type { IParserData } from '../interface';
import { JsonTileLoader } from '../loader/json-tile-loader';

/**
 * jsonTile parser（阶段 3.1：getVectorTile 闭包抽取为 `JsonTileLoader`）。
 *
 * parser 只负责「组装 `tilesetOptions.getTileData` 指向 loader」—— 数据
 * 获取（fetch / getCustomData 回调）下沉到 `JsonTileLoader.loadTile`。
 * 行为与迁移前等价：`getTileData(_, tile)` 忽略 `TileLoadParams`，用
 * `SourceTile` 驱动 loader（loader 内部用 `tile.x/y/z`）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1
 */
export default function jsonTile(url: string, cfg: ITileParserCFG): IParserData {
  const loader = new JsonTileLoader(url, cfg?.requestParameters, cfg.getCustomData);
  const getTileData = (_: TileLoadParams, tile: SourceTile) => loader.loadTile(_, tile);

  const tilesetOptions = {
    ...cfg,
    getTileData,
  };

  return {
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
