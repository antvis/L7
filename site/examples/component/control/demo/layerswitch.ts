import { GaodeMap, LayerSwitch, LineLayer, PolygonLayer, Scene } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
});
scene.on('loaded', () => {
  const polygonLayer = new PolygonLayer({
    name: '填充图层',
  });
  polygonLayer
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
                [120.143575, 30.239811],
                [120.143575, 30.247856],
                [120.151213, 30.247856],
                [120.151213, 30.239811],
                [120.143575, 30.239811],
              ],
            ],
          },
        },
      ],
    })
    .color('#ff0000')
    .style({
      opacity: 0.5,
    });
  scene.addLayer(polygonLayer);

  const lineLayer = new LineLayer({
    name: '边框图层',
  });
  lineLayer
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
                [120.143575, 30.239811],
                [120.143575, 30.247856],
                [120.151213, 30.247856],
                [120.151213, 30.239811],
                [120.143575, 30.239811],
              ],
            ],
          },
        },
      ],
    })
    .color('#700000')
    .size(2);
  scene.addLayer(lineLayer);

  const layerSwitch = new LayerSwitch({
    layers: [polygonLayer, lineLayer],
  });
  scene.addControl(layerSwitch);
});
