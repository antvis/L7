import { LineLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const arrow: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [120.15, 30.25],
      zoom: 13,
    },
  });

  // 模拟道路路径数据
  const roadData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: '主干道',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.1, 30.2],
            [120.12, 30.22],
            [120.15, 30.24],
            [120.18, 30.26],
            [120.2, 30.28],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          name: '支路',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.1, 30.28],
            [120.12, 30.26],
            [120.14, 30.24],
            [120.16, 30.22],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          name: '环形路',
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.18, 30.2],
            [120.2, 30.21],
            [120.21, 30.23],
            [120.2, 30.25],
            [120.18, 30.26],
            [120.16, 30.25],
            [120.15, 30.23],
            [120.16, 30.21],
            [120.18, 30.2],
          ],
        },
      },
    ],
  };

  const source = new Source(roadData);

  // 创建带箭头的线图层 - 蓝色线条
  const lineLayer = new LineLayer({ name: 'arrow_line' })
    .source(source)
    .shape('line')
    .size(6)
    .color('#1890ff')
    .style({
      arrow: {
        enable: true,
        spacing: 30, // 间距 (像素)
        width: 10, // 宽度 (像素)
        length: 5, // 长度 (像素)
        strokeWidth: 5,
        color: 'rgba(255, 94, 0, 1)', // 黄色箭头
      },
    });

  scene.addLayer(lineLayer);

  // 添加一个白色箭头的测试图层
  const whiteArrowLayer = new LineLayer({ name: 'white_arrow_line' })
    .source(
      new Source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [120.1, 30.3],
                [120.15, 30.3],
                [120.2, 30.3],
              ],
            },
          },
        ],
      }),
    )
    .shape('line')
    .size(6)
    .color('red')
    .style({
      arrow: {
        enable: true,
        spacing: 30, // 间距 (像素)
        width: 10, // 宽度 (像素)
        length: 5, // 长度 (像素)
        strokeWidth: 5,
      },
    });

  scene.addLayer(whiteArrowLayer);

  return scene;
};
