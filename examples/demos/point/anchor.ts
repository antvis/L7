import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const anchor: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.435159, 31.256971],
      zoom: 14.89,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
  ).then((res) => res.json());

  // 参考点位图层 - 显示原始坐标位置
  const referenceLayer = new PointLayer({
    zIndex: 10,
  })
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('circle')
    .size(3)
    .active(false)
    .color('#FF4D4F')
    .style({
      opacity: 1,
    });

  // 气泡图层 - 使用 anchor 属性
  const bubbleLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('circle')
    .size(30)
    .active(false)
    .color('#5B8FF9')
    .style({
      stroke: '#fff',
      strokeWidth: 2,
      opacity: 0.8,
      anchor: 'bottom', // 气泡底部对齐到坐标位置
    });

  // 文字图层 - 使用 textAnchor 属性
  const textLayer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('name', 'text')
    .color('#333')
    .size(14)
    .style({
      textAnchor: 'top', // 文字顶部对齐到坐标位置
      textOffset: [0, 0],
      stroke: '#fff',
      strokeWidth: 2,
    });

  scene.addLayer(referenceLayer);
  scene.addLayer(bubbleLayer);
  scene.addLayer(textLayer);

  // GUI 控制
  anchor.extendGUI = (gui) => {
    const config = {
      bubbleAnchor: 'bottom',
      textAnchor: 'top',
    };

    const anchors = [
      'center',
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-center',
      'bottom-left',
      'left',
      'top-left',
    ];

    const bubbleController = gui
      .add(config, 'bubbleAnchor', anchors)
      .name('气泡 Anchor')
      .onChange((value: string) => {
        bubbleLayer.style({
          anchor: value,
        });
        scene.render();
      });

    const textController = gui
      .add(config, 'textAnchor', anchors)
      .name('文字 TextAnchor')
      .onChange((value: string) => {
        textLayer.style({
          textAnchor: value,
        });
        scene.render();
      });

    return [bubbleController, textController];
  };

  return scene;
};
