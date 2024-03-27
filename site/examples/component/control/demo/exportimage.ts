import { ExportImage, GaodeMap, PolygonLayer, Scene } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
    WebGLParams: {
      preserveDrawingBuffer: true,
    },
  }),
});
scene.on('loaded', () => {
  const polygonLayer = new PolygonLayer({});
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
  const exportImage = new ExportImage({
    onExport: (base64) => {
      alert(base64);
    },
  });
  scene.addControl(exportImage);
});
