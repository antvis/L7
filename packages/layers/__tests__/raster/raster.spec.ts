import { TestScene } from '@antv/l7-test-utils';
import RasterLayer from '../../src/raster/index';
import { raster_data } from './data';

describe('RasterLayer', () => {
  let scene: any;
  beforeEach(() => {
    scene = TestScene();
  });
  // raster data
  it('rasterLayer', async () => {
    const layer = new RasterLayer({});
    layer
      .source(new Int16Array(raster_data), {
        parser: {
          type: 'raster',
          width: 10,
          height: 10,
          extent: [73, 17, 135.95, 53.95],
        },
      })
      .style({
        opacity: 1,
        clampLow: false,
        clampHigh: false,
        domain: [-0, 500],
        rampColors: {
          type: 'linear',
          colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a'].reverse(),
          positions: [0, 50, 100, 150, 300, 500],
        },
      });

    scene.addLayer(layer);
  });

  // // raster rgb
  // it('rasterLayer rgb', async () => {
  //     const bandsValues = raster_rgb.map(v => new Int16Array(v))
  //     const layer = new RasterLayer({ zIndex: 10 });
  //     layer
  //         .source(
  //             bandsValues,
  //             {
  //                 parser: {
  //                     type: 'rgb',
  //                     width: 10,
  //                     height: 10,
  //                     bands: [4, 3, 2], // 从零开始
  //                     extent: [
  //                         130.39565357746957, 46.905730725742366, 130.73364094187343,
  //                         47.10217234153133,
  //                     ],
  //                 },
  //             },
  //         )
  //         .style({
  //             opacity: 1,
  //         });
  //     scene.addLayer(layer);

  // });
});
