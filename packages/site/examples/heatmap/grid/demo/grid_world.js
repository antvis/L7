import { Scene, HeatmapLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    pitch: 0,
    center: [ 110.097892, 33.853662 ],
    zoom: 4.056
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/3dadb1f5-8f54-4449-8206-72db6e142c40.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new HeatmapLayer({
        autoFit: true
      })
        .source(data, {
          transforms: [
            {
              type: 'hexagon',
              size: 5 * 100000
            }
          ]
        })
        .shape('circle')
        .active(false)
        .color('#aaa')
        .style({
          coverage: 0.7,
          angle: 0,
          opacity: 1.0
        });
      scene.addLayer(layer);
    });
});
