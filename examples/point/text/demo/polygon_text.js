import { Scene, PolygonLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'light',
    center: [ -96, 37.8 ],
    zoom: 3
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
)
  .then(res => res.json())
  .then(data => {
    const layer = new PolygonLayer({})
      .source(data)
      .color('blue')
      .shape('name', 'text')
      .size(18)
      .style({
        opacity: 0.8
      });
    scene.addLayer(layer);
  });
