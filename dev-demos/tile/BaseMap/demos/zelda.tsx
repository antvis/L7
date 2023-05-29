// @ts-ignore
import { TileDebugLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
        id: 'map',
       
        map: new Map({
          center: [113.270854, 23.141717],
          zoom: 0,
          maxZoom:8,
      
        }),
      });
      
      const url1 =
        'https://raw.githubusercontent.com/Slluxx/TOTK-Interactive-Map/tiles/assets/tiles/groundtiles/{z}/{x}/{y}.png';
      const url2 = 'https://switch-cdn.vgjump.com/gamewiki/maps/ground/{z}_{x}_{y}.jpg'
        const layer1 = new RasterLayer({
        zIndex: 1,
      }).source(url2, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
          maxZoom:8,
          warp:false
        },
      });
      const debugLayer = new TileDebugLayer();
      scene.addLayer(layer1);
      scene.addLayer(debugLayer);
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
