import { defaultRegistry } from '../src';
import { cluster, clusterTransform } from '../src/transform/cluster';
import Point from './data/point';

/**
 * 阶段 4.4 — cluster 双路径合并 deprecation 契约。
 *
 * `cluster()` 是 Supercluster 工厂，被 `ClusterManager.init` **直接调用**（Path A，
 * `cluster: true` source config，live 正用，无 deprecation）。历史上它同时被注册
 * 为 transform 供 `transforms:[{type:'cluster'}]` 消费（Path B）——但 Path B 会把
 * `cluster()` 返回的 Supercluster 实例 `Object.assign` 到 `source.data` 腐蚀数据
 * （仅因全仓零使用未爆发）。4.4 保留 `cluster: true` cfg 为唯一聚合入口，transform
 * 链入口改 `clusterTransform`（warn + delegate），向后兼容 + deprecation surface。
 *
 * 本 spec 锁：
 *   ① `clusterTransform` 仍注册为 'cluster' transform（向后兼容，getTransform 不抛）；
 *   ② 首次调用 emit deprecation warning（once-guard）；
 *   ③ `clusterTransform` delegate 到 `cluster`（返回值与 `cluster` 等价）；
 *   ④ `cluster` 直调无 warning（Path A 零 deprecation 噪音）。
 */

const geojsonData = {
  type: 'FeatureCollection' as const,
  features: Point.features.slice(0, 5).map((f: any) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: f.geometry.coordinates },
    properties: { ...f.properties },
  })),
};

describe('阶段 4.4: cluster transform deprecation', () => {
  it("'cluster' transform 仍注册为 clusterTransform（getTransform 不抛、为 function）", () => {
    expect(typeof defaultRegistry.getTransform('cluster')).toBe('function');
  });

  it('clusterTransform 首次调用 emit deprecation warning（once-guard，二次静默）', () => {
    // jest 文件级模块隔离：本文件是唯一触发 clusterTransform 的测试，guard 在
    // 文件加载时 fresh，test 2 首调即首触发。cluster（test 3）不触 guard。
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // IParserData 形态：cluster() 在无 pointIndex 时建 Supercluster 并 load
    const pseudoData: any = {
      dataArray: geojsonData.features.map((f: any, i: number) => ({
        coordinates: f.geometry.coordinates,
        _id: i + 1,
        ...f.properties,
      })),
      extent: [-180, -90, 180, 90],
    };
    clusterTransform(pseudoData, { radius: 40, maxZoom: 18, minZoom: 0, zoom: 2 });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('deprecated');

    clusterTransform(pseudoData, { radius: 40, maxZoom: 18, minZoom: 0, zoom: 2 });
    expect(warnSpy).toHaveBeenCalledTimes(1); // once-guard
    warnSpy.mockRestore();
  });

  it('cluster 直调无 deprecation warning（Path A: ClusterManager 直调零噪音）', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const pseudoData: any = {
      dataArray: geojsonData.features.map((f: any, i: number) => ({
        coordinates: f.geometry.coordinates,
        _id: i + 1,
        ...f.properties,
      })),
      extent: [-180, -90, 180, 90],
    };
    cluster(pseudoData, { radius: 40, maxZoom: 18, minZoom: 0, zoom: 2 });
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
