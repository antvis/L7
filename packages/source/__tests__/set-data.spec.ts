import '../src';
import { ParserNotFoundError } from '../src';
import Source from '../src/base-source';
import Point from './data/point';
import Polygon from './data/polygon';

/**
 * 阶段 4.3b — `setData` 失败 surfacing spec + 成功路径基线锁。
 *
 * 4.3b reframe（原 4.3b「同 schema skip re-parse」经勘探判定 dead-end —— 见
 * BACKLOG：setData 的昂贵步骤 parse / tilesetAdapter.init / bounds.update /
 * clusterManager.init / executeTrans 全 data-dependent，setData 本质即换 data，
 * skip 无收益）。实际 strictly-better 切片：setData 的 `init().then(emit 'update')`
 * 旧路径无 `.catch` → re-parse 失败时 `'update'` 不 fire（事件消费方 hang）+ 未捕获
 * rejection（吞错，同 4.2 为构造期 initPromise 修的 swallow/hang 模式）。现 `.catch`
 * 后 emit `'error'`（eventemitter3 无 Node 'error' 抛错语义，无监听即静默）。
 *
 * 成功路径基线锁（pass before & after 4.3b，字节级不变）：
 *   ① setData 触发 re-parse → `data.dataArray` 反映新数据、`getFeatureById` 反映新数据
 *      （featureIndex.reset 生效）；
 *   ② `'update'` fire 且 `'error'` 不 fire；
 *   ③ `dataVersion` bump（4.3a）、`inited` 经 false→true 周期恢复 true。
 *
 * 失败路径（4.3b 新行为）：
 *   ④ parse 失败 → `'error'` fire 且 payload 为 `ParserNotFoundError`；
 *   ⑤ `'update'` 不 fire（契约不变）；
 *   ⑥ `inited` 留 false、`dataVersion` 已 bump（reseat 已发生，recovery 不在范围）。
 */
describe('setData success baseline + failure surfacing (stage 4.3b)', () => {
  it('re-parses new data, fires update (not error), bumps version, restores inited', async () => {
    const source = await Source.create(Polygon);
    expect(source.dataVersion).toBe(0);
    expect(source.inited).toBe(true);

    let updateCount = 0;
    let errorCount = 0;
    source.on('update', () => {
      updateCount++;
    });
    source.on('error', () => {
      errorCount++;
    });

    const polygonLen = source.data.dataArray.length;

    const updateFired = new Promise<void>((res) => source.once('update', () => res()));
    source.setData(Point);

    // reseat 同步阶段即 bump（先于 'update' fire）
    expect(source.dataVersion).toBe(1);
    // init() 已置 inited=false（async init 首行同步执行）
    expect(source.inited).toBe(false);

    await updateFired;

    // re-parse 生效：data 反映 Point（featureIndex.reset + executeParser 重跑）。
    // dataArray 元素直接带 .id（filter transform callback item.id 同源）。
    expect(source.data.dataArray.length).toBeGreaterThan(0);
    expect(source.data.dataArray.length).not.toEqual(polygonLen);
    expect(source.data.dataArray.some((d: any) => d.id === 'ak16994521')).toBe(true);
    expect(source.inited).toBe(true); // init 周期恢复
    expect(updateCount).toBe(1);
    expect(errorCount).toBe(0);
  });

  it('surfaces parse failure via error event (was swallowed + unhandled rejection)', async () => {
    const source = await Source.create(Polygon);
    expect(source.inited).toBe(true);

    const errors: unknown[] = [];
    let updateFired = false;
    source.on('error', (err: unknown) => {
      errors.push(err);
    });
    source.on('update', () => {
      updateFired = true;
    });

    // 未注册 parser type → executeParser → registry.getParser 抛 ParserNotFoundError
    source.setData(Polygon, { parser: { type: 'nonexistent-parser' } });

    // reseat 已 bump（originData 已换，generation 推进，与 parse 成败无关）
    expect(source.dataVersion).toBe(1);
    expect(source.inited).toBe(false); // init() 首行置 false，失败未恢复

    // flush microtask 链：init() reject → .catch → emit('error')
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(ParserNotFoundError);
    expect(updateFired).toBe(false); // 失败不 fire 'update'（契约不变）
    expect(source.inited).toBe(false); // 失败留 false
  });

  it('does not produce unhandled rejection on failure (catch terminates chain)', async () => {
    // 4.3b 前旧路径无 .catch → 此场景产生 unhandled rejection 噪音。
    // 现 .catch 终止链，promise 完整 handled。本 case 无 await 也无 rejection 逃逸。
    const source = await Source.create(Polygon);
    let errored = false;
    source.on('error', () => {
      errored = true;
    });
    source.setData(Polygon, { parser: { type: 'nonexistent-parser' } });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(errored).toBe(true);
  });
});
