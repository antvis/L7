import { TestScene } from '@antv/l7-test-utils';
import PointLayer from '../../src/point';
describe('pointLayer', () => {
  let scene: any;
  let layer: any;
  const data = [
    {
      lng: 120,
      lat: 30,
      value: 1,
    },
    {
      lng: 121,
      lat: 31,
      value: 2,
    },
  ];

  beforeEach(() => {
    scene = TestScene();
  });

  it('pontlayer extrude', () => {
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('cylinder')
      .size('t', function (level) {
        return [1, 1, level * 2 + 20];
      })
      .active(true)
      .color('#006CFF')
      .style({
        opacity: 0.6,
        opacityLinear: {
          enable: true, // true - false
          dir: 'up', // up - down
        },
        lightEnable: false,
      });
    scene.addLayer(layer);
  });

  // text
  it('pontlayer text', () => {
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('value', 'text')
      .size(12)
      .color('#084081')
      .style({
        textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
        spacing: 2, // 字符间距
        padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: '#ffffff', // 描边颜色
        strokeWidth: 2, // 描边宽度
        strokeOpacity: 1.0,
        // rotation: 60, // 常量旋转
        rotation: {
          // 字段映射旋转
          field: 'value',
          value: [30, 270],
        },
      });

    scene.addLayer(layer);
  });

  // radar
  it('pontlayer radar', () => {
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('radar')
      .size(100)
      .color('#d00')
      .style({
        speed: 5,
      })
      .animate(true);
    scene.addLayer(layer);
  });

  // normal
  it('pontlayer normal', () => {
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('dot')
      .size(1)
      .active(true)
      .color('red')
      .style({ opacity: 0.6 });
    scene.addLayer(layer);
  });
  // normal
  it('pontlayer fill', () => {
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(1000)
      .active(true)
      .color('red')
      .style({
        unit: 'meter',
        opacity: 0.6,
      });
    scene.addLayer(layer);
  });

  // image
  it('pontlayer image', () => {
    scene.addImage(
      'marker',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
    );
    layer = new PointLayer({
      name: 'layer',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('marker')
      .size(12)
      .active(true)
      .style({ opacity: 0.6 });
    scene.addLayer(layer);
  });

  // fillImage
  it('pontlayer fillImage', () => {
    scene.addImage(
      'marker',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
    );
    layer = new PointLayer({
      name: 'layer',
      layerType: 'fillImage',
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('marker')
      .size(12)
      .active(true)
      .style({ opacity: 0.6 });
    scene.addLayer(layer);
  });
});
