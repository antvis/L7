import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const texture: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const data = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000.json').then((res) =>
    res.json(),
  );

  const provincelayerTop = new PolygonLayer({
    autoFit: true,
  })
    .source(data)
    .size(1000)
    .shape('extrude')
    .size(10000)
    .color('#0DCCFF')
    //   .active({
    //     color: 'rgb(100,230,255)',
    //   })
    .style({
      heightfixed: true,
      // pickLight: true,
      mapTexture:
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*bm0eRKOCcNoAAAAAAAAAAAAADmJ7AQ/original',
      // mapTexture:'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*3UcORbAv_zEAAAAAAAAAAAAADmJ7AQ/original',
      // raisingHeight: 10000,
      opacity: 0.8,
      // sidesurface: false,
    });

  scene.addLayer(provincelayerTop);

  return scene;
};
