// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [130, 30],
    pitch: 0,
    zoom: 1.5,
  }),
});
scene.on('loaded', () => {
  const layer = new RasterLayer()
    .source(
      'https://tiles{1-3}.geovisearth.com/base/v1/terrain_rgb/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          type: 'rasterTile',
          dataType: 'customTerrainRGB',
          // dataType:'terrainRGB',
          tileSize: 256,
          zoomOffset: 0,
          getCustomData: async(tile,cb) => {
            const URL= `https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Zij0QLRrV-oAAAAAAAAAAAAADmJ7AQ/original`;
          fetch(URL).then((res) => res.arrayBuffer().then((data) => {
            cb(null,data)
          }));
             
            },
        },
        
      },
    )
    .style({
      clampLow: false,
      clampHigh: false,
      domain: [0, 255],
      noDataValue: 0,
      rampColors: { 
        type:'custom',
        colors: [ 'yellow','#f00', '#b3e2cd','#fdcdac'],
        positions: [0, 10,102, 116, 148],
      }
    });

  scene.addLayer(layer);
});


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
