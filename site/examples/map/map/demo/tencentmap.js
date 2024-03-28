import { Scene } from '@antv/l7';
import { TencentMap } from '@antv/l7-maps';

new Scene({
  id: 'map',
  map: new TencentMap({
    style: 'style1',
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
