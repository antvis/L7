import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * 多底图切换演示
 * 展示如何在不同地图提供商之间切换（高德、百度、腾讯、天地图等）
 *
 * 使用方法：在 GUI 面板中选择不同的 map 类型来切换底图
 * - Map: L7 默认地图
 * - AMap: 高德地图
 * - BaiduMap: 百度地图
 * - TencentMap/TMap: 腾讯地图
 * - GoogleMap: Google 地图
 * - Mapbox: Mapbox
 * - MapLibre: MapLibre
 */
export const multiBasemap: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    map: 'AMap', // 默认使用高德地图
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 10,
      style: 'light',
    },
  });

  // 添加示例数据点 - 中国主要城市
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: '上海', value: 100 },
        geometry: {
          type: 'Point',
          coordinates: [121.4737, 31.2304],
        },
      },
      {
        type: 'Feature',
        properties: { name: '北京', value: 95 },
        geometry: {
          type: 'Point',
          coordinates: [116.4074, 39.9042],
        },
      },
      {
        type: 'Feature',
        properties: { name: '广州', value: 85 },
        geometry: {
          type: 'Point',
          coordinates: [113.2644, 23.1291],
        },
      },
      {
        type: 'Feature',
        properties: { name: '深圳', value: 90 },
        geometry: {
          type: 'Point',
          coordinates: [114.0579, 22.5431],
        },
      },
      {
        type: 'Feature',
        properties: { name: '成都', value: 80 },
        geometry: {
          type: 'Point',
          coordinates: [104.0665, 30.5723],
        },
      },
      {
        type: 'Feature',
        properties: { name: '杭州', value: 88 },
        geometry: {
          type: 'Point',
          coordinates: [120.1551, 30.2741],
        },
      },
    ],
  };

  const layer = new PointLayer({ autoFit: true })
    .source(data)
    .shape('circle')
    .size('value', [15, 30])
    .color('#f00')
    .active(true)
    .style({
      opacity: 0.8,
      strokeWidth: 2,
      strokeColor: '#fff',
    });

  scene.addLayer(layer);

  return scene;
};
