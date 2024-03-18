// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new (process.env.CI ? Map : GaodeMap)({
        center: [120.188193, 30.292542],
        pitch: 0,
        zoom: 13,
      }),
    });

    const layer = new PointLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.188193, 30.292542],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.201665, 30.26873],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.225209, 30.290802],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.189641, 30.293248],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.189389, 30.292542],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.190837, 30.293303],
            },
          },
        ],
      })
      .size(100)
      .color('#f00')
      .shape('radar')
      .style({
        unit: 'meter',
        speed: 5,
      })
      .animate(!process.env.CI)
      .active(true);

    // const layer2 = new PointLayer()
    // .source(
    //   {
    //     "type": "FeatureCollection",
    //     "features": [
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.188193, 30.292542]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.201665, 30.26873]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.225209, 30.290802]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.189641, 30.293248]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.189389, 30.292542]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [120.190837, 30.293303]
    //         }
    //       }
    //     ]
    //   }

    // )
    // .size(5)
    // .color('#0f0')
    // .shape('circle')
    // .style({
    //   unit:'pixel',
    // })
    // .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      // scene.addLayer(layer2);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
