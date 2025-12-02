import { LineLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

/**
 * Arrow Line Demo
 *
 * 该示例演示如何在 L7 中为线图层添加箭头效果，常用于导航、路径方向标识。
 *
 * 支持的箭头参数：
 * - enable: 是否显示箭头
 * - spacing: 箭头间距（像素）
 * - width: 箭头宽度（像素）
 * - length: 箭头长度（像素）
 * - strokeWidth: 箭头线条宽度（像素）
 * - color: 箭头颜色（支持 CSS 色值）
 *
 * 箭头为 V 形轮廓，非实心三角，叠加在线本身之上。
 * 线和箭头可分别设置颜色，实现如“蓝色线+黄色箭头”效果。
 *
 * 示例配置：
 * arrow: {
 *   enable: true,
 *   spacing: 80,
 *   width: 30,
 *   length: 40,
 *   strokeWidth: 4,
 *   color: '#FFFF00',
 * }
 */

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
    spacing: 15, // 间距 (像素)
    width: 15, // 宽度 (像素)
    length: 3, // 长度 (像素)
    strokeWidth: 4, // 箭头线条宽度 (像素)
    color: 'rgba(255, 94, 0, 1)', // 黄色箭头
  };

  console.log('Creating line layer with arrow config:', arrowConfig);

  // 蓝色线，带黄色箭头
  const lineLayer = new LineLayer({ name: 'debug_arrow' })
    .source(new Source(simpleLineData))
    .shape('line')
    .size(10) // 线宽 10px
    .color('#0000FF') // 蓝色
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
