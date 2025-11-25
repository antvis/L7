import { LineLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const arrowDebug: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'dark',
      center: [120, 30],
      zoom: 10,
    },
  });

  console.log('=== Arrow Debug Demo Started ===');

  // 一条简单的水平线用于测试
  const simpleLineData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'test' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [119.9, 30],
            [120.1, 30],
          ],
        },
      },
    ],
  };

  const arrowConfig = {
    enable: true,
    spacing: 40, // 间距 (像素)
    width: 40, // 宽度 (像素)
    height: 5, // 长度 (像素)
    strokeWidth: 10, // 箭头线条宽度 (像素)
  };

  console.log('Creating line layer with arrow config:', arrowConfig);

  // 蓝色线，带白色箭头
  const lineLayer = new LineLayer({ name: 'debug_arrow' })
    .source(new Source(simpleLineData))
    .shape('line')
    .size(10) // 线宽 10px
    .color('#0000FF') // 改为蓝色
    .style({
      arrow: arrowConfig,
    });

  console.log('Line layer created, adding to scene...');
  scene.addLayer(lineLayer);
  console.log('Line layer added to scene');

  // 添加一条不带箭头的对照线 - 青色
  const normalLine = new LineLayer({ name: 'normal_line' })
    .source(
      new Source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [119.9, 30.05],
                [120.1, 30.05],
              ],
            },
          },
        ],
      }),
    )
    .shape('line')
    .size(8)
    .color('#00FFFF'); // 改为青色对照线，不带箭头

  scene.addLayer(normalLine);
  console.log('Normal line (without arrows) added for comparison - cyan color');

  // 延迟检查图层配置
  setTimeout(() => {
    const config = lineLayer.getLayerConfig();
    console.log('Layer config after add:', config);
    console.log('Arrow config from layer:', (config as any).arrow);
  }, 1000);

  return scene;
};
