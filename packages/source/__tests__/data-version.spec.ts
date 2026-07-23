import '../src';
import Source from '../src/base-source';
import Point from './data/point';
import Polygon from './data/polygon';

/**
 * 阶段 4.3a — `source.dataVersion` 数据版本计数器 spec（纯叠加 infra）。
 *
 * 锁死 4.3a 契约：
 *   ① 初始数据（构造期首次 parse）= generation 0，`dataVersion === 0`；
 *   ② `setData`（全量 reseat）bump +1，且 bump 在 reseat 同步阶段即生效（先于
 *      `'update'` 事件 fire）—— 下游可据此判断「新版本 in-flight，缓存已过期」；
 *   ③ 连续 `setData` 单调递增；
 *   ④ `updateFeaturePropertiesById`（原地属性变更）bump +1；
 *   ⑤ `updateClusterData`（zoom 驱动聚合视图重算）**不** bump（originData 未变）。
 *
 * 纯叠加：本字段对 `new Source` / `Source.create` / `setData` /
 * `updateFeaturePropertiesById` / `updateClusterData` 路径零行为变化（仅新增只读
 * 语义字段）。未来 4.3b 据本字段做「同 schema skip re-parse」前先补调用链画像。
 */
describe('source.dataVersion counter (stage 4.3a infra)', () => {
  it('initial parse is generation 0 (not bumped)', async () => {
    const source = await Source.create(Polygon);
    expect(source.dataVersion).toBe(0);
    const syncSource = new Source(Polygon);
    expect(syncSource.dataVersion).toBe(0); // sync 构造期同样 0
    await syncSource.ready;
    expect(syncSource.dataVersion).toBe(0); // init settle 后仍 0（构造期不 bump）
  });

  it('setData bumps synchronously at reseat (before update fires)', async () => {
    const source = await Source.create(Polygon);
    expect(source.dataVersion).toBe(0);

    let updateFired = false;
    source.once('update', () => {
      updateFired = true;
    });
    source.setData(Point);
    // bump 在 reseat 同步阶段即生效，此时 'update' 尚未 fire（init 仍 in-flight）
    expect(source.dataVersion).toBe(1);
    expect(updateFired).toBe(false);

    // 等到 update fire：data 已 re-parse，version 仍为 1
    await new Promise<void>((res) => source.once('update', () => res()));
    expect(updateFired).toBe(true);
    expect(source.dataVersion).toBe(1);
    expect(source.data.dataArray.length).toBeGreaterThan(0);
  });

  it('repeated setData increments monotonically', async () => {
    const source = await Source.create(Polygon);
    expect(source.dataVersion).toBe(0);

    source.setData(Point);
    expect(source.dataVersion).toBe(1);
    await new Promise<void>((res) => source.once('update', () => res()));

    source.setData(Polygon);
    expect(source.dataVersion).toBe(2);
    await new Promise<void>((res) => source.once('update', () => res()));

    source.setData(Point);
    expect(source.dataVersion).toBe(3);
    await new Promise<void>((res) => source.once('update', () => res()));
  });

  it('updateFeaturePropertiesById bumps (in-place mutation)', async () => {
    const source = await Source.create(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    expect(source.dataVersion).toBe(0);

    source.updateFeaturePropertiesById(0, { mag: 100 });
    expect(source.dataVersion).toBe(1);
    expect((source.getFeatureById(0) as any).mag).toEqual(100);

    source.updateFeaturePropertiesById(0, { mag: 200 });
    expect(source.dataVersion).toBe(2);
    expect((source.getFeatureById(0) as any).mag).toEqual(200);
  });

  it('updateClusterData does NOT bump (zoom-driven view recompute)', async () => {
    const source = await Source.create(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    expect(source.dataVersion).toBe(0);

    source.updateClusterData(2);
    expect(source.data.dataArray.length).toEqual(110);
    expect(source.dataVersion).toBe(0); // 聚合视图重算，originData 未变 → 不 bump

    source.updateClusterData(3);
    expect(source.data.dataArray.length).toEqual(217);
    expect(source.dataVersion).toBe(0);
  });
});
