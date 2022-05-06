import { Scene, RasterTileLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 90.268, 35.3628 ],
    zoom: 3
  })
});

scene.on('loaded', () => {
  const layer = new RasterTileLayer({
    zIndex: 1
  });
  layer.source('https://a.tile.osm.org/{z}/{x}/{y}.png', {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      minZoom: 0,
      maxZoom: 22,
      zoomOffset: 0
    }
  });

  scene.addLayer(layer);
});
