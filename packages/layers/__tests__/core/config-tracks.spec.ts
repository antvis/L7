import { globalConfigService } from '@antv/l7-core';
import BaseLayer from '../../src/core/BaseLayer';

/**
 * 阶段 3.1 特征化 spec：锁定「配置三轨」当前行为，供 `LayerConfigModel`
 * 收敛提取（3.1）在「零行为变化」约束下回归：
 *
 *   rawConfig —— 构造入参快照（protected，选择性同步：仅更新已存在的键）
 *   needUpdateConfig —— init 前的 diff 缓冲（private，init 后写穿即清空）
 *   getLayerConfig() —— configService 读回（globalConfigService 单例缓存，
 *                       merge(sceneConfig, defaultLayerConfig, layer 写入)）
 *
 * 这些用例刻画 `updateLayerConfig` / `getLayerConfig` / ctor 的全部可观
 * 察契约（pre-init 缓冲 + 选择性 rawConfig 同步、post-init 写穿 + 缓存
 * 合并 + 清空缓冲、新键写入缓存但不进 rawConfig、既有键无条件同步进
 * rawConfig）。任何收敛提取破坏任一不变量即应使本 spec 失败。
 */
type LayerRoot = {
  rawConfig: Record<string, unknown>;
  needUpdateConfig: Record<string, unknown>;
  container: { id: string };
};

function root(layer: BaseLayer): LayerRoot {
  return layer as unknown as LayerRoot;
}

describe('config three-tracks (stage-3 3.1)', () => {
  it('ctor snapshots rawConfig from input config + derives name', () => {
    const layer = new BaseLayer({ name: 'A', layerType: 'polygon', autoFit: true });
    const r = root(layer);
    expect(r.rawConfig.name).toBe('A');
    expect(r.rawConfig.layerType).toBe('polygon');
    expect(r.rawConfig.autoFit).toBe(true);
    expect(layer.name).toBe('A');
  });

  it('pre-init: getLayerConfig() returns undefined (configService cache not seeded)', () => {
    const layer = new BaseLayer({ name: 'B' });
    expect(layer.getLayerConfig()).toBeUndefined();
  });

  it('pre-init: no pending config diff (prepareBuildModel view: Object.keys(needUpdateConfig || {}).length === 0)', () => {
    const layer = new BaseLayer({ name: 'C' });
    // needUpdateConfig is lazily initialized (undefined until first buffer);
    // the only consumer (prepareBuildModel) reads it via `Object.keys(x || {})`,
    // so the observable contract is "no pending diff to flush".
    const pending = root(layer).needUpdateConfig;
    expect(Object.keys(pending || {}).length).toBe(0);
  });

  it('pre-init: updateLayerConfig buffers into needUpdateConfig (no write-through)', () => {
    const layer = new BaseLayer({ name: 'D', autoFit: false });
    layer.updateLayerConfig({ autoFit: true, name: 'D2' });
    expect(root(layer).needUpdateConfig).toMatchObject({ autoFit: true, name: 'D2' });
    // pre-init never seeds configService
    expect(layer.getLayerConfig()).toBeUndefined();
  });

  it('pre-init: updateLayerConfig syncs rawConfig ONLY for keys already present', () => {
    const layer = new BaseLayer({ name: 'E', autoFit: false });
    const r = root(layer);
    layer.updateLayerConfig({ autoFit: true, extrude: 5 }); // autoFit exists, extrude does not
    expect(r.rawConfig.autoFit).toBe(true); // synced (existing key)
    expect(r.rawConfig.extrude).toBeUndefined(); // NOT added to rawConfig
    expect(r.needUpdateConfig.extrude).toBe(5); // but buffered
  });

  it('pre-init: accumulates across multiple updateLayerConfig (last write wins)', () => {
    const layer = new BaseLayer({ name: 'F', autoFit: false });
    const r = root(layer);
    layer.updateLayerConfig({ autoFit: true, name: 'F1' });
    layer.updateLayerConfig({ autoFit: false });
    expect(r.needUpdateConfig).toMatchObject({ name: 'F1', autoFit: false });
    expect(r.rawConfig.autoFit).toBe(false); // last write wins for existing key
  });

  it('post-init: buffered needUpdateConfig flushes to configService + buffer cleared', () => {
    const layer = new BaseLayer({ name: 'G', autoFit: false });
    const r = root(layer);
    const sceneId = 'scene-g';
    globalConfigService.setSceneConfig(sceneId, {});
    // buffer pre-init
    layer.updateLayerConfig({ autoFit: true });
    expect(r.needUpdateConfig).toMatchObject({ autoFit: true });
    // simulate post-init state (init() would set startInit + container)
    layer.startInit = true;
    r.container = { id: sceneId };
    // flush: {} patch triggers write-through of buffered needUpdateConfig
    layer.updateLayerConfig({});
    expect(r.needUpdateConfig).toEqual({});
    const cfg = layer.getLayerConfig();
    expect(cfg?.autoFit).toBe(true); // flushed patch
    expect(cfg?.visible).toBe(true); // defaultLayerConfig merged in
    expect(cfg?.size).toBe(10);
  });

  it('post-init: updateLayerConfig merges new patch on top of cached config', () => {
    const layer = new BaseLayer({ name: 'H', autoFit: false });
    const r = root(layer);
    const sceneId = 'scene-h';
    globalConfigService.setSceneConfig(sceneId, {});
    layer.startInit = true;
    r.container = { id: sceneId };
    layer.updateLayerConfig({ autoFit: true, pickingBuffer: 4 });
    expect(layer.getLayerConfig()?.autoFit).toBe(true);
    expect(layer.getLayerConfig()?.pickingBuffer).toBe(4);
    layer.updateLayerConfig({ pickingBuffer: 9 }); // subsequent patch
    const cfg = layer.getLayerConfig();
    expect(cfg?.autoFit).toBe(true); // preserved
    expect(cfg?.pickingBuffer).toBe(9); // overwritten
    expect(cfg?.visible).toBe(true); // default still present
  });

  it('post-init: new keys go to configService cache but NOT into rawConfig', () => {
    const layer = new BaseLayer({ name: 'I' });
    const r = root(layer);
    const sceneId = 'scene-i';
    globalConfigService.setSceneConfig(sceneId, {});
    layer.startInit = true;
    r.container = { id: sceneId };
    layer.updateLayerConfig({ enableMultiPassRenderer: true }); // not in rawConfig
    expect(r.rawConfig.enableMultiPassRenderer).toBeUndefined(); // rawConfig untouched
    expect(layer.getLayerConfig()?.enableMultiPassRenderer).toBe(true); // but cached
  });

  it('post-init: existing keys are still synced into rawConfig (sync runs unconditionally)', () => {
    const layer = new BaseLayer({ name: 'J', autoFit: false });
    const r = root(layer);
    const sceneId = 'scene-j';
    globalConfigService.setSceneConfig(sceneId, {});
    layer.startInit = true;
    r.container = { id: sceneId };
    layer.updateLayerConfig({ autoFit: true });
    expect(r.rawConfig.autoFit).toBe(true); // existing key synced (sync runs before branch)
    expect(layer.getLayerConfig()?.autoFit).toBe(true); // and cached
  });
});
