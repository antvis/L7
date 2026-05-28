import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const imageTextAnchor: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  await Promise.all([
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    ),
    scene.addImage(
      '01',
      'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
    ),
    scene.addImage(
      '02',
      'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
    ),
  ]);

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
  ).then((res) => res.json());

  // 参考点位 - 红色小圆点标记原始坐标
  const referenceLayer = new PointLayer({ zIndex: 10 })
    .source(data, {
      parser: { type: 'json', x: 'longitude', y: 'latitude' },
    })
    .shape('circle')
    .size(3)
    .active(false)
    .color('#FF4D4F')
    .style({ opacity: 1 });

  // 图标图层 - image 类型，支持 anchor
  const imageLayer = new PointLayer()
    .source(data, {
      parser: { type: 'json', x: 'longitude', y: 'latitude' },
    })
    .shape('name', ['00', '01', '02'])
    .size(16)
    .style({
      anchor: 'bottom',
    });

  // 文字图层 - 使用 textAnchor 控制文字锚点
  const textLayer = new PointLayer()
    .source(data, {
      parser: { type: 'json', x: 'longitude', y: 'latitude' },
    })
    .shape('name', 'text')
    .color('#333')
    .size(12)
    .style({
      textAnchor: 'top',
      textOffset: [0, 0],
      stroke: '#fff',
      strokeWidth: 2,
    });

  scene.addLayer(referenceLayer);
  scene.addLayer(imageLayer);
  scene.addLayer(textLayer);

  // GUI 交互控制
  imageTextAnchor.extendGUI = (gui) => {
    const config = {
      imageAnchor: 'bottom',
      textAnchor: 'top',
    };

    const anchorOptions = [
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

    const imageAnchorController = gui
      .add(config, 'imageAnchor', anchorOptions)
      .name('图标 Anchor')
      .onChange((value: string) => {
        imageLayer.style({ anchor: value });
        scene.render();
      });

    const textAnchorController = gui
      .add(config, 'textAnchor', anchorOptions)
      .name('文字 TextAnchor')
      .onChange((value: string) => {
        textLayer.style({ textAnchor: value });
        scene.render();
      });

    return [imageAnchorController, textAnchorController];
  };

  return scene;
};
