import { Scene, GaodeMapV2, ExportImage } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
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
  const exportImage = new ExportImage({
    onExport: (base64) => {
      alert(base64);
    },
  });
  scene.addControl(exportImage);
});
