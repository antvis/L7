import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 58.5,
    center: [ 111.8759, 30.6942 ],
    rotation: 0.519,
    zoom: 3.6116
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new HeatmapLayer({})
        .source(data)
        .size('capacity', [ 0, 1 ])
        .shape('heatmap3D')
      // weight映射通道
        .style({
          intensity: 10,
          radius: 5,
          opacity: 1.0,
          rampColors: {
            colors: [
              '#2E8AE6',
              '#69D1AB',
              '#DAF291',
              '#FFD591',
              '#FF7A45',
              '#CF1D49'
            ],
            positions: [ 0, 0.2, 0.4, 0.6, 0.8, 1.0 ]
          }
        });
      scene.addLayer(layer);
    });
});
