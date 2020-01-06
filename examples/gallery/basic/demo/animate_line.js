import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ -74.006, 40.7128 ],
    zoom: 15,
    style: 'dark'
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/5592c737-1c70-4d6b-82c1-e74e5a019b04.json'
)
  .then(res => res.json())
  .then(data => {
    const lineLayer = new LineLayer()
      .source(data, {
        parser: {
          type: 'json',
          coordinates: 'path'
        }
      })
      .size(3)
      .shape('line')
      .color('color', v => {
        return `rgb(${v[0]})`;
      })
      .animate({
        interval: 0.5,
        trailLength: 0.4,
        duration: 4
      });
    scene.addLayer(lineLayer);
  });
