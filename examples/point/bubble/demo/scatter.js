import { Scene } from '@antv/l7-scene';
import { PointLayer } from '@antv/l7-layers';
const scene = new Scene({
  id: 'map',
  type: 'amap',
  style: 'light',
  center: [ -121.24357, 37.58264 ],
  pitch: 0,
  zoom: 6.45
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/6c4bb5f2-850b-419d-afc4-e46032fc9f94.csv'
)
  .then(res => res.text())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'csv',
          x: 'Longitude',
          y: 'Latitude'
        }
      })
      .shape('circle')
      .size(4)
      .color('Magnitude', [
        '#0A3663',
        '#1558AC',
        '#3771D9',
        '#4D89E5',
        '#64A5D3',
        '#72BED6',
        '#83CED6',
        '#A6E1E0',
        '#B8EFE2',
        '#D7F9F0'
      ])
      .style({
        opacity: 0.5,
        strokeWidth: 0
      });

    scene.addLayer(pointLayer);
  });
