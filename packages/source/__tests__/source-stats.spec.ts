import Source from '../src/';
import Point from './data/point';
import Polygon from './data/polygon';

/**
 * 阶段 6.4 — `Source.stats()` 只读快照 spec。
 *
 * `stats()` 暴露 rows / bbox / parserType / tileCount / isTile / cluster /
 * dataVersion 七字段，便于调试与 size 监控。纯只读，不变 Source 状态，
 * 对 `new Source` / `Source.create` / `setData` / `updateFeaturePropertiesById`
 * 路径零行为变化（minor-safe 新增 API）。本 spec 锁定其「镜像内部状态」契约：
 *
 * - 非瓦片 geojson 源：rows = dataArray 行数、bbox = extent、parserType='geojson'、
 *   tileCount=0、isTile=false、cluster=false、dataVersion=0；
 * - 聚合源：cluster=true，初始未做 zoom 聚合时 rows 仍为全量 feature；
 * - 瓦片源（mvt）：isTile=true、parserType='mvt'、tileCount=0（瓦片随视口加载，
 *   无 tileset.update 时为 0）、rows=0（mvt parser dataArray=[]）；
 * - `setData` 后 stats 反映新行数 + dataVersion bump；
 * - `updateFeaturePropertiesById` bump dataVersion，行数不变；
 * - `stats()` 幂等且不改 Source 状态。
 */
describe('Source.stats() (stage 6.4)', () => {
  it('returns a read-only snapshot for a non-tile geojson source', async () => {
    const source = await Source.create(Polygon);
    const stats = source.stats();

    expect(stats.rows).toEqual(source.data.dataArray.length);
    expect(stats.rows).toEqual(Polygon.features.length); // 单 Polygon，flatten 不增行
    expect(stats.bbox).toEqual(source.extent);
    expect(stats.parserType).toEqual('geojson');
    expect(stats.tileCount).toEqual(0);
    expect(stats.isTile).toEqual(false);
    expect(stats.cluster).toEqual(false);
    expect(stats.dataVersion).toEqual(0);
  });

  it('parserType resolves the registered parser type (maps directive)', async () => {
    const source = await Source.create(Polygon, { parser: { type: 'geojson' } });
    expect(source.stats().parserType).toEqual('geojson');
    expect(source.getParserType()).toEqual(source.stats().parserType);
  });

  it('reflects cluster=true for a clustering source; rows = full features until zoom update', async () => {
    const source = await Source.create(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    const stats = source.stats();

    expect(stats.cluster).toEqual(true);
    // 初始未做 zoom 聚合，data.dataArray 仍是 parse 后全量 feature（非簇结果）。
    expect(stats.rows).toEqual(source.data.dataArray.length);
    expect(stats.rows).toBeGreaterThan(0);
    expect(stats.dataVersion).toEqual(0);
  });

  it('reflects a tile source: isTile=true, parserType=mvt, tileCount=0 before viewport update', async () => {
    const source = await Source.create('http://t/{z}/{x}/{y}.pbf', {
      parser: { type: 'mvt' },
    });
    const stats = source.stats();

    expect(stats.isTile).toEqual(true);
    expect(stats.parserType).toEqual('mvt');
    expect(stats.tileCount).toEqual(0); // 瓦片随视口动态加载，无 update 时 0
    expect(stats.rows).toEqual(0); // mvt parser 返回 dataArray=[]（数据在瓦片内）
    expect(stats.cluster).toEqual(false);
  });

  it('stats().rows tracks setData re-parse and dataVersion bumps', async () => {
    const source = await Source.create(Polygon);
    const before = source.stats();
    expect(before.rows).toEqual(Polygon.features.length);
    expect(before.dataVersion).toEqual(0);

    const updateFired = new Promise<void>((res) => source.once('update', () => res()));
    source.setData(Point);
    // reseat 同步阶段即 bump（先于 'update' fire）
    expect(source.stats().dataVersion).toEqual(before.dataVersion + 1);
    await updateFired;

    const after = source.stats();
    expect(after.dataVersion).toEqual(before.dataVersion + 1);
    expect(after.rows).toEqual(source.data.dataArray.length);
    expect(after.rows).not.toEqual(before.rows); // Polygon→Point 行数不同
  });

  it('dataVersion bumps on updateFeaturePropertiesById while rows unchanged', async () => {
    const source = await Source.create(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    const before = source.stats();

    source.updateFeaturePropertiesById(0, { mag: 100 });

    const after = source.stats();
    expect(after.dataVersion).toEqual(before.dataVersion + 1);
    expect(after.rows).toEqual(before.rows); // 属性更新不变行数
  });

  it('is idempotent and does not mutate Source state', async () => {
    const source = await Source.create(Polygon);
    const a = source.stats();
    const b = source.stats();
    expect(a).toEqual(b);
    // 反复调用不破坏内部 data / dataVersion
    expect(source.data).toBeDefined();
    expect(source.stats().dataVersion).toEqual(0);
  });
});
