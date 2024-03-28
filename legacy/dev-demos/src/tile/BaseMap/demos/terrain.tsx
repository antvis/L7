//@ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
//@ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map2',
      map: new Map({
        center: [130, 30],
        pitch: 0,
        zoom: 1.5,
      }),
    });
   const url ='https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}@2x.webp?sku=101dlMrbPU6hW&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY5YzJzczA2ejIzM29hNGQ3emFsMXgifQ.az9JUrQP7klCgD3W-ueILQ'
    scene.on('loaded', () => {
      const layer = new RasterLayer()
        .source(
          'https://tiles{1-3}.geovisearth.com/base/v1/terrain_rgb/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
          {
            parser: {
              type: 'rasterTile',
              dataType:'terrainRGB',
              tileSize: 256,
              zoomOffset: 0,
            },
          },
        )
        .style({
          clampLow: false,
          clampHigh: false,
          domain: [0, 7000],
          rampColors: {
            type:'linear',
            colors: ['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850'],
            positions: [0,200,500,1000,2000,7000], // '#1a9850'
          }
        });
      scene.addLayer(layer);
    });
  }, []);
  return (
    <div
      id="map2"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
