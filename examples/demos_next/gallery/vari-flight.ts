import { LineLayer, PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const variFlight: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'dark',
      center: [40, 40.16797],
      zoom: 2.5,
    },
  });

  await scene.addImage(
    'plane',
    'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
  );

  const [world, dot, flyline] = await Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json',
    ).then((d) => d.json()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json',
    ).then((d) => d.text()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json',
    ).then((d) => d.text()),
  ]);

  const dotData = eval(dot);
  // @ts-ignore
  const flydata = eval(flyline).map((item) => {
    // @ts-ignore
    const latlng1 = item.from.split(',').map((e) => {
      return e * 1;
    });
    // @ts-ignore
    const latlng2 = item.to.split(',').map((e) => {
      return e * 1;
    });
    return { coord: [latlng1, latlng2] };
  });

  const worldLine = new LineLayer().source(world).color('#41fc9d').size(0.5).style({
    opacity: 0.4,
  });
  const dotPoint = new PointLayer()
    .source(dotData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .color('#ffed11')
    .animate({ enable: options.animate })
    .size(40);
  const flyLine = new LineLayer({ blend: 'normal' })
    .source(flydata, {
      parser: {
        type: 'json',
        coordinates: 'coord',
      },
    })
    .color('#ff6b34')
    .texture('plane')
    .shape('arc')
    .size(15)
    .animate(
      !options.animate
        ? { enable: false }
        : {
            duration: 1,
            interval: 0.2,
            trailLength: 0.5,
          },
    )
    .style({
      textureBlend: 'replace',
      lineTexture: true, // 开启线的贴图功能
      iconStep: 10, // 设置贴图纹理的间距
    });

  const flyLine2 = new LineLayer()
    .source(flydata, {
      parser: {
        type: 'json',
        coordinates: 'coord',
      },
    })
    .color('#ff6b34')
    .shape('arc')
    .size(1)
    .style({
      lineType: 'dash',
      dashArray: [5, 5],
      opacity: 0.5,
    });
  scene.addLayer(worldLine);
  scene.addLayer(dotPoint);
  scene.addLayer(flyLine2);
  scene.addLayer(flyLine);

  return scene;
};
