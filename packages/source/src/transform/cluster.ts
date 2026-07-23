import type { IClusterOptions, IParserData } from '@antv/l7-core';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Supercluster from 'supercluster/dist/supercluster';
export function cluster(data: IParserData, option: Partial<IClusterOptions>): IParserData {
  const { radius = 40, maxZoom = 18, minZoom = 0, zoom = 2 } = option;
  if (data.pointIndex) {
    const clusterData = data.pointIndex.getClusters(data.extent, Math.floor(zoom));
    data.dataArray = formatData(clusterData);
    return data;
  }
  const pointIndex = new Supercluster({
    radius,
    minZoom,
    maxZoom,
  });
  const geojson: {
    type: string;
    features: any[];
  } = {
    type: 'FeatureCollection',
    features: [],
  };
  geojson.features = data.dataArray.map((item) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: item.coordinates,
      },
      properties: {
        ...item,
      },
    };
  });
  pointIndex.load(geojson.features);
  return pointIndex;
}
/**
 * 聚合 transform 链入口（已 @deprecated，阶段 4.4）。
 *
 * 历史上 `cluster` 既被 `ClusterManager.init` 直接调用（建 Supercluster 索引，
 * **live 正用**），又被注册为 transform 供 `transforms: [{ type: 'cluster' }]`
 * 消费（**Path B，broken**——`cluster()` 返回 Supercluster 实例，`executeTrans`
 * 的 `Object.assign(this.data, index)` 会把索引对象腐蚀到 `source.data` 上；
 * 仅因全仓零使用而未爆发）。
 *
 * 阶段 4.4 合并双路径：保留 `cluster: true` source config（由 ClusterManager
 * 直接调 `cluster()`）为唯一聚合入口；本 transform 保留注册以向后兼容 +
 * 发 deprecation warning，未来 major 移除。消费方迁移：`transforms:
 * [{type:'cluster'}]` → `cluster: true`（+ `clusterOptions`）。
 *
 * `ClusterManager.init` 直接 import `cluster`（非本函数），故 Path A 零 warning。
 */
let clusterTransformDeprecationWarned = false;
export function clusterTransform(data: IParserData, option: Partial<IClusterOptions>): IParserData {
  if (!clusterTransformDeprecationWarned) {
    console.warn(
      '[L7] `{ type: "cluster" }` transform is deprecated and corrupts source.data; ' +
        'use `cluster: true` source config (+ clusterOptions) instead.',
    );
    clusterTransformDeprecationWarned = true;
  }
  return cluster(data, option);
}

export function formatData(clusterPoint: any[]) {
  return clusterPoint.map((point, index) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties,
    };
  });
}
