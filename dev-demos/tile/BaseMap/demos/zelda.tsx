// @ts-ignore
import { TileDebugLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';
import * as wktParser from 'wellknown';

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
      
        const layer1 = new RasterLayer({
        zIndex: 1,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
          maxZoom:8,
          warp:false
        },
      });
      layer1.on('inited',()=>{
        const source = layer1.getSource();
        const tileSet = source.tileset;
        tileSet.on('tiles-load-start',()=>{
            console.log('tile start');
        })
        tileSet.on('tiles-load-finished',()=>{
            console.log('tile finished');
        })
        console.log(tileSet);
      })
      
      const debugLayer = new TileDebugLayer();
      scene.addLayer(layer1);
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
