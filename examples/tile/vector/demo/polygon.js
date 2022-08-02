import { Scene, PolygonLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new Map({
    center: [ 100, 30.3628 ],
    zoom: 1
  })
});

scene.on('loaded', () => {
  const layer = new PolygonLayer({
    featureId: 'COLOR',
    sourceLayer: 'ecoregions2'
  });
  layer
    .source(
      'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
      {
        parser: {
          type: 'mvt',
          tileSize: 256,
          zoomOffset: 0,
          maxZoom: 9,
          extent: [ -180, -85.051129, 179, 85.051129 ]
        }
      }
    )
    .color('COLOR')
    .active(true);

  scene.addLayer(layer);
});
