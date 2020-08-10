/**
 * 地图 Schema
 */
export default {
  properties: {
    // 地图缩放等级
    zoom: {
      type: 'number',
      minimum: -1,
      maximum: 24,
    },
    minZoom: {
      type: 'number',
      minimum: -1,
      maximum: 24,
    },
    maxZoom: {
      type: 'number',
      minimum: -1,
      maximum: 24,
    },
    // 地图中心点
    center: {
      type: 'array',
      items: {
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
