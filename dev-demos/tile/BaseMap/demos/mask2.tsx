// @ts-ignore
import { Scene, RasterLayer, PolygonLayer, PointLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
   const scene = new Scene({
        id: 'map',
      
        map: new Map({
          center: [120.165, 30.26],
          pitch: 0,
          zoom: 5,
        //   style: 'dark',
        }),
      });
      const maskPointData = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                110.64070700180974,
                38.725170221383365
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                117.05859241946035,
                41.44428218345186
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                114.98363698367831,
                37.113784885036424
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                118.77967948635097,
                37.47208097958061
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                113.729012766695,
                39.22535473120385
              ],
              "type": "Point"
            }
          }
        ]
      }
      const maskData = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                [
                  [
                    99.70402975806178,
                    36.598520593127276
                  ],
                  [
                    99.70402975806178,
                    23.990050715201292
                  ],
                  [
                    114.1889649431626,
                    23.990050715201292
                  ],
                  [
                    114.1889649431626,
                    36.598520593127276
                  ],
                  [
                    99.70402975806178,
                    36.598520593127276
                  ]
                ]
              ],
              "type": "Polygon"
            }
          }
        ]
      };
    
      const polygonLayer = new PolygonLayer({
        visible:false,
        // maskOperation:'or',
      }).source(maskData).shape('fill').color('#f00').style({opacity:0.4});
      const url1 =
        'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    
    
      const layer1 = new RasterLayer({
        // zIndex: 1,
        // maskLayers: [polygonLayer],
        // enableMask:true,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });
      scene.on('loaded',  () => {
        
        
        scene.addLayer(polygonLayer);
        scene.addLayer(layer1);
        setTimeout(() => {
          layer1.addMask(polygonLayer);
          // layer1.enableMask();
          scene.render();
        }, 2000)
      
      })
      
      
      
      
   
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
