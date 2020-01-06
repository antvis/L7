import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 0,
    zoom: 16,
    style: 'dark'
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json'
)
  .then(res => res.json())
  .then(data => {
    const layer = new LineLayer()
      .source(data)
      .size(1)
      .shape('line')
      .color('#ff893a')
      .animate({
        interval: 0.4,
        duration: 1,
        trailLength: 0.8
      });
    scene.addLayer(layer);
  });
