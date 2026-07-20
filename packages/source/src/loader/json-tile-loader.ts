import type { ITileParserCFG } from '@antv/l7-core';
import type { RequestParameters, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getData, getURLFromTemplate } from '@antv/l7-utils';
import type { ITileSource, MapboxVectorTile } from '../interface';
import GeoJSONVTTileSource from '../tile-source/geojsonvt';
import type { TileLoader } from './tile-loader';

/**
 * jsonTile 瓦片加载器（阶段 3.1）。
 *
 * 从原 `parser/jsonTile.ts` 的模块级 `getVectorTile` 闭包机械抽取而来 ——
 * 行为与迁移前 100% 等价：
 * - `getCustomData` 优先（cb 回调取数，err/无数据 resolve 空 defaultLayer）；
 * - 否则走 `getData` 回调取数（err/无数据 resolve 空 defaultLayer，成功
 *   `JSON.parse` 后 features 入 defaultLayer）；
 * - err 永不 reject，统一 resolve 一个 `GeoJSONVTTileSource`。
 *
 * 注意：jsonTile 的 `getTileData` 历史上忽略 `TileLoadParams`（第一参 `_`），
 * 用 `SourceTile.x/y/z` 生成 url 模板参数与 `getCustomData` 入参。本 loader
 * 保持该行为（`loadTile` 用 `tile.x/y/z`，不对 `tileParams` 做处理）。
 *
 * 取消语义：jsonTile 原实现无 `tile.xhrCancel` 设置（`getData` 回调风格未
 * 暴露取消句柄），本 loader 保持等价 —— 不设置 `xhrCancel`。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1
 */
export class JsonTileLoader implements TileLoader {
  constructor(
    private readonly url: string,
    private readonly requestParameters?: Partial<RequestParameters>,
    private readonly getCustomData?: ITileParserCFG['getCustomData'],
  ) {}

  public loadTile(_tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource> {
    const params = { x: tile.x, y: tile.y, z: tile.z };
    const tileUrl = getURLFromTemplate(this.url, params);
    return new Promise((resolve) => {
      if (this.getCustomData) {
        this.getCustomData(params, (err, data) => {
          if (err || !data) {
            const vectorTile: MapboxVectorTile = {
              layers: { defaultLayer: { features: [] } },
            };
            resolve(new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z));
          } else {
            const vectorTile: MapboxVectorTile = {
              layers: { defaultLayer: { features: data.features } },
            };
            resolve(new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z));
          }
        });
      } else {
        getData(
          {
            ...this.requestParameters,
            url: tileUrl,
          },
          (err, data) => {
            if (err || !data) {
              const vectorTile: MapboxVectorTile = {
                layers: {
                  defaultLayer: {
                    features: [],
                  },
                },
              };
              resolve(new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z));
            } else {
              const json = JSON.parse(data);
              const vectorTile: MapboxVectorTile = {
                layers: {
                  defaultLayer: {
                    features: json,
                  },
                },
              };
              resolve(new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z));
            }
          },
        );
      }
    });
  }
}
