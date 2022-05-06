import { Scene, RasterTileLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 121.268, 30.3628 ],
    pitch: 0,
    zoom: 2
  })
});

scene.on('loaded', () => {
  const layer = new RasterTileLayer({
    zIndex: 1
  });
  layer.source(
    'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 22,
        zoomOffset: 0
      }
    }
  );

  scene.addLayer(layer);
});
