import { LineLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const greatcircle: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [107.77791556935472, 35.443286920228644],
      zoom: 2.9142882493605033,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt',
  ).then((res) => res.text());

  const layer = new LineLayer({
    blend: 'normal',
  })
    .source(data, {
      parser: {
        type: 'csv',
        x: 'lng1',
        y: 'lat1',
        x1: 'lng2',
        y1: 'lat2',
      },
    })
    .size(1)
    .shape('greatcircle')
    // .animate({
    //   enable: true,
    //   interval: 0.1,
    //   trailLength: 0.5,
    //   duration: 2,
    // })
    .color('#8C1EB2')
    .style({
      opacity: 0.8,
    });
  scene.addLayer(layer);

  return scene;
};
