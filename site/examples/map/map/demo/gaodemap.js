import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-extension-maps';
new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
