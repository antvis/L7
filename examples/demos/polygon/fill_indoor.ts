import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fill_indoor: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'dark',
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
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

  console.log('Original data:', {
    features: polygonData.features.length,
    sampleCoordinate: polygonData.features[0]?.geometry.coordinates[0][0],
    dataType: 'Absolute coordinates',
  });

  // 使用新的Layer层相对坐标功能
  const layer = new PolygonLayer({
    autoFit: true,
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
      enableRelativeCoordinates: true,
    });

  scene.addLayer(layer);

  // 监听图层事件
  layer.on('click', (e) => {
    console.log('Click event:', e);
    // 交互计算会自动使用绝对坐标
  });

  layer.on('inited', () => {
    // 图层初始化完成后，可以获取相对坐标信息
    console.log('Layer relative coordinate info:', {
      relativeOrigin: layer.getRelativeOrigin(),
      originalExtent: layer.getOriginalExtent(),
      hasAbsoluteData: layer.getAbsoluteData().length > 0,
      coordinateSystem: 'Relative coordinates enabled in layer',
    });
  });

  return scene;
};
