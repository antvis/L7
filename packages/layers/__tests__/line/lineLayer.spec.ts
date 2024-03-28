import { TestScene } from '@antv/l7-test-utils';
import LineLayer from '../../src/line/index';
describe('pointLayer', () => {
  let scene: any;
  const path = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.09393, 30.379933],
            [120.400997, 30.461848],
            [120.529126, 30.305579],
            [120.504826, 30.129957],
            [120.310423, 30.017165],
            [120.091721, 29.971246],
            [119.921619, 29.97316],
          ],
        },
      },
    ],
  };
  const arcLine = `
  from,to,value,type,lng1,lat1,lng2,lat2
鎷夎惃,娴疯タ,6.91,move_out,91.111891,29.662557,97.342625,37.373799
鎷夎惃,鎴愰兘,4.79,move_out,91.111891,29.662557,104.067923,30.679943
鎷夎惃,閲嶅簡,2.41,move_out,91.111891,29.662557,106.530635,29.544606
鎷夎惃,鍖椾含,2.05,move_out,91.111891,29.662557,116.395645,39.929986
鎷夎惃,瑗垮畞,1.7,move_out,91.111891,29.662557,101.767921,36.640739
鎷夎惃,涓婃捣,1.06,move_out,91.111891,29.662557,121.487899,31.249162`;

  beforeEach(() => {
    scene = TestScene();
  });

  it('lineLayer line', () => {
    const layer = new LineLayer({})
      .source(path)
      .size(0.5)
      .shape('line')
      .active(true)
      .color('#1558AC');
    scene.addLayer(layer);
  });
  it('lineLayer simple', () => {
    const layer = new LineLayer({})
      .source(path)
      .size(0.5)
      .shape('simple')
      .active(true)
      .color('#1558AC');
    scene.addLayer(layer);
  });

  // arc line
  it('lineLayer arc', () => {
    const layer = new LineLayer({
      blend: 'additive',
    })
      .source(arcLine, {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .size(1)
      .shape('arc')
      .color('#8C1EB2')
      .style({
        opacity: 0.8,
        blur: 0.99,
      });
    scene.addLayer(layer);
  });

  // arc line
  it('lineLayer arc3d', () => {
    const layer = new LineLayer({
      blend: 'additive',
    })
      .source(arcLine, {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .size(1)
      .shape('arc3d')
      .color('#8C1EB2')
      .style({
        opacity: 0.8,
        blur: 0.99,
      });
    scene.addLayer(layer);
  });

  // arc line
  it('lineLayer greacircle', () => {
    const layer = new LineLayer({
      blend: 'additive',
    })
      .source(arcLine, {
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
      .color('#8C1EB2')
      .style({
        opacity: 0.8,
        blur: 0.99,
      });
    scene.addLayer(layer);
  });

  // flow line
  it('lineLayer flow', () => {
    const layer = new LineLayer({
      blend: 'additive',
    })
      .source(arcLine, {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .scale('value', {
        type: 'quantile',
      })
      .size(1)
      .shape('flowline')
      .color('#8C1EB2')
      .style({
        opacity: {
          field: 'value',
          value: [0.2, 0.4, 0.6, 0.8],
        },
        gapWidth: 2,
        offsets: {
          field: 'value',
          value: () => {
            return [10 + Math.random() * 20, 10 + Math.random() * 20];
          },
        }, // 支持数据映射
        strokeWidth: 1,
        strokeOpacity: 1,
        stroke: '#000',
      });
    scene.addLayer(layer);
  });
  it('lineLayer wall', () => {
    const layer = new LineLayer({})
      .source(path)
      .size(20)
      .size(20)
      .shape('wall')
      .texture('02')
      .style({
        opacity: 1,
        lineTexture: true, // 开启线的贴图功能
        iconStep: 40, // 设置贴图纹理的间距
        iconStepCount: 4,
        sourceColor: '#00BCD2',
        targetColor: '#0074d0',
      });
    scene.addLayer(layer);
  });
});
