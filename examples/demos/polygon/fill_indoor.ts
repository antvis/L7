import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fill_indoor: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'normal',
      center: [120.103541, 30.263548],
      zoom: 18,
      pitch: 0,
    },
  });

  const data = await fetch(
    'https://mdn.alipayobjects.com/antforest/afts/file/A*ku97QoGhLVgAAAAAQZAAAAgAerd2AQ/original_long_text_2025-06-30-21-38-50.json',
  ).then((res) => res.json());

  // 过滤出多边形数据
  const polygonData = {
    type: 'FeatureCollection',
    features: data.features.filter((item: any) => item.geometry.type === 'Polygon'),
  };

  // 使用新的Layer层相对坐标功能
  const layer = new PolygonLayer({
    autoFit: true,
    enableRelativeCoordinates: false,
  })
    .source(polygonData, {
      parser: {
        type: 'geojson',
      },
    })
    .shape('line')
    .size(2)
    .color('#C997C7')
    .style({
      opacity: 1.0,
      lineType: 'solid',
      // 启用相对坐标系，Layer会自动处理坐标转换
    });

  scene.addLayer(layer);

  // 监听图层事件
  layer.on('click', () => {
    // 交互计算会自动使用绝对坐标
  });

  layer.on('inited', () => {
    // 图层初始化完成后，可以获取相对坐标信息
  });

  return scene;
};
