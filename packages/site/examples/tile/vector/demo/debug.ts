// @ts-ignore
import { Scene, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
 
  map: new GaodeMapV2({
    center: [120, 30],
    // zoom: 12,
    zoom: 12,
  }),
});

const debugerLayer = new TileDebugLayer();
scene.addLayer(debugerLayer);
 
