// @ts-ignore
import { PolygonLayer } from '@antv/l7-layers';
import { Map } from '@antv/l7-maps';
import { Scene } from '../src/';
describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  el.style.width = '500px';
  el.style.height = '500px';
  document.querySelector('body')?.appendChild(el);
  const scene = new Scene({
    id: 'test-div-id',
    map: new Map({
      center: [110.19382669582967, 30.258134],
      pitch: 0,
      zoom: 2,
    }),
  });
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const layer = new PolygonLayer({
        name: '01',
      });

      layer
        .source(data)
        .size('name', [0, 10000, 50000, 30000, 100000])
        .color('name', [
          '#2E8AE6',
          '#69D1AB',
          '#DAF291',
          '#FFD591',
          '#FF7A45',
          '#CF1D49',
        ])
        .shape('fill')
        .select(true)
        .style({
          opacity: 1.0,
        });
      scene.addLayer(layer);
    });
  it('scene l7 map method', () => {
    // console.log(scene.getZoom());
  });
});
