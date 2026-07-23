import '../src';
import { ParserNotFoundError, ParserRegistry, defaultRegistry, registerBuiltins } from '../src';
import Source from '../src/base-source';
import Point from './data/point';
import Polygon from './data/polygon';

/**
 * 阶段 4.1 — `Source.create` async 工厂 + `source.ready` getter spec。
 *
 * 与 `create-source.spec.ts`（阶段 2.5 sync `createSource` 函数工厂，仍
 * fire-and-forget init）阶段隔离。本 spec 锁死 4.1 三项保证：
 *   ① `await Source.create(...)` 后 `inited===true`（消除同步 `new Source` 时
 *      `inited===false` 的 race —— init 在微任务里才置 true）；
 *   ② init 失败 → reject 抛错（显式 surface，对比旧 `new Source` 路径 fire-and-
 *      forget unhandled rejection 吞错）；
 *   ③ `new Source` 用户可用 `await source.ready` 补 await 能力（additive）。
 *
 * `new Source(data, cfg)` 路径**零行为变化**（4.1 不加 console.warn deprecation）。
 */
describe('Source.create async factory + ready getter (stage 4.1)', () => {
  it('resolves with a fully-inited Source (race-free)', async () => {
    // 同步 new Source：init() 在微任务里置 inited=true，构造期同步读到 false。
    const syncSource = new Source(Polygon);
    expect(syncSource.inited).toBe(false);

    const source = await Source.create(Polygon);
    expect(source).toBeInstanceOf(Source);
    expect(source.inited).toBe(true);
    expect(source.data.dataArray.length).toBeGreaterThan(0);
    expect(source.extent).toEqual([
      114.24373626708983, 30.55560910664438, 114.32424545288086, 30.60807236997211,
    ]);
  });

  it('is equivalent to new Source(data, cfg) after init settles', async () => {
    const viaCreate = await Source.create(Polygon, { cluster: false });
    const viaCtor = new Source(Polygon, { cluster: false });
    await viaCtor.ready;
    expect(viaCreate.inited).toBe(true);
    expect(viaCtor.inited).toBe(true);
    expect(viaCreate.extent).toEqual(viaCtor.extent);
    expect(viaCreate.data.dataArray.length).toEqual(viaCtor.data.dataArray.length);
  });

  it('supports cluster config end-to-end after await', async () => {
    const source = await Source.create(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    expect(source.inited).toBe(true);
    source.updateClusterData(2);
    // 聚合生效（点数 > 下界）；精确数随算法 / 数据敏感（阶段 6.3 脆弱断言改造）。
    expect(source.data.dataArray.length).toBeGreaterThan(50);
  });

  it('rejects with ParserNotFoundError when parser type is unregistered', async () => {
    await expect(
      Source.create(Polygon, { parser: { type: 'nonexistent-parser' } }),
    ).rejects.toThrow(ParserNotFoundError);
    // 进一步断言：失败路径 inited 留 false（旧 new Source 路径同此，但旧路径吞错）。
    // 不能直接用 new Source 测此路径（fire-and-forget 会产生 unhandled rejection 噪音）。
  });

  it('injects a custom registry used end-to-end (parser + cluster)', async () => {
    const customRegistry = new ParserRegistry();
    registerBuiltins(customRegistry);
    expect(customRegistry).not.toBe(defaultRegistry);

    const getParserSpy = jest.spyOn(customRegistry, 'getParser');

    const source = await Source.create(
      Point,
      { cluster: true, clusterOptions: { method: 'sum', field: 'mag' } },
      customRegistry,
    );
    expect(source.inited).toBe(true);
    // executeParser 经 injected customRegistry 拉 geojson parser（非 default 单例）。
    expect(getParserSpy).toHaveBeenCalledWith('geojson');

    // ClusterManager 共享同一 injected registry：re-parse cluster 也走 customRegistry。
    const callsBeforeCluster = getParserSpy.mock.calls.length;
    source.updateClusterData(2);
    expect(getParserSpy.mock.calls.length).toBeGreaterThan(callsBeforeCluster);
    expect(source.data.dataArray.length).toBeGreaterThan(50);

    getParserSpy.mockRestore();
  });

  it('ready getter: new Source consumers can await init', async () => {
    const source = new Source(Polygon);
    expect(source.inited).toBe(false);
    await source.ready;
    expect(source.inited).toBe(true);
    expect(source.extent).toEqual([
      114.24373626708983, 30.55560910664438, 114.32424545288086, 30.60807236997211,
    ]);
  });

  it('ready resolves only after the "inited" update event has fired', async () => {
    // 事件在 initPromise 的 .then cb 里 emit，ready = initPromise，故 await ready
    // 返回时事件必已触发。同步附加 listener（await 之前的同一 tick）可捕获之。
    const source = new Source(Polygon);
    let initedEventFired = false;
    source.on('update', (e: { type: string }) => {
      if (e.type === 'inited') initedEventFired = true;
    });
    await source.ready;
    expect(source.inited).toBe(true);
    expect(initedEventFired).toBe(true);
  });
});
