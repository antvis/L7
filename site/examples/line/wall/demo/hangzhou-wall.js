import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [119.297868, 29.732983],
    zoom: 7.11,
    rotation: 1.22,
    pitch: 45.42056074766357,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({}).source(data).size(40).shape('wall').style({
        opacity: 1,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
      });
      scene.addLayer(layer);
    });
});
