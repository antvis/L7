/**
 * 内置 parser / transform 注册目录（阶段 2.4）。
 *
 * 把原 `index.ts` 顶层的 13 个 `registerParser(...)` + 6 个 `registerTransform(...)`
 * 收敛为单一函数 `registerBuiltins(registry = defaultRegistry)`，让 `index.ts` 的
 * 副作用 registration 可被显式调用 / 子集化 / 测试覆盖。
 *
 * 消费方使用方式：
 * - **默认（零改动）**：`import { Source } from '@antv/l7-source'` 触发 `index.ts`
 *   模块初始化调用 `registerBuiltins(defaultRegistry)`，全 13 parser + 6 transform
 *   注册到单例。
 * - **按需子集（tree-shaking 友好）**：`new ParserRegistry()` + 手工
 *   `myRegistry.registerParser('csv', csv)` 仅注册用到的 parser，避免拉满 13 个
 *   parser 的实现代码；阶段 2.5 `createSource(data, cfg, registry?)` 工厂可注入。
 *
 * `package.json sideEffects: ["./es/index.js"]` 明示 bundler 仅 `index` 入口有
 * 副作用；本文件无顶层副作用，消费方不调用 `registerBuiltins` 就不会拉入 13 个
 * parser 实现（经子路径 import 时可 tree-shake）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 2.4
 */
import type { ParserRegistry } from './parser-registry';
import { defaultRegistry } from './parser-registry';
import csv from './parser/csv';
import geojson from './parser/geojson';
import geojsonVTTile from './parser/geojsonvt';
import image from './parser/image';
import json from './parser/json';
import jsonTile from './parser/jsonTile';
import mapboxVectorTile from './parser/mvt';
import ndi from './parser/ndi';
import raster from './parser/raster';
import rasterTile from './parser/raster-tile';
import rasterRgb from './parser/rasterRgb';
import rgb from './parser/rgb';
import testTile from './parser/testTile';
import { cluster } from './transform/cluster';
import { filter } from './transform/filter';
import { aggregatorToGrid } from './transform/grid';
import { pointToHexbin } from './transform/hexagon';
import { join } from './transform/join';
import { map } from './transform/map';

/**
 * 向指定 registry 注册全部 13 个内置 parser + 6 个内置 transform。
 *
 * 注册键名与 `KnownParsers` / `KnownTransforms`（阶段 2.x 补抽 Transform 契约后）
 * 弱契约对齐。键名拼写需与 `base-source.ts` / `cluster-manager.ts` 等
 * `getParser(type)` 调用方的 `type` 字面量逐一对应 —— 改名需同步。
 *
 * @param registry 目标注册表，默认 `defaultRegistry` 单例。传入自定义
 *   `new ParserRegistry()` 可隔离注册表，便于按需子集化 / 测试隔离。
 */
export function registerBuiltins(registry: ParserRegistry = defaultRegistry): void {
  registry.registerParser('rasterTile', rasterTile);
  registry.registerParser('mvt', mapboxVectorTile);
  registry.registerParser('geojsonvt', geojsonVTTile);
  registry.registerParser('testTile', testTile);
  registry.registerParser('geojson', geojson);
  registry.registerParser('jsonTile', jsonTile);
  registry.registerParser('image', image);
  registry.registerParser('csv', csv);
  registry.registerParser('json', json);
  registry.registerParser('raster', raster);
  registry.registerParser('rasterRgb', rasterRgb);
  registry.registerParser('rgb', rgb);
  registry.registerParser('ndi', ndi);
  registry.registerTransform('cluster', cluster);
  registry.registerTransform('filter', filter);
  registry.registerTransform('join', join);
  registry.registerTransform('map', map);
  registry.registerTransform('grid', aggregatorToGrid);
  registry.registerTransform('hexagon', pointToHexbin);
}
