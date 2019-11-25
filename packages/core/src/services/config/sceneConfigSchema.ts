import { MapType } from '../map/IMapService';

/**
 * 场景 Schema
 */
export default {
  properties: {
    // 地图容器 ID
    id: {
      type: 'string',
    },
    // 地图类型，目前支持高德 & Mapbox
    type: {
      enum: [MapType.amap, MapType.mapbox],
    },
    // 地图缩放等级
    zoom: {
      type: 'number',
      minimum: 0,
      maximum: 20,
    },
    // 地图中心点
    center: {
      item: {
        type: 'number',
      },
      maxItems: 2,
      minItems: 2,
    },
    // 仰角
    pitch: {
      type: 'number',
    },
  },
};
