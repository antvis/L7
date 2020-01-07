import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 110.19382669582967, 40.258134 ],
    pitch: 0,
    zoom: 3,
    style: 'dark'
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/49a796db-944b-4c35-aa97-1015f0a407f1.json'
)
  .then(res => res.json())
  .then(data => {
    data.features = data.features.map(function(fe) {
      if (fe.properties.saldo < 0) {
        fe.geometry.coordinates = fe.geometry.coordinates.reverse();
      }
      return fe;
    });
    const layer = new LineLayer({
      autoFit: true
    })
      .source(data)
      .shape('line')
      .size('saldo', [ 1, 2 ])
      .color('saldo', function(v) {
        return v < 0 ? 'rgb(60,255,255)' : 'rgb(255,255,60)';
      })
      .animate({
        enable: true,
        interval: 0.1,
        duration: 3,
        trailLength: 1
      })
      .style({
        opacity: 0.8
      });
    scene.addLayer(layer);
  });
