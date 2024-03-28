import { ImageLayer, PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [121.268, 30.3628],
    zoom: 10,
  }),
});
scene.on('loaded', () => {
  const baseLayer = new RasterLayer({
    zIndex: 0,
  });
  baseLayer.source('https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
    },
  });

  const fill = new PolygonLayer()
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100.959388, 41.619522],
                [101.229887, 41.572654],
                [101.16971, 41.377836],
                [100.900015, 41.424628],
                [100.959388, 41.619522],
              ],
            ],
          },
        },
      ],
    })
    .shape('line')
    .color('red')
    .size(1)
    .style({ opacity: 1 });
  const layer = new ImageLayer({
    autoFit: true,
  });
  layer.source(
    'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

    {
      parser: {
        type: 'image',
        coordinates: [
          [100.959388, 41.619522],
          [101.229887, 41.572654],
          [101.16971, 41.377836],
          [100.900015, 41.424628],
        ],
      },
    },
  );
  scene.addLayer(baseLayer);
  scene.addLayer(layer);
  scene.addLayer(fill);
});
