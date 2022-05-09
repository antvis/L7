import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 90.268, 35.3628 ],
    zoom: 3
  })
});

scene.on('loaded', () => {
  const layer = new RasterLayer({
    zIndex: 1
  });
  layer.source(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 512,
        minZoom: 1,
        maxZoom: 18,
        zoomOffset: 0
      }
    }
  );

  scene.addLayer(layer);
});
